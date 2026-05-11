import React, { useEffect, useState } from 'react';
import AdminPanel from '../components/AdminPanel';
import { supabase } from '../utils/supabase';
import { login, logout } from '../utils/auth';
import { Lock, User } from 'lucide-react';

const AdminPage: React.FC = () => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /* ===============================
     CHECK SESSION AU CHARGEMENT
  =============================== */
  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted) setAuthenticated(!!data.session);
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) setAuthenticated(!!session);
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  /* ===============================
     DÉCONNEXION SI ONGLET QUITTÉ
  =============================== */
  useEffect(() => {
    const handleVisibility = async () => {
      if (document.visibilityState === 'hidden') {
        await logout();
        setAuthenticated(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  /* ===============================
     LOGIN
  =============================== */
  const handleLogin = async () => {
    const ok = await login(email, password);

    if (ok) {
      setEmail('');
      setPassword('');
      setAuthenticated(true);
    } else {
      alert('Identifiants incorrects');
    }
  };

  /* ===============================
     LOADING
  =============================== */
  if (authenticated === null) {
    return (
      <div className="flex justify-center items-center min-h-screen text-[var(--text)]">
        Chargement…
      </div>
    );
  }

  /* ===============================
     LOGIN PAGE
  =============================== */
  if (!authenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen p-6 bg-[var(--bg)]">
        <div className="w-full max-w-md bg-[var(--card)] border border-[var(--glass)] p-8 rounded-2xl shadow-xl">

          <h1 className="text-3xl font-bold mb-8 text-center text-[var(--text)]">
            Connexion Admin
          </h1>

          {/* EMAIL */}
          <div className="mb-5">
            <label className="text-sm text-[var(--muted)]">Email</label>
            <div className="flex items-center border border-[var(--accent)] rounded-xl p-3 mt-1">
              <User className="text-[var(--accent)] mr-3" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="bg-transparent w-full outline-none text-[var(--text)]"
                placeholder="admin@email.com"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="mb-6">
            <label className="text-sm text-[var(--muted)]">Mot de passe</label>
            <div className="flex items-center border border-[var(--accent)] rounded-xl p-3 mt-1">
              <Lock className="text-[var(--accent)] mr-3" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="bg-transparent w-full outline-none text-[var(--text)]"
                placeholder="••••••••"
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
     ADMIN PANEL
  =============================== */
  return <AdminPanel />;
};

export default AdminPage;