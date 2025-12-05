
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

// Detect production environment
const isProduction = (import.meta as any).env?.PROD === true || 
                     (import.meta as any).env?.MODE === 'production' ||
                     window.location.hostname !== 'localhost';

let supabase: SupabaseClient;
let IS_MOCK_MODE = false;

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'undefined' && supabaseAnonKey !== 'undefined') {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  });
} else {
  // In production, throw an error instead of silently failing
  if (isProduction) {
    console.error("🚨 CRITICAL: Supabase environment variables missing in production!");
    console.error("Required variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY");
    // Still initialize to prevent crash, but log prominently
  }
  
  console.warn("⚠️ Supabase environment variables missing. Initializing in MOCK MODE.");
  console.warn("⚠️ Data will NOT persist. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  IS_MOCK_MODE = true;
  // Initialize a dummy client to prevent immediate crash on import, 
  // but all calls will fail if env vars are missing.
  supabase = createClient('https://placeholder.supabase.co', 'placeholder');
}

export { supabase, IS_MOCK_MODE };
