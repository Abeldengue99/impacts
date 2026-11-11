/* Painel de demonstração. Dados e permissões reais virão da API autenticada. */
(function () {
  'use strict';

  const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  const t = (key) => window.I18n?.t(`admin.${key}`) || key;

  window.ImpactaAdminModule = {
    activeTab: 'overview',

    render() {
      const tabs = ['overview', 'users', 'posts', 'reports', 'institutions', 'settings'];
      return `
        <section class="page-content admin-page">
          <header class="admin-page__header">
            <div><p class="admin-page__eyebrow">IMPACTA</p><h1>${t('title')}</h1><p>${t('subtitle')}</p></div>
            <button class="btn btn--outline" type="button" data-nav="profile">${t('backToProfile')}</button>
          </header>
          <div class="admin-preview-note" role="note">${t('previewNotice')}</div>
          <nav class="admin-tabs" aria-label="${t('navigation')}">
            ${tabs.map((tab) => `<button type="button" data-admin-tab="${tab}" class="${this.activeTab === tab ? 'active' : ''}">${t(`tab_${tab}`)}</button>`).join('')}
          </nav>
          <div class="admin-content" id="admin-content">${this.renderTab(this.activeTab)}</div>
        </section>`;
    },

    renderTab(tab) {
      if (tab === 'posts') {
        const posts = (window.IMPACTA_DATA?.posts || []).filter((post) => post.userId === window.IMPACTA_DATA?.currentUser?.id);
        return `<section class="admin-panel"><h2>${t('postsTitle')}</h2><p>${t('postsIntro')}</p><div class="admin-post-list">${posts.length ? posts.map((post) => `
          <article class="admin-post-row"><strong>${escapeHTML(t('published'))}</strong><p>${escapeHTML(post.content)}</p><small>${escapeHTML((post.hashtags || []).join(' '))}</small></article>
        `).join('') : `<p class="admin-empty">${t('noPosts')}</p>`}</div></section>`;
      }

      if (tab === 'overview') {
        const user = window.IMPACTA_DATA?.currentUser || {};
        const posts = (window.IMPACTA_DATA?.posts || []).filter((post) => post.userId === user.id);
        return `<div class="admin-overview-grid">
          <article class="admin-panel"><span>${t('administrator')}</span><strong>${escapeHTML(user.name || '—')}</strong><small>${escapeHTML(user.handle || '')}</small></article>
          <article class="admin-panel"><span>${t('starterPosts')}</span><strong>${posts.length}</strong><small>${t('starterPostsNote')}</small></article>
          <article class="admin-panel"><span>${t('dataSource')}</span><strong>${t('localPreview')}</strong><small>${t('dataSourceNote')}</small></article>
        </div><section class="admin-panel admin-panel--wide"><h2>${t('overviewTitle')}</h2><p>${t('overviewText')}</p></section>`;
      }

      const messages = {
        users: ['usersTitle', 'usersEmpty'],
        reports: ['reportsTitle', 'reportsEmpty'],
        institutions: ['institutionsTitle', 'institutionsEmpty'],
        settings: ['settingsTitle', 'settingsEmpty']
      }[tab] || ['overviewTitle', 'overviewText'];
      return `<section class="admin-panel"><h2>${t(messages[0])}</h2><p>${t(messages[1])}</p></section>`;
    },

    afterRender(container) {
      container.querySelectorAll('[data-admin-tab]').forEach((button) => {
        button.addEventListener('click', () => {
          this.activeTab = button.dataset.adminTab;
          container.querySelectorAll('[data-admin-tab]').forEach((tab) => tab.classList.toggle('active', tab === button));
          const content = container.querySelector('#admin-content');
          if (content) {
            content.innerHTML = this.renderTab(this.activeTab);
            window.I18n?.applyDOM(content);
          }
        });
      });
    }
  };
})();
