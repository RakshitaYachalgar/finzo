// /api/test-goals.js - Simple test endpoint without auth to debug database connection
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            console.log('Environment check:', {
                hasUrl: !!process.env.SUPABASE_URL,
                hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
                url: process.env.SUPABASE_URL?.slice(0, 30) + '...'
            });

            // Test database connection with a hardcoded user ID for testing
            const testUserId = '00000000-0000-0000-0000-000000000000'; // Dummy UUID for testing
            
            const { data: result, error } = await supabase
                .from('goals')
                .insert([{
                    user_id: testUserId,
                    goal_name: 'Test Goal',
                    target_amount: 1000,
                    current_amount: 0,
                    target_date: '2025-12-31',
                    status: 'In-Progress'
                }])
                .select()
                .single();

            if (error) {
                console.error('Database error:', error);
                return res.status(500).json({
                    message: 'Database error',
                    error: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code
                });
            }

            res.status(201).json({
                message: 'Test goal created successfully',
                data: result
            });

        } catch (error) {
            console.error('Unexpected error:', error);
            res.status(500).json({
                message: 'Unexpected error',
                error: error.message,
                stack: error.stack
            });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}