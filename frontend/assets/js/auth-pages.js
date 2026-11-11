(function () {
  'use strict';

  const page = document.body.dataset.authPage;
  const signup = page === 'signup';
  const recovery = page === 'forgot-password';
  const t = (key) => window.I18n.t(`auth.${key}`);

  function updateLanguage() {
    document.querySelectorAll('[data-auth-copy]').forEach((el) => {
      const key = el.dataset.authCopy;
      let translationKey = key;
      if (key.startsWith('benefit')) translationKey = key;
      const value = t(translationKey);
      if (value) el.textContent = value;
    });
    document.querySelectorAll('[data-auth-placeholder]').forEach((el) => {
      el.placeholder = t(el.dataset.authPlaceholder);
    });
    document.querySelectorAll('[data-auth-option]').forEach((el) => {
      el.textContent = t(el.dataset.authOption);
    });
    document.querySelectorAll('[data-toggle-password]').forEach((button) => {
      const input = document.getElementById(button.dataset.togglePassword);
      const label = input?.type === 'text' ? t('hidePassword') : t('showPassword');
      button.setAttribute('aria-label', label);
      button.title = label;
    });
    const picker = document.getElementById('language-picker');
    if (picker) {
      picker.value = window.I18n.currentLang;
      picker.setAttribute('aria-label', t('language'));
    }
    document.documentElement.lang = window.I18n.currentLang;
    const titleKey = signup ? 'signupCardTitle' : recovery ? 'forgotCardTitle' : 'loginCardTitle';
    document.title = `${t(titleKey)} | Impacta`;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = t(recovery ? 'forgotMetaDescription' : 'metaDescription');
    const illustration = document.querySelector('.auth-illustration');
    if (illustration) illustration.alt = t('illustrationAlt');
    const year = document.getElementById('current-year');
    if (year) year.textContent = new Date().getFullYear();
  }

  function showStatus(message, kind = 'info') {
    const statusId = signup ? 'signup-status' : recovery ? 'forgot-password-status' : 'login-status';
    const status = document.getElementById(statusId);
    if (!status) return;
    status.hidden = false;
    status.className = `auth-status auth-status--${kind}`;
    status.textContent = message;
  }

  document.getElementById('language-picker')?.addEventListener('change', (event) => {
    window.I18n.setLanguage(event.target.value);
  });

  document.querySelectorAll('[data-toggle-password]').forEach((button) => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.togglePassword);
      if (!input) return;
      input.type = input.type === 'password' ? 'text' : 'password';
      updateLanguage();
      input.focus();
    });
  });

  document.getElementById('signup-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const password = form.elements.namedItem('password').value;
    const confirmPassword = form.elements.namedItem('confirmPassword').value;
    if (password !== confirmPassword) {
      showStatus(t('passwordMismatch'), 'error');
      form.elements.namedItem('confirmPassword').focus();
      return;
    }
    showStatus(t('serviceUnavailable'));
  });

  document.getElementById('login-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    showStatus(t('serviceUnavailable'));
  });

  document.getElementById('forgot-password-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    showStatus(t('forgotUnavailable'));
  });

  window.addEventListener('impacta:langchange', updateLanguage);
  updateLanguage();
})();
