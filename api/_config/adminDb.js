// /api/_config/adminDb.js - Supabase Admin Client for bypassing email confirmation
const { createClient } = require('@supabase/supabase-js');

// Create admin client using service role key (if available)
const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY, // Fallback to anon key
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

module.exports = { supabaseAdmin };