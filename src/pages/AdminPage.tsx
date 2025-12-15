import React, { useEffect, useState } from 'react';
import AdminPanel from '../components/AdminPanel';
import { supabase } from '../utils/supabase';
import { Lock, User } from 'lucide-react';
import { login } from '../utils/auth';

const SESSION_MAX_AGE = 30_000; // 30 secondes

const AdminPage: React.FC = () => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /* ===============================
     1️⃣ CHECK SESSION AU CHARGEMENT
     =============================== */
  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;

      if (!data.user) {
        setAuthenticated(false);
        return;
      }

      const lastSignIn = new Date(
        data.user.last_sign_in_at || 0
      ).getTime();

      if (Date.now() - lastSignIn > SESSION_MAX_AGE) {
        await supabase.auth.signOut();
        setAuthenticated(false);
      } else {
        setAuthenticated(true);
      }
    };

    checkSession();

    return () => {
      mounted = false;
    };
  }, []);

  /* =========================================
     2️⃣ LOGOUT AUTOMATIQUE SI ONGLET QUITTÉ
     ========================================= */
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'hidden') {
        await supabase.auth.signOut();
        setAuthenticated(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      );
    };
  }, []);

  /* ===============================
     LOGIN
     =============================== */
  const handleLogin = async () => {
    const ok = await login(email, password);
    setAuthenticated(ok);
    if (!ok) alert('Identifiants incorrects');
  };

  /* ===============================
     UI
     =============================== */
  if (authenticated === null) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Chargement…
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen p-6 bg-gradient-to-br from-[#0a0f1a] to-[#0f1724]">
        <div className="w-full max-w-md bg-[var(--card)] border border-[var(--glass)] p-8 rounded-2xl shadow-2xl">
          <h1 className="text-3xl font-bold mb-8 text-center text-white">
            Connexion Administrateur
          </h1>

          {/* EMAIL */}
          <div className="mb-5">
            <label className="text-sm text-[var(--muted)]">Email</label>
            <div className="flex items-center bg-[var(--glass)] border border-[var(--accent)] rounded-xl mt-1 p-3">
              <User className="text-[var(--accent)] mr-3" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-transparent outline-none w-full text-white"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="mb-6">
            <label className="text-sm text-[var(--muted)]">Mot de passe</label>
            <div className="flex items-center bg-[var(--glass)] border border-[var(--accent)] rounded-xl mt-1 p-3">
              <Lock className="text-[var(--accent)] mr-3" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="bg-transparent outline-none w-full text-white"
              />
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-3 bg-[var(--accent)] text-[#061019] font-bold rounded-xl hover:bg-yellow-500 transition"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  /* ===============================
     AUTH OK → ADMIN
     =============================== */
  return <AdminPanel />;
};

export default AdminPage;
