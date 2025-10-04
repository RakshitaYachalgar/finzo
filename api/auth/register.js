// /api/auth/register.js - Vercel Function for user registration using Supabase Auth
const { supabase } = require('../_config/db');
const { supabaseAdmin } = require('../_config/adminDb');

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { username, password, accountType } = req.body;

    if (!username || !password || !accountType) {
        return res.status(400).json({ message: 'Username, password, and account type are required.' });
    }
    if (!['personal', 'organization'].includes(accountType)) {
        return res.status(400).json({ message: "Account type must be 'personal' or 'organization'." });
    }

    try {
        const email = username.includes('@') ? username : `${username}@finzo.app`;
        
        // Try to create user with admin client to bypass email confirmation
        let data, error;
        
        if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
            // Use admin client to create and auto-confirm user
            const adminResult = await supabaseAdmin.auth.admin.createUser({
                email: email,
                password: password,
                email_confirm: true, // Auto-confirm email
                user_metadata: {
                    username: username,
                    account_type: accountType
                }
            });
            data = adminResult.data;
            error = adminResult.error;
        } else {
            // Fallback to regular signup (will require email confirmation)
            const signupResult = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        username: username,
                        account_type: accountType
                    }
                }
            });
            data = signupResult.data;
            error = signupResult.error;
        }

        if (error) {
            console.error('Registration error:', error);
            if (error.message.includes('already registered')) {
                return res.status(409).json({ message: 'An account with this email already exists.' });
            }
            return res.status(500).json({ message: 'Registration failed.' });
        }

        if (!data.user) {
            return res.status(500).json({ message: 'Registration failed.' });
        }

        // Check if user needs email confirmation
        if (!data.session && !data.user.email_confirmed_at) {
            // User needs to confirm email
            const email = username.includes('@') ? username : `${username}@finzo.app`;
            const confirmationMessage = email.includes('@finzo.app') 
                ? 'Account created! Since this is a demo with a placeholder email, you may need to wait for email confirmation to be processed. Try logging in after a few moments.'
                : 'Account created! Please check your email and click the confirmation link before logging in.';
                
            return res.status(201).json({
                message: confirmationMessage,
                requiresConfirmation: true,
                user: {
                    id: data.user.id,
                    email: data.user.email,
                    username: username,
                    accountType: accountType
                }
            });
        }

        // Return success response for confirmed account
        const successMessage = accountType === 'organization' 
            ? "Organization account created successfully! You can now log in." 
            : "Personal account created successfully! You can now log in.";

        res.status(201).json({
            message: successMessage,
            token: data.session?.access_token,
            user: {
                id: data.user.id,
                email: data.user.email,
                username: username,
                accountType: accountType
            }
        });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
}