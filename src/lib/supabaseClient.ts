import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be provided in .env file. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.");
}

// Custom fetch function to ensure all headers are ASCII-safe
const customFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  if (init && init.headers) {
    const newHeaders = new Headers(init.headers);
    // Iterate over headers and encode values to ensure ASCII safety
    for (const [key, value] of newHeaders.entries()) {
      // Only encode if the value is not already ASCII-safe
      if (!/^[\x00-\x7F]*$/.test(value)) {
        newHeaders.set(key, encodeURIComponent(value));
      }
    }
    init.headers = newHeaders;
  }
  return fetch(input, init);
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: {
      // Attempt to override or ensure x-client-info is ASCII-safe
      'x-client-info': 'supabase-js/2.56.0-browser', // Hardcode an ASCII-safe version
      'User-Agent': 'supabase-client-browser', // Also ensure User-Agent is ASCII-safe
    },
    // Use the custom fetch implementation
    fetch: customFetch,
  },
});