// src/components/GoogleAnalytics.tsx
import { useEffect } from 'react';
import { useAdminProfile } from '../hooks/useAdminProfile';

const GoogleAnalytics: React.FC = () => {
  const { profile } = useAdminProfile();
  const gaId = profile?.ga_measurement_id;

  useEffect(() => {
    if (!gaId) return;

    // Évite d'injecter deux fois le même script (ex: re-render, StrictMode)
    if (document.querySelector(`script[data-ga-id="${gaId}"]`)) return;

    const loaderScript = document.createElement('script');
    loaderScript.async = true;
    loaderScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    loaderScript.setAttribute('data-ga-id', gaId);
    document.head.appendChild(loaderScript);

    const inlineScript = document.createElement('script');
    inlineScript.setAttribute('data-ga-id', gaId);
    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}');
    `;
    document.head.appendChild(inlineScript);

    return () => {
      loaderScript.remove();
      inlineScript.remove();
    };
  }, [gaId]);

  return null;
};

export default GoogleAnalytics;