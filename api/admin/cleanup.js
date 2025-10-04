// /api/admin/cleanup.js - Temporary endpoint to clean up test data
const { createClient } = require('@supabase/supabase-js');
const { withAuth } = require('../_middleware/auth');

const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function cleanupHandler(req, res) {
    if (req.method === 'DELETE') {
        try {
            const userId = req.user.id;
            
            // Delete all goals for the current user
            const { error: goalsError } = await supabaseAdmin
                .from('goals')
                .delete()
                .eq('user_id', userId);
                
            if (goalsError) {
                throw goalsError;
            }
            
            // Delete all budgets for the current user
            const { error: budgetsError } = await supabaseAdmin
                .from('user_budgets')
                .delete()
                .eq('user_id', userId);
                
            if (budgetsError) {
                throw budgetsError;
            }
            
            // Delete all transactions for the current user
            const { error: transactionsError } = await supabaseAdmin
                .from('transactions')
                .delete()
                .eq('user_id', userId);
                
            if (transactionsError) {
                throw transactionsError;
            }
            
            // Delete all assets for the current user
            const { error: assetsError } = await supabaseAdmin
                .from('assets')
                .delete()
                .eq('user_id', userId);
                
            if (assetsError) {
                throw assetsError;
            }
            
            // Delete all liabilities for the current user
            const { error: liabilitiesError } = await supabaseAdmin
                .from('liabilities')
                .delete()
                .eq('user_id', userId);
                
            if (liabilitiesError) {
                throw liabilitiesError;
            }
            
            res.status(200).json({ 
                message: 'All user data cleaned up successfully.',
                deletedTables: ['goals', 'user_budgets', 'transactions', 'assets', 'liabilities']
            });
            
        } catch (error) {
            console.error('Cleanup Error:', error);
            res.status(500).json({ 
                message: 'Server error during cleanup.',
                error: error.message 
            });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

export default withAuth(cleanupHandler);