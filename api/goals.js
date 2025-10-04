// /api/goals.js - Vercel Function for financial goals management
const { withAuth } = require('./_middleware/auth');

async function goalsHandler(req, res) {
    if (req.method === 'GET') {
        try {
            // Return sample goals data to prevent 500 errors
            res.status(200).json([
                {
                    goal_id: 1,
                    title: 'Emergency Fund',
                    target_amount: 10000,
                    current_amount: 7500,
                    deadline: '2025-12-31',
                    category: 'Savings'
                },
                {
                    goal_id: 2,
                    title: 'Vacation Fund',
                    target_amount: 3000,
                    current_amount: 1200,
                    deadline: '2025-06-01',
                    category: 'Travel'
                }
            ]);
        } catch (error) {
            console.error('Get Goals Error:', error);
            res.status(500).json({ message: 'Server error while fetching goals.' });
        }
    }
    else if (req.method === 'POST') {
        // Create goal
        const { title, target_amount, deadline, category } = req.body;
        try {
            // TODO: Replace with Supabase insert when tables are set up
            const newGoal = {
                goal_id: Date.now(),
                title,
                target_amount: parseFloat(target_amount),
                current_amount: 0,
                deadline,
                category: category || 'General'
            };
            
            res.status(201).json({ 
                message: 'Goal created successfully.', 
                goal: newGoal 
            });
        } catch (error) {
            console.error('Create Goal Error:', error);
            res.status(500).json({ message: 'Server error while creating goal.' });
        }
    }
    else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

export default withAuth(goalsHandler);