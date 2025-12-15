
import React from 'react';
import { useAdminProfile } from '../hooks/useAdminProfile';

const About: React.FC = () => {
  const { profile, loading } = useAdminProfile();

  if (loading) return <p>Chargement du profil...</p>;
  if (!profile) return <p>Profil non trouvé</p>;

  return (
    <section
      id="about"
      className="container mx-auto p-6 flex flex-col md:flex-row items-start gap-10"
    >
     {/* Avatar (TOUJOURS VALIDE) */}
      <img
        src={profile.avatar}
        alt="Avatar admin"
        className="w-40 h-40 rounded-full border-4 border-[var(--glass)] object-cover"
      />

      {/* Texte */}
      <div className="flex-1">
        <h2 className="text-3xl font-bold mb-4">
          {profile.name ?? 'Administrateur'}
        </h2>

        <p className="mb-2">
          Passionné par la cybersécurité et la protection des infrastructures
          informatiques, je me spécialise dans l’administration, l’analyse et la
          sécurisation des environnements Linux & Windows.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-4">
          Compétences par domaines
        </h3>

        {/* GRID DES CARTES (inchangée) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl border border-[var(--glass)] bg-white/5 backdrop-blur shadow">
            <h4 className="font-semibold text-lg mb-2">Administration Réseaux</h4>
            <p className="text-sm">
              TCP/IP, VLAN, Firewall, routage, audit réseau, analyse & surveillance
              (Wireshark).
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-[var(--glass)] bg-white/5 backdrop-blur shadow">
            <h4 className="font-semibold text-lg mb-2">Administration Systèmes</h4>
            <p className="text-sm">
              Linux (Debian, Ubuntu, Kali), Windows Server, Active Directory,
              gestion utilisateurs, durcissement systèmes.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-[var(--glass)] bg-white/5 backdrop-blur shadow">
            <h4 className="font-semibold text-lg mb-2">Cybersécurité</h4>
            <p className="text-sm">
              Gestion des vulnérabilités, tests d’intrusion basiques, sécurité
              d’infrastructures, virtualisation (VMware, VirtualBox).
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-[var(--glass)] bg-white/5 backdrop-blur shadow">
            <h4 className="font-semibold text-lg mb-2">Programmation & Scripts</h4>
            <p className="text-sm">
              Python, Bash, PowerShell, automatisation, outils internes.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-[var(--glass)] bg-white/5 backdrop-blur shadow">
            <h4 className="font-semibold text-lg mb-2">Développement Web</h4>
            <p className="text-sm">
              HTML, CSS, JavaScript, React, TypeScript, Tailwind, UI/UX, responsive.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-[var(--glass)] bg-white/5 backdrop-blur shadow">
            <h4 className="font-semibold text-lg mb-2">Outils & Gestion</h4>
            <p className="text-sm">
              Git, GitHub, GitLab, CI/CD basique, documentation technique.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;