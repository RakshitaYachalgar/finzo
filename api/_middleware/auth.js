// /api/_middleware/auth.js - Supabase Authentication middleware for Vercel Functions
const { supabase } = require('../_config/db');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Authorization token required.' });
    }
    
    try {
        // Verify the Supabase JWT token
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || !user) {
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }
        
        req.user = {
            id: user.id,
            email: user.email,
            username: user.user_metadata?.username || user.email.split('@')[0]
        };
        next();
    } catch (err) {
        console.error('Token verification error:', err);
        return res.status(403).json({ message: 'Token verification failed.' });
    }
};

// Helper function to wrap Vercel functions with authentication
const withAuth = (handler) => {
    return async (req, res) => {
        return new Promise((resolve, reject) => {
            authenticateToken(req, res, async () => {
                try {
                    await handler(req, res);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    };
};

module.exports = { authenticateToken, withAuth };