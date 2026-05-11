type NotifyType = 'success' | 'error' | 'info';

/**
 * Retourne les couleurs adaptées au thème + type
 */
const getColors = (type: NotifyType) => {
  const rootStyles = getComputedStyle(document.documentElement);

  switch (type) {
    case 'success':
      return {
        bg: '#22c55e',
        text: '#ffffff',
      };

    case 'error':
      return {
        bg: '#ef4444',
        text: '#ffffff',
      };

    case 'info':
      return {
        bg:
          rootStyles.getPropertyValue('--accent').trim() ||
          '#f59e0b',
        text:
          rootStyles.getPropertyValue('--text').trim() ||
          '#061019',
      };
  }
};

/**
 * Notification globale (toast system)
 */
export const notify = (
  message: string,
  type: NotifyType = 'info'
) => {
  // 1. créer container global si inexistant
  let container = document.getElementById('toast-container');

  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';

    container.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 99999;
    `;

    document.body.appendChild(container);
  }

  // 2. couleurs
  const { bg, text } = getColors(type);

  // 3. création toast
  const toast = document.createElement('div');
  toast.textContent = message;

  toast.style.cssText = `
    background: ${bg};
    color: ${text};
    padding: 12px 18px;
    border-radius: 12px;
    font-weight: 700;
    font-size: 14px;
    min-width: 220px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.25);
    transform: translateY(10px);
    opacity: 0;
    transition: all 0.25s ease;
  `;

  container.appendChild(toast);

  // 4. animation entrée
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  // 5. suppression automatique
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';

    setTimeout(() => toast.remove(), 250);
  }, 3000);
};