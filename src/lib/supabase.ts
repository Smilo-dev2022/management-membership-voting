import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client using environment variables (Vite)
const envSupabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const envSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Fallbacks for local development if env vars are not configured yet
// Note: Do NOT use service_role keys in the browser. Only anon/publishable keys are safe for client-side.
const fallbackUrl = 'https://aljpanvmlkcprnzrxnjc.supabase.co';
const fallbackAnonKey = 'sb_publishable_lv-AmScJPFgjNqW4qQpD7w_E348CvUS';

const supabaseUrl = envSupabaseUrl || fallbackUrl;
const supabaseKey = envSupabaseAnonKey || fallbackAnonKey;

if (!envSupabaseUrl || !envSupabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn('[supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing. Using fallback values.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };