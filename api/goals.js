// /api/goals.js - Vercel Function for financial goals management
const { createClient } = require('@supabase/supabase-js');
const { withAuth } = require('./_middleware/auth');

// Create both service role client and user client
const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const supabaseClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

async function goalsHandler(req, res) {
    if (req.method === 'GET') {
        try {
            const userId = req.user.id;
            
            // Use client with user's JWT token for RLS
            const userSupabase = createClient(
                process.env.SUPABASE_URL,
                process.env.SUPABASE_ANON_KEY,
                {
                    global: {
                        headers: {
                            Authorization: req.headers.authorization
                        }
                    }
                }
            );
            
            const { data: goals, error } = await userSupabase
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
            
            // Use client with user's JWT token for RLS
            const userSupabase = createClient(
                process.env.SUPABASE_URL,
                process.env.SUPABASE_ANON_KEY,
                {
                    global: {
                        headers: {
                            Authorization: req.headers.authorization
                        }
                    }
                }
            );
            
            const { data: newGoal, error } = await userSupabase
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
            console.error('Error details:', {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint,
                userId: req.user?.id,
                requestBody: req.body
            });
            res.status(500).json({ 
                message: 'Server error while creating goal.',
                error: error.message,
                details: error.details 
            });
        }
    }
    else if (req.method === 'PUT') {
        // Update goal (add funds)
        const { amount } = req.body;
        try {
            const userId = req.user.id;
            const goalId = req.query.id || req.url.split('/').pop(); // Get goal ID from URL
            
            // Use client with user's JWT token for RLS
            const userSupabase = createClient(
                process.env.SUPABASE_URL,
                process.env.SUPABASE_ANON_KEY,
                {
                    global: {
                        headers: {
                            Authorization: req.headers.authorization
                        }
                    }
                }
            );
            
            // First get the current goal to add to existing amount
            const { data: currentGoal, error: fetchError } = await userSupabase
                .from('goals')
                .select('current_amount')
                .eq('goal_id', goalId)
                .eq('user_id', userId)
                .single();
                
            if (fetchError) {
                throw fetchError;
            }
            
            const newAmount = parseFloat(currentGoal.current_amount) + parseFloat(amount);
            
            const { data: updatedGoal, error } = await userSupabase
                .from('goals')
                .update({ current_amount: newAmount })
                .eq('goal_id', goalId)
                .eq('user_id', userId)
                .select()
                .single();

            if (error) {
                throw error;
            }
            
            res.status(200).json({ 
                message: 'Goal updated successfully.', 
                goal: {
                    goal_id: updatedGoal.goal_id,
                    title: updatedGoal.goal_name,
                    target_amount: parseFloat(updatedGoal.target_amount),
                    current_amount: parseFloat(updatedGoal.current_amount),
                    deadline: updatedGoal.target_date,
                    category: updatedGoal.status
                }
            });
        } catch (error) {
            console.error('Update Goal Error:', error);
            console.error('Error details:', {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint,
                userId: req.user?.id,
                requestBody: req.body
            });
            res.status(500).json({ 
                message: 'Server error while updating goal.',
                error: error.message,
                details: error.details 
            });
        }
    }
    else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

export default withAuth(goalsHandler);