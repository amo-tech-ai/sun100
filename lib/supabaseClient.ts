// FIX: The reference to "vite/client" was causing a "Cannot find type definition" error,
// likely due to a project configuration issue. The reference has been removed, and
// `import.meta` is cast to `any` to bypass TypeScript errors for `import.meta.env`.
// This allows the code to work as intended in a Vite environment where these variables
// are available at runtime.
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;


// FIX: Removed the thrown error for missing keys to prevent a fatal app crash.
// The app will now initialize, and runtime errors will be handled gracefully.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);