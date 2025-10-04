// /api/auth/login.js - Vercel Function for user login using Supabase Auth
const { supabase } = require('../_config/db');

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { username, password } = req.body;
    
    try {
        const email = username.includes('@') ? username : `${username}@finzo.app`;
        
        // Use Supabase Auth to sign in with email
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            console.error('Authentication error during login:', error);
            
            // Handle specific Supabase Auth errors
            if (error.message.includes('Email not confirmed')) {
                // Since email confirmation is disabled, try to auto-confirm the user using admin client
                console.log('Attempting to auto-confirm user since email confirmation is disabled');
                
                try {
                    const { supabaseAdmin } = require('../_config/adminDb');
                    
                    // Get user by email to find their ID
                    const { data: users, error: fetchError } = await supabaseAdmin.auth.admin.listUsers();
                    if (!fetchError && users) {
                        const user = users.users.find(u => u.email === email);
                        if (user) {
                            // Auto-confirm the user
                            const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
                                user.id,
                                { 
                                    email_confirm: true,
                                    email_confirmed_at: new Date().toISOString()
                                }
                            );
                            
                            if (!confirmError) {
                                // Try login again after confirmation
                                const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
                                    email: email,
                                    password: password
                                });
                                
                                if (!retryError && retryData.user) {
                                    return res.status(200).json({
                                        message: 'Login successful (auto-confirmed).',
                                        token: retryData.session.access_token,
                                        user: {
                                            id: retryData.user.id,
                                            email: retryData.user.email,
                                            username: retryData.user.user_metadata?.username || username
                                        }
                                    });
                                }
                            }
                        }
                    }
                } catch (adminError) {
                    console.error('Auto-confirm failed:', adminError);
                }
                
                return res.status(403).json({ 
                    message: 'Account requires confirmation. Please try registering again or contact support.',
                    code: 'email_not_confirmed'
                });
            }
            
            if (error.message.includes('Invalid login credentials')) {
                return res.status(401).json({ message: 'Invalid username or password.' });
            }
            
            return res.status(401).json({ message: 'Authentication failed.' });
        }

        if (!data.user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Return the Supabase session token
        res.status(200).json({
            message: 'Login successful.',
            token: data.session.access_token,
            user: {
                id: data.user.id,
                email: data.user.email,
                username: data.user.user_metadata?.username || username
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
}