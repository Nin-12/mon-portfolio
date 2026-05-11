import { supabase } from '../utils/supabase';

export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (import.meta.env.DEV) console.error("Login error:", error);
    return false;
  }

  if (import.meta.env.DEV) console.log("Login success:", data);
  return true;
};

export const logout = async () => {
  // logout global (important pour supprimer session persistée)
  await supabase.auth.signOut({ scope: 'global' });

  // nettoyage local (sécurité navigateur)
  localStorage.clear();
  sessionStorage.clear();
};

export const getUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};