const db = require('../config/db');
const csv = require('csv-parser');
const stream = require('stream');
const axios = require('axios');
const PDFDocument = require('pdfkit');

const parseDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        const parts = dateString.split('/');
        if (parts.length === 3) {
            const parsed = new Date(parts[2], parts[0] - 1, parts[1]);
            if (!isNaN(parsed.getTime())) return parsed;
        }
        return null;
    }
    return date;
};

exports.uploadTransactions = async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });
    
    const { id: userId, active_org_id: orgId } = req.user;
    const results = [];
    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);

    bufferStream.pipe(csv()).on('data', (data) => results.push(data)).on('end', async () => {
        if (results.length === 0) return res.status(400).json({ message: 'CSV file is empty.' });
        
        const headers = Object.keys(results[0]).map(h => h.toLowerCase());
        const isRawFile = (headers.includes('description') || headers.includes('details')) && headers.includes('amount');
        const isSummaryFile = headers.includes('income') && headers.includes('groceries');

        try {
            await db.query('BEGIN');
            if (isRawFile) {
                for (const row of results) {
                    const description = row['Description'] || row['description'] || row['Details'] || row['details'];
                    const amount = parseFloat(row['Amount'] || row['amount']);
                    const date = parseDate(row['Date'] || row['date']);
                    if (!description || isNaN(amount) || !date) continue;
                    const { data: { category } } = await axios.post('http://localhost:5001/categorize', { description });
                    await db.query(`INSERT INTO transactions (user_id, organization_id, transaction_date, description, amount, category) VALUES ($1, $2, $3, $4, $5, $6);`, [userId, orgId, date, description, amount, category]);
                }
            } else if (isSummaryFile) {
                const row = results[0];
                const date = new Date();
                const expenseCats = ['groceries', 'transport', 'eating_out', 'entertainment', 'utilities', 'healthcare', 'education', 'miscellaneous', 'rent', 'loan_repayment', 'insurance', 'shopping'];
                for (const cat of expenseCats) {
                    const key = Object.keys(row).find(k => k.toLowerCase().replace(/_/g, '') === cat.replace(/_/g, ''));
                    const amount = parseFloat(row[key]);
                    if (key && !isNaN(amount) && amount > 0) {
                        const desc = `Monthly Summary: ${cat}`;
                        const fCat = cat.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                        await db.query(`INSERT INTO transactions (user_id, organization_id, transaction_date, description, amount, category) VALUES ($1, $2, $3, $4, $5, $6);`, [userId, orgId, date, desc, -amount, fCat]);
                    }
                }
                const incomeKey = Object.keys(row).find(k => k.toLowerCase() === 'income');
                const incomeAmt = parseFloat(row[incomeKey]);
                 if (incomeKey && !isNaN(incomeAmt) && incomeAmt > 0) {
                    await db.query(`INSERT INTO transactions (user_id, organization_id, transaction_date, description, amount, category) VALUES ($1, $2, $3, $4, $5, $6);`, [userId, orgId, date, 'Monthly Income Summary', incomeAmt, 'Income']);
                }
            } else {
                await db.query('ROLLBACK');
                return res.status(400).json({ message: 'Could not determine CSV file type.' });
            }
            await db.query('COMMIT');
            res.status(200).json({ message: 'File processed successfully.' });
        } catch (error) {
            await db.query('ROLLBACK');
            console.error('Upload Error:', error);
            res.status(500).json({ message: 'Error saving transactions.' });
        }
    });
};

exports.addTransaction = async (req, res) => {
    const { id: userId, active_org_id: orgId } = req.user;
    const { description, amount, date } = req.body;
    if (!description || amount === undefined || !date) return res.status(400).json({ message: 'Missing required fields.' });
    try {
        const { data: { category } } = await axios.post('http://localhost:5001/categorize', { description });
        
        const queryText = `
            INSERT INTO transactions (user_id, organization_id, transaction_date, description, amount, category) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
        `;
        const values = [userId, orgId, new Date(date), description, parseFloat(amount), category];

        const { rows } = await db.query(queryText, values);
        res.status(201).json({ message: 'Transaction added successfully.', transaction: rows[0] });
    } catch (error) {
        console.error('Add Transaction Error:', error);
        res.status(500).json({ message: 'Error saving transaction.' });
    }
};

const getLatestSummaryData = async (userId, orgId) => {
    const scopeClause = orgId 
        ? `organization_id = $1` 
        : `user_id = $1 AND organization_id IS NULL`;
    const scopeValue = orgId || userId;

    const query = `
        WITH latest_month AS (
            SELECT date_trunc('month', MAX(transaction_date)) as month
            FROM transactions WHERE ${scopeClause}
        )
        SELECT
            COALESCE(SUM(CASE WHEN category = 'Groceries' THEN -amount ELSE 0 END), 0)::FLOAT as groceries,
            COALESCE(SUM(CASE WHEN category = 'Transport' THEN -amount ELSE 0 END), 0)::FLOAT as transport,
            COALESCE(SUM(CASE WHEN category = 'Food & Drinks' THEN -amount ELSE 0 END), 0)::FLOAT as eating_out,
            COALESCE(SUM(CASE WHEN category = 'Entertainment' THEN -amount ELSE 0 END), 0)::FLOAT as entertainment,
            COALESCE(SUM(CASE WHEN category = 'Shopping' THEN -amount ELSE 0 END), 0)::FLOAT as shopping,
            COALESCE(SUM(CASE WHEN category = 'Utilities' THEN -amount ELSE 0 END), 0)::FLOAT as utilities,
            COALESCE(SUM(CASE WHEN category = 'Healthcare' THEN -amount ELSE 0 END), 0)::FLOAT as healthcare,
            COALESCE(SUM(CASE WHEN category = 'Education' THEN -amount ELSE 0 END), 0)::FLOAT as education,
            COALESCE(SUM(CASE WHEN category = 'Rent/Mortgage' THEN -amount ELSE 0 END), 0)::FLOAT as rent,
            COALESCE(SUM(CASE WHEN category = 'Miscellaneous' THEN -amount ELSE 0 END), 0)::FLOAT as miscellaneous,
            COALESCE(SUM(CASE WHEN category = 'Loan Repayment' THEN -amount ELSE 0 END), 0)::FLOAT as loan_repayment,
            COALESCE(SUM(CASE WHEN category = 'Insurance' THEN -amount ELSE 0 END), 0)::FLOAT as insurance,
            COALESCE(SUM(CASE WHEN category = 'Income' THEN amount ELSE 0 END), 0)::FLOAT as income
        FROM transactions, latest_month
        WHERE ${scopeClause} AND date_trunc('month', transaction_date) = latest_month.month;
    `;
    const { rows } = await db.query(query, [scopeValue]);
    return rows[0];
};

exports.getSummary = async (req, res) => {
    try {
        const summaryData = await getLatestSummaryData(req.user.id, req.user.active_org_id);
        res.status(200).json(summaryData || {});
    } catch (error) {
        console.error('Get Summary Error:', error);
        res.status(500).json({ message: 'Server error while fetching summary.' });
    }
};

exports.getHistory = async (req, res) => {
    const { id: userId, active_org_id: orgId } = req.user;
    const scopeClause = orgId ? `organization_id = $1` : `user_id = $1 AND organization_id IS NULL`;
    const scopeValue = orgId || userId;
    try {
        const query = `
            SELECT date_trunc('month', transaction_date)::DATE as month_year,
                COALESCE(SUM(CASE WHEN category = 'Groceries' THEN -amount ELSE 0 END), 0)::FLOAT as groceries,
                COALESCE(SUM(CASE WHEN category = 'Transport' THEN -amount ELSE 0 END), 0)::FLOAT as transport,
                COALESCE(SUM(CASE WHEN category = 'Food & Drinks' THEN -amount ELSE 0 END), 0)::FLOAT as eating_out,
                COALESCE(SUM(CASE WHEN category = 'Entertainment' THEN -amount ELSE 0 END), 0)::FLOAT as entertainment,
                COALESCE(SUM(CASE WHEN category = 'Shopping' THEN -amount ELSE 0 END), 0)::FLOAT as shopping,
                COALESCE(SUM(CASE WHEN category = 'Utilities' THEN -amount ELSE 0 END), 0)::FLOAT as utilities,
                COALESCE(SUM(CASE WHEN category = 'Healthcare' THEN -amount ELSE 0 END), 0)::FLOAT as healthcare,
                COALESCE(SUM(CASE WHEN category = 'Rent/Mortgage' THEN -amount ELSE 0 END), 0)::FLOAT as rent
            FROM transactions
            WHERE ${scopeClause} AND amount < 0
            GROUP BY month_year ORDER BY month_year ASC;
        `;
        const { rows } = await db.query(query, [scopeValue]);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Get History Error:', error);
        res.status(500).json({ message: 'Server error while fetching history.' });
    }
};

exports.getPrediction = async (req, res) => {
    try {
        const summaryData = await getLatestSummaryData(req.user.id, req.user.active_org_id);
        if (!summaryData || !summaryData.income) return res.status(404).json({ message: 'Not enough data for prediction.' });
        const mlResponse = await axios.post('http://localhost:5001/predict', summaryData);
        res.status(200).json(mlResponse.data);
    } catch (error) {
        console.error('Prediction Error:', error);
        res.status(500).json({ message: 'Failed to get prediction.' });
    }
};

exports.analyzeBudget = async (req, res) => {
    const { spending, budgets } = req.body;
    try {
        if (!spending || !budgets) {
            return res.status(400).json({ message: 'Spending and budget data are required.' });
        }
        const mlResponse = await axios.post('http://localhost:5001/recommend_budget', { spending, budgets });
        res.status(200).json(mlResponse.data);
    } catch (error) {
        console.error('Budget Analysis Error:', error);
        res.status(500).json({ message: 'Failed to get budget analysis.' });
    }
};

exports.detectAnomalies = async (req, res) => {
    const { id: userId, active_org_id: orgId } = req.user;
    const scopeClause = orgId ? `organization_id = $1` : `user_id = $1 AND organization_id IS NULL`;
    const scopeValue = orgId || userId;
    try {
        const query = `
            SELECT transaction_id, description, category, amount, TO_CHAR(transaction_date, 'YYYY-MM-DD') as transaction_date 
            FROM transactions 
            WHERE ${scopeClause} AND amount < 0;
        `;
        const { rows: transactions } = await db.query(query, [scopeValue]);

        if (transactions.length < 5) {
            return res.status(200).json({ anomalies: [] });
        }
        
        const mlResponse = await axios.post('http://localhost:5001/detect_anomalies', transactions);
        res.status(200).json(mlResponse.data);
    } catch (error) {
        console.error('Anomaly Detection Error (Backend):', error);
        res.status(500).json({ message: 'Failed to detect anomalies.' });
    }
};

exports.generateReport = async (req, res) => {
    try {
        const summaryData = await getLatestSummaryData(req.user.id, req.user.active_org_id);
        if (!summaryData) return res.status(404).send('No data for report.');
        
        const doc = new PDFDocument({ margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=financial_report.pdf');
        doc.pipe(res);
        
        doc.fontSize(20).font('Helvetica-Bold').text('Monthly Financial Report', { align: 'center' }).moveDown(2);
        doc.fontSize(16).text('Expense Summary', { underline: true }).moveDown();

        const expenses = Object.entries(summaryData).filter(([key, value]) => key !== 'income' && value > 0).sort(([, a], [, b]) => b - a);
        let totalExpenses = 0;
        expenses.forEach(([key, value]) => {
            doc.fontSize(12).font('Helvetica').text(`${key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}:`, { continued: true }).font('Helvetica-Bold').text(` $${value.toFixed(2)}`);
            totalExpenses += value;
        });
        
        doc.moveDown();
        doc.fontSize(14).font('Helvetica-Bold');
        doc.text(`Total Expenses: $${totalExpenses.toFixed(2)}`);
        doc.text(`Total Income: $${(summaryData.income || 0).toFixed(2)}`);
        doc.text(`Net Savings: $${((summaryData.income || 0) - totalExpenses).toFixed(2)}`);
        
        doc.end();
    } catch (error) {
        console.error('Report Generation Error:', error);
        res.status(500).send('Could not generate PDF report.');
    }
};

