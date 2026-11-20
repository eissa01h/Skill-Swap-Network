import { createClient } from '@supabase/supabase-js';

// Designated administrator email (supports with or without dot before com)
export const ADMIN_EMAILS = ['eissa.ej05@gmailcom', 'eissa.ej05@gmail.com'];

export function isAdminEmail(email) {
  if (!email) return false;
  const clean = String(email).trim().toLowerCase();
  return ADMIN_EMAILS.some((admin) => admin.toLowerCase() === clean);
}

export function determineUserRole(email) {
  return isAdminEmail(email) ? 'ROLE_ADMIN' : 'ROLE_USER';
}

const supabaseUrl = (
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  import.meta.env.REACT_APP_SUPABASE_URL ||
  ''
).trim();

const supabaseAnonKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  import.meta.env.REACT_APP_SUPABASE_ANON_KEY ||
  ''
).trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('<') &&
  !supabaseAnonKey.includes('<') &&
  supabaseUrl.startsWith('http')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      },
    })
  : null;

if (!isSupabaseConfigured) {
  console.warn(
    '[Skill Swap Network] Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are not set. Running with local client persistence.'
  );
}
