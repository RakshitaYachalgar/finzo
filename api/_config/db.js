// Shared Supabase configuration for Vercel Functions
const { createClient } = require('@supabase/supabase-js');

// Create Supabase client instance
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = { supabase };