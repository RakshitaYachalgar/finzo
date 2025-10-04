// /api/goals/[id].js - Dynamic route for individual goal operations
const { createClient } = require('@supabase/supabase-js');
const { withAuth } = require('../_middleware/auth');

async function goalHandler(req, res) {
    const { id } = req.query;
    
    if (req.method === 'PUT') {
        // Update goal (add funds)
        const { amount } = req.body;
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
            
            // First get the current goal to add to existing amount
            const { data: currentGoal, error: fetchError } = await userSupabase
                .from('goals')
                .select('current_amount')
                .eq('goal_id', id)
                .eq('user_id', userId)
                .single();
                
            if (fetchError) {
                throw fetchError;
            }
            
            const newAmount = parseFloat(currentGoal.current_amount) + parseFloat(amount);
            
            const { data: updatedGoal, error } = await userSupabase
                .from('goals')
                .update({ current_amount: newAmount })
                .eq('goal_id', id)
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
                requestBody: req.body,
                goalId: id
            });
            res.status(500).json({ 
                message: 'Server error while updating goal.',
                error: error.message,
                details: error.details 
            });
        }
    }
    else if (req.method === 'DELETE') {
        // Delete goal
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
            
            const { error } = await userSupabase
                .from('goals')
                .delete()
                .eq('goal_id', id)
                .eq('user_id', userId);

            if (error) {
                throw error;
            }
            
            res.status(200).json({ message: 'Goal deleted successfully.' });
        } catch (error) {
            console.error('Delete Goal Error:', error);
            res.status(500).json({ 
                message: 'Server error while deleting goal.',
                error: error.message 
            });
        }
    }
    else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

export default withAuth(goalHandler);