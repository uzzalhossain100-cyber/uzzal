import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be provided in .env file. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: {
      // Attempt to override or ensure x-client-info is ASCII-safe
      'x-client-info': 'supabase-js/2.56.0-browser', // Hardcode an ASCII-safe version
      'User-Agent': 'supabase-client-browser', // Also ensure User-Agent is ASCII-safe
    },
  },
});