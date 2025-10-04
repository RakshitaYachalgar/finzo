// /api/transactions/history.js - Vercel Function for transaction history
const { createClient } = require('@supabase/supabase-js');
const { withAuth } = require('../_middleware/auth');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function historyHandler(req, res) {
    // Set CORS headers for all requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method === 'GET') {
        try {
            const userId = req.user.id;
            
            // Get transactions for the last 12 months, grouped by month and category
            const { data: transactions, error } = await supabase
                .from('transactions')
                .select('transaction_date, category, amount')
                .eq('user_id', userId)
                .gte('transaction_date', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
                .lt('amount', 0) // Only expenses (negative amounts)
                .order('transaction_date', { ascending: true });

            if (error) {
                throw error;
            }

            // Group transactions by month and category
            const monthlyData = {};
            
            transactions.forEach(transaction => {
                const monthYear = transaction.transaction_date.substring(0, 7) + '-01'; // Format: YYYY-MM-01
                const category = transaction.category.toLowerCase().replace(/\s+/g, '_');
                const amount = Math.abs(parseFloat(transaction.amount));

                if (!monthlyData[monthYear]) {
                    monthlyData[monthYear] = {};
                }

                if (!monthlyData[monthYear][category]) {
                    monthlyData[monthYear][category] = 0;
                }

                monthlyData[monthYear][category] += amount;
            });

            // Convert to array format expected by frontend
            const historyArray = Object.entries(monthlyData).map(([monthYear, categories]) => ({
                month_year: monthYear,
                ...categories
            }));

            res.status(200).json(historyArray);
        } catch (error) {
            console.error('Get History Error:', error);
            res.status(500).json({ message: 'Server error while fetching history.' });
        }
    }
    else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

export default withAuth(historyHandler);