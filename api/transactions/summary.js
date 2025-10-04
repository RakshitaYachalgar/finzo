// /api/transactions/summary.js - Vercel Function for transaction summary
const { createClient } = require('@supabase/supabase-js');
const { withAuth } = require('../_middleware/auth');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function summaryHandler(req, res) {
    if (req.method === 'GET') {
        try {
            const userId = req.user.id;
            
            // Get current month transactions
            const currentMonth = new Date().toISOString().substring(0, 7); // Format: YYYY-MM
            
            const { data: transactions, error } = await supabase
                .from('transactions')
                .select('category, amount')
                .eq('user_id', userId)
                .gte('transaction_date', currentMonth + '-01')
                .lt('transaction_date', new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString().split('T')[0]);

            if (error) {
                throw error;
            }

            // Initialize summary object
            const summary = {
                income: 0
            };

            // Process transactions
            transactions.forEach(transaction => {
                const amount = parseFloat(transaction.amount);
                const category = transaction.category.toLowerCase().replace(/\s+/g, '_');

                if (amount > 0) {
                    // Positive amounts are income
                    summary.income += amount;
                } else {
                    // Negative amounts are expenses by category
                    if (!summary[category]) {
                        summary[category] = 0;
                    }
                    summary[category] += Math.abs(amount);
                }
            });

            res.status(200).json(summary);
        } catch (error) {
            console.error('Get Summary Error:', error);
            res.status(500).json({ message: 'Server error while fetching summary.' });
        }
    }
    else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

export default withAuth(summaryHandler);