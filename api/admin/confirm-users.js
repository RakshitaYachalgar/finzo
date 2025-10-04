// /api/admin/confirm-users.js - Admin function to confirm all existing users
const { supabaseAdmin } = require('../_config/adminDb');

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Simple admin check (you can make this more secure)
    const { adminKey } = req.body;
    if (adminKey !== 'confirm-all-users-2024') {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    try {
        // Get all unconfirmed users
        const { data: users, error: fetchError } = await supabaseAdmin.auth.admin.listUsers();
        
        if (fetchError) {
            console.error('Error fetching users:', fetchError);
            return res.status(500).json({ message: 'Failed to fetch users' });
        }

        const unconfirmedUsers = users.users.filter(user => !user.email_confirmed_at);
        
        if (unconfirmedUsers.length === 0) {
            return res.status(200).json({ 
                message: 'No unconfirmed users found',
                confirmed: 0 
            });
        }

        // Confirm each user
        const confirmResults = await Promise.all(
            unconfirmedUsers.map(async (user) => {
                try {
                    const { error } = await supabaseAdmin.auth.admin.updateUserById(
                        user.id,
                        { 
                            email_confirm: true,
                            email_confirmed_at: new Date().toISOString()
                        }
                    );
                    return { userId: user.id, success: !error, error };
                } catch (err) {
                    return { userId: user.id, success: false, error: err.message };
                }
            })
        );

        const successCount = confirmResults.filter(r => r.success).length;
        const failureCount = confirmResults.filter(r => !r.success).length;

        res.status(200).json({
            message: `Confirmed ${successCount} users, ${failureCount} failures`,
            confirmed: successCount,
            failed: failureCount,
            details: confirmResults
        });

    } catch (error) {
        console.error('Admin confirm users error:', error);
        res.status(500).json({ message: 'Server error during user confirmation' });
    }
}