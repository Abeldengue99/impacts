(function () {
  'use strict';

  const t = (key) => window.I18n.t(`visitor.${key}`);

  function applyLanguage() {
    document.querySelectorAll('[data-visitor-copy]').forEach((element) => {
      const value = t(element.dataset.visitorCopy);
      if (value) element.textContent = value;
    });

    document.querySelectorAll('[data-visitor-aria]').forEach((element) => {
      const value = t(element.dataset.visitorAria);
      if (value) element.setAttribute('aria-label', value);
    });

    const picker = document.getElementById('visitor-language');
    if (picker) {
      picker.value = window.I18n.currentLang;
      picker.setAttribute('aria-label', t('language'));
    }

    document.documentElement.lang = window.I18n.currentLang;
    document.title = t('metaTitle');
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = t('metaDescription');

    const year = document.getElementById('visitor-year');
    if (year) year.textContent = new Date().getFullYear();
  }

  document.getElementById('visitor-language')?.addEventListener('change', (event) => {
    window.I18n.setLanguage(event.target.value);
  });

  window.addEventListener('impacta:langchange', () => window.setTimeout(applyLanguage, 0));
  applyLanguage();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/Impactaa/frontend/sw.js', { scope: '/Impactaa/' }).catch(() => {});
    });
  }
})();
