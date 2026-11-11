/* Páginas informativas até à publicação dos documentos legais aprovados. */
(function () {
  'use strict';
  window.ImpactaInfoModule = {
    render() {
      const t = (key) => window.I18n?.t(`info.${key}`) || key;
      return `<section class="page-content admin-page info-page">
        <header class="admin-page__header"><div><p class="admin-page__eyebrow">IMPACTA</p><h1>${t('title')}</h1><p>${t('subtitle')}</p></div><button class="btn btn--outline" type="button" data-nav="home">${t('back')}</button></header>
        <div class="info-grid">${['privacy', 'terms', 'cookies', 'help'].map((item) => `<article class="admin-panel"><h2>${t(`${item}Title`)}</h2><p>${t('preparation')}</p></article>`).join('')}</div>
      </section>`;
    }
  };
})();
