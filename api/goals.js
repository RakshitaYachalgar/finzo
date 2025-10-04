// /api/goals.js - Vercel Function for financial goals management
const { createClient } = require('@supabase/supabase-js');
const { withAuth } = require('./_middleware/auth');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function goalsHandler(req, res) {
    if (req.method === 'GET') {
        try {
            const userId = req.user.id;
            
            const { data: goals, error } = await supabase
                .from('goals')
                .select('goal_id, goal_name, target_amount, current_amount, target_date, status')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            // Transform data to match frontend expectations
            const transformedGoals = goals.map(goal => ({
                goal_id: goal.goal_id,
                title: goal.goal_name,
                target_amount: parseFloat(goal.target_amount),
                current_amount: parseFloat(goal.current_amount),
                deadline: goal.target_date,
                category: goal.status || 'General'
            }));

            res.status(200).json(transformedGoals);
        } catch (error) {
            console.error('Get Goals Error:', error);
            res.status(500).json({ message: 'Server error while fetching goals.' });
        }
    }
    else if (req.method === 'POST') {
        // Create goal
        const { title, target_amount, deadline, category } = req.body;
        try {
            const userId = req.user.id;
            
            const { data: newGoal, error } = await supabase
                .from('goals')
                .insert([{
                    user_id: userId,
                    goal_name: title,
                    target_amount: parseFloat(target_amount),
                    current_amount: 0,
                    target_date: deadline,
                    status: category || 'In-Progress'
                }])
                .select()
                .single();

            if (error) {
                throw error;
            }
            
            res.status(201).json({ 
                message: 'Goal created successfully.', 
                goal: {
                    goal_id: newGoal.goal_id,
                    title: newGoal.goal_name,
                    target_amount: parseFloat(newGoal.target_amount),
                    current_amount: parseFloat(newGoal.current_amount),
                    deadline: newGoal.target_date,
                    category: newGoal.status
                }
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