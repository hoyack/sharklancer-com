(() => {
  const emit = (name, props = {}) => {
    if (typeof window.plausible === 'function') window.plausible(name, { props });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...props });
  };
  document.querySelectorAll('[data-event]').forEach((link) => link.addEventListener('click', () => emit(link.dataset.event, { source: 'sharklancer', offer: 'thunderstaff' })));
})();
