/** @type {import('tailwindcss').Config} */
export default {
  // ✅ Purge tous les fichiers TSX/TS pour supprimer le CSS non utilisé en prod
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};