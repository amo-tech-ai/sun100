
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

let supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  });
} else {
  console.error("CRITICAL: Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are missing. The application cannot connect to the backend.");
  // Initialize a dummy client to prevent immediate crash on import, 
  // but all calls will fail if env vars are missing.
  supabase = createClient('https://placeholder.supabase.co', 'placeholder');
}

export { supabase };
