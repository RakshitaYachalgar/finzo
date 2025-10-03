// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.https://toyesaudveebfcafwcbr.supabase.co,
  process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRveWVzYXVkdmVlYmZjYWZ3Y2JyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0OTQxMzYsImV4cCI6MjA3NTA3MDEzNn0.MUi8KdfUzZDxMLS8KXsMKt3nSNndTKs5FkN2fTNog1Y
);

export default supabase;
