import { createClient } from '@supabase/supabase-js';

// FIX: Replaced `import.meta.env` with `process.env` to resolve TypeScript error.
const supabaseUrl = process.env.VITE_SUPABASE_URL;
// FIX: Replaced `import.meta.env` with `process.env` to resolve TypeScript error.
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and Anon Key must be provided in environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);