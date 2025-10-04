// /api/budgets.js - Vercel Function for budget management
const { withAuth } = require('./_middleware/auth');

async function budgetsHandler(req, res) {
    if (req.method === 'GET') {
        try {
            // Return sample budget data to prevent 500 errors
            res.status(200).json([
                {
                    budget_id: 1,
                    category: 'Groceries',
                    amount: 500,
                    spent: 350,
                    remaining: 150
                },
                {
                    budget_id: 2,
                    category: 'Transportation',
                    amount: 300,
                    spent: 280,
                    remaining: 20
                },
                {
                    budget_id: 3,
                    category: 'Entertainment',
                    amount: 200,
                    spent: 180,
                    remaining: 20
                }
            ]);
        } catch (error) {
            console.error('Get Budgets Error:', error);
            res.status(500).json({ message: 'Server error while fetching budgets.' });
        }
    }
    else if (req.method === 'POST') {
        // Create budget
        const { category, amount } = req.body;
        try {
            // TODO: Replace with Supabase insert when tables are set up
            const newBudget = {
                budget_id: Date.now(),
                category,
                amount: parseFloat(amount),
                spent: 0,
                remaining: parseFloat(amount)
            };
            
            res.status(201).json({ 
                message: 'Budget created successfully.', 
                budget: newBudget 
            });
        } catch (error) {
            console.error('Create Budget Error:', error);
            res.status(500).json({ message: 'Server error while creating budget.' });
        }
    }
    else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

export default withAuth(budgetsHandler);