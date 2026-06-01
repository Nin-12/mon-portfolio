import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <h1 className="text-6xl font-extrabold text-[var(--accent)] mb-4">404</h1>
      <p className="text-xl text-[var(--muted)] mb-8">
        Cette page n'existe pas.
      </p>
      <Link
        to="/"
        className="bg-[var(--accent)] text-[#061019] font-bold px-6 py-3 rounded-lg hover:bg-yellow-500 transition"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
};

export default NotFoundPage;