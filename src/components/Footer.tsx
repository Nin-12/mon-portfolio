import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[var(--card)] text-[var(--muted)] py-4 text-center mt-8 rounded-t-xl">
      <p>&copy; {new Date().getFullYear()} MyPortfolio. Tous droits réservés.</p>

      <div className="flex justify-center gap-6 mt-3">
        {/* GitHub */}
        <a
          href="https://github.com/NIN-12"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition"
          aria-label="GitHub"
        >
          <Github size={22} />
        </a>

        {/* LinkedIn */}
        <a
          href="https://www.linkedin.com/in/ariel-lawson-tychus-9b94b0251"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition"
          aria-label="LinkedIn"
        >
          <Linkedin size={22} />
        </a>

        {/* Email */}
        <a
          href="mailto:desconcido60@gmail.com.com"
          className="hover:text-white transition"
          aria-label="Email"
        >
          <Mail size={22} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;