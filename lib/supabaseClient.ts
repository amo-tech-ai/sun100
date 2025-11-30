import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

let supabase: SupabaseClient;

const isConfigured = supabaseUrl && typeof supabaseUrl === 'string' && supabaseUrl.length > 0 &&
                     supabaseAnonKey && typeof supabaseAnonKey === 'string' && supabaseAnonKey.length > 0;

if (isConfigured) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn("Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) not set. Using a mock client. The application will be in a read-only review mode.");
  // Create a mock client that satisfies the type signature but does nothing.
  // This prevents the application from crashing while allowing UI review.
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: { name: 'Mock Error', message: 'Supabase not configured.' } }),
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: { name: 'Mock Error', message: 'Supabase not configured.' } }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    },
    from: (table: string) => {
      const mockQueryBuilder = {
        select: () => mockQueryBuilder,
        insert: () => mockQueryBuilder,
        update: () => mockQueryBuilder,
        delete: () => mockQueryBuilder,
        eq: () => mockQueryBuilder,
        order: () => mockQueryBuilder,
        limit: () => mockQueryBuilder,
        single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured.', details: '', hint: '', code: 'MOCK' } }),
        maybeSingle: () => Promise.resolve({ data: null, error: null }),
        // Make it await-able and return empty data
        then: (callback: (result: { data: any[]; error: null }) => void) => {
            // Return empty arrays to prevent map errors in UI
            callback({ data: [], error: null });
        },
      };
      return mockQueryBuilder as any;
    },
    // Add other Supabase client properties and methods as needed for type-checking
    functions: {
        invoke: () => Promise.resolve({ data: null, error: { message: 'Mock mode' } })
    }
  } as any;
  
  // Tag mock client
  (supabase as any).realtime = undefined; 
}

export { supabase };
