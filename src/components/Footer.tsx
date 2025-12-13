import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[var(--card)] text-[var(--muted)] py-4 text-center mt-8 rounded-t-xl">
      <p>&copy; {new Date().getFullYear()} MyPortfolio. Tous droits réservés.</p>
      <div className="flex justify-center gap-4 mt-2">
        <a href="https://github.com" target="_blank" className="hover:text-white transition">GitHub</a>
        <a href="https://linkedin.com" target="_blank" className="hover:text-white transition">LinkedIn</a>
        <a href="mailto:email@example.com" className="hover:text-white transition">Email</a>
      </div>
    </footer>
  );
};

export default Footer;
