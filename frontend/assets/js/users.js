/* ============================================================
   IMPACTA — Users Module
   ============================================================ */

window.UsersModule = {

  currentFilter: 'all',

  render() {
    const t = (key) => window.I18n ? window.I18n.t(key) : key;
    return `
      <div class="page-content">
        <div class="tabs">
          <button class="tab-btn active" data-filter="all">${t('ui.all')}</button>
          <button class="tab-btn" data-filter="student">${t('tabs.students')}</button>
          <button class="tab-btn" data-filter="professor">${t('tabs.professors')}</button>
          <button class="tab-btn" data-filter="creator">${t('tabs.creators')}</button>
        </div>
        <div id="users-list">
          ${this._renderUsers('all')}
        </div>
      </div>
    `;
  },

  afterRender(container) {
    container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter;
        const list = container.querySelector('#users-list');
        list.style.opacity = '0';
        setTimeout(() => {
          list.innerHTML = this._renderUsers(this.currentFilter);
          list.style.opacity = '1';
          list.style.transition = 'opacity 0.2s ease';
          this._bindFollowButtons(list);
        }, 150);
      });
    });

    this._bindFollowButtons(container);
  },

  _bindFollowButtons(container) {
    container.querySelectorAll('[data-action="follow-user"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        App._toggleFollow(btn);
      });
    });
  },

  _renderUsers(filter) {
    const filtered = filter === 'all'
      ? IMPACTA_DATA.users
      : IMPACTA_DATA.users.filter(u => u.role === filter);

    return filtered.map(user => this._renderUserCard(user)).join('');
  },

  _renderUserCard(user) {
    const t = (key) => window.I18n ? window.I18n.t(key) : key;
    return `
      <div class="user-card" role="button" tabindex="0" data-action="go-profile">
        <div class="avatar-wrap">
          <div class="avatar avatar--md">
            <div class="avatar-placeholder">${user.initials}</div>
          </div>
          ${user.verified ? `<div class="verified-badge verified-badge--sm">${ICONS.verified}</div>` : ''}
        </div>
        <div class="user-card__info">
          <div class="user-card__name">
            ${user.name}
            ${user.verified ? ICONS.verified : ''}
          </div>
          <div class="user-card__uni">${user.uni}</div>
          <div class="user-card__stats">${user.followers} ${t('ui.followers')} · ${user.mutual} ${t('ui.mutual')}</div>
        </div>
        <button class="btn btn--sm ${user.followed ? 'btn--joined' : 'btn--primary'} ${user.followed ? 'following' : ''}"
          data-action="follow-user"
          aria-label="${user.followed ? t('ui.unfollow') : t('ui.follow')} ${user.name}">
          ${user.followed ? t('ui.unfollow') : t('ui.follow')}
        </button>
      </div>
    `;
  },
};

