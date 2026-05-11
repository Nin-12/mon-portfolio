import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,    // ← session non sauvegardée dans localStorage
    autoRefreshToken: false,  // ← pas de refresh automatique
    detectSessionInUrl: false,
  },
});