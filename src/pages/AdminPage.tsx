import React, { useEffect, useState } from "react";
import AdminPanel from "../components/AdminPanel";
import { login } from "../utils/auth";
import { supabase } from "../utils/supabase";
import { Lock, User } from "lucide-react";

const AdminPage: React.FC = () => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //Vérifier session Supabase existante
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setAuthenticated(!!data.user);
    });
  }, []);

  const handleLogin = async () => {
    const ok = await login(email, password);
    if (ok) setAuthenticated(true);
    else alert("Identifiants incorrects");
  };

  //Loading pendant vérification session
  if (authenticated === null) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Chargement…
      </div>
    );
  }

  //Non authentifié → login
  if (!authenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen p-6 bg-gradient-to-br from-[#0a0f1a] to-[#0f1724]">
        <div className="w-full max-w-md bg-[var(--card)] border border-[var(--glass)] p-8 rounded-2xl shadow-2xl backdrop-blur-lg">
          <h1 className="text-3xl font-bold mb-8 text-center text-white">
            Connexion Administrateur
          </h1>

          {/* Email */}
          <div className="mb-5">
            <label className="text-sm text-[var(--muted)]">Email</label>
            <div className="flex items-center bg-[var(--glass)] border border-[var(--accent)] rounded-xl mt-1 p-3">
              <User className="text-[var(--accent)] mr-3" size={22} />
              <input
                type="email"
                value={email}
                placeholder="admin@tonsite.com"
                onChange={e => setEmail(e.target.value)}
                className="bg-transparent outline-none w-full text-white"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="text-sm text-[var(--muted)]">Mot de passe</label>
            <div className="flex items-center bg-[var(--glass)] border border-[var(--accent)] rounded-xl mt-1 p-3">
              <Lock className="text-[var(--accent)] mr-3" size={22} />
              <input
                type="password"
                value={password}
                placeholder="Votre mot de passe"
                onChange={e => setPassword(e.target.value)}
                className="bg-transparent outline-none w-full text-white"
              />
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-3 bg-[var(--accent)] text-[#061019] font-bold rounded-xl text-lg shadow-lg hover:bg-yellow-500 transition"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  //Authentifié → Admin
  return <AdminPanel />;
};

export default AdminPage;
