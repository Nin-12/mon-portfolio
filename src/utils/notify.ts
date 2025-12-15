export const notify = (message: string) => {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.className =
    'fixed bottom-5 right-5 bg-[var(--accent)] text-black px-6 py-3 rounded-xl shadow-xl font-bold z-50';
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
};
