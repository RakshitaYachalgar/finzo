// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABAS_URLE,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

export default supabase;
