import { useEffect, useState } from 'react';

export const useTheme = () => {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('theme') !== 'light';
  });

useEffect(() => {
  // Force dark au premier chargement si pas de préférence sauvegardée
  if (!localStorage.getItem('theme')) {
    document.documentElement.classList.remove('light');
  }
}, []);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return { dark, toggle: () => setDark(d => !d) };
};