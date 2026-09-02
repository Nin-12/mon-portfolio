// src/components/MicrosoftClarity.tsx
import { useEffect } from 'react';
import { useAdminProfile } from '../hooks/useAdminProfile';

const MicrosoftClarity: React.FC = () => {
  const { profile } = useAdminProfile();
  const clarityId = profile?.clarity_project_id;

  useEffect(() => {
    if (!clarityId) return;

    // Évite d'injecter deux fois le même script (ex: re-render, StrictMode)
    if (document.querySelector(`script[data-clarity-id="${clarityId}"]`)) return;

    const script = document.createElement('script');
    script.setAttribute('data-clarity-id', clarityId);
    script.innerHTML = `
      (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${clarityId}");
    `;
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [clarityId]);

  return null;
};

export default MicrosoftClarity;