/* ============================================================
   IMPACTA — Inbox Module
   ============================================================ */

window.InboxModule = {

  currentTab: 'all',

  render() {
    return `
      <div class="page-content">
        <div class="tabs">
          <button class="tab-btn active" data-tab="all">All</button>
          <button class="tab-btn" data-tab="messages">Messages</button>
          <button class="tab-btn" data-tab="notifications" style="position:relative;">
            Notifications
            <span style="position:absolute;top:8px;right:6px;width:6px;height:6px;background:var(--color-like);border-radius:50%;display:inline-block;"></span>
          </button>
          <button class="tab-btn" data-tab="mentions">Mentions</button>
        </div>
        <div id="inbox-content">
          ${this._renderAll()}
        </div>
      </div>
    `;
  },

  afterRender(container) {
    container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentTab = btn.dataset.tab;

        const content = container.querySelector('#inbox-content');
        content.style.opacity = '0';
        setTimeout(() => {
          content.innerHTML = this._renderTab(this.currentTab);
          content.style.opacity = '1';
          content.style.transition = 'opacity 0.2s ease';
        }, 150);
      });
    });
  },

  _renderTab(tab) {
    if (tab === 'messages') return this._renderMessages();
    if (tab === 'notifications') return this._renderNotifications();
    if (tab === 'mentions') return this._renderMentions();
    return this._renderAll();
  },

  _renderAll() {
    return this._renderMessages() + this._renderNotifSection() + this._renderMentionSection();
  },

  _renderMessages() {
    return IMPACTA_DATA.inbox.messages.map(msg => this._renderConvCard(msg)).join('');
  },

  _renderNotifSection() {
    const notifs = IMPACTA_DATA.inbox.notifications.slice(0, 3);
    return `
      <div class="section-header" style="margin-top: var(--space-2);">
        <span class="section-header__title" style="font-size: var(--font-size-sm);">🔔 Recent Notifications</span>
        <a class="section-header__link" href="#" onclick="return false">See All ›</a>
      </div>
      ${notifs.map(n => this._renderNotifCard(n)).join('')}
    `;
  },

  _renderMentionSection() {
    const mentions = IMPACTA_DATA.inbox.mentions;
    return `
      <div class="section-header" style="margin-top: var(--space-2);">
        <span class="section-header__title" style="font-size: var(--font-size-sm);">💬 Mentions</span>
      </div>
      ${mentions.map(n => this._renderNotifCard(n)).join('')}
    `;
  },

  _renderNotifications() {
    return IMPACTA_DATA.inbox.notifications.map(n => this._renderNotifCard(n)).join('');
  },

  _renderMentions() {
    return IMPACTA_DATA.inbox.mentions.map(n => this._renderNotifCard(n)).join('');
  },

  _renderConvCard(msg) {
    const isGroup   = msg.type === 'group';
    const isChannel = msg.type === 'channel';

    let avatarContent = '';
    if (isGroup || isChannel) {
      avatarContent = `<div class="avatar-placeholder" style="font-size:20px;background:linear-gradient(135deg,var(--color-primary),var(--color-accent));">${msg.initials}</div>`;
    } else {
      avatarContent = `<div class="avatar-placeholder">${msg.initials}</div>`;
    }

    return `
      <div class="conv-card">
        <div class="avatar avatar--md">
          ${avatarContent}
        </div>
        <div class="conv-card__info">
          <div class="conv-card__top">
            <div class="conv-card__name">${msg.name}</div>
            <div class="conv-card__time">${msg.time}</div>
          </div>
          <div class="conv-card__preview">
            ${msg.unread === 0 ? `<span style="color:var(--color-primary);">✓✓</span>` : ''}
            ${msg.preview}
          </div>
        </div>
        ${msg.unread > 0 ? `<div class="conv-unread">${msg.unread}</div>` : ''}
      </div>
    `;
  },

  _renderNotifCard(notif) {
    return `
      <div class="notif-card ${notif.unread ? 'unread' : ''}">
        <div class="notif-card__icon">${notif.icon}</div>
        <div class="notif-card__content">
          <div class="notif-card__text">${notif.text}</div>
          <div class="notif-card__time">${notif.time}</div>
        </div>
        ${notif.unread ? '<div class="notif-dot"></div>' : ''}
      </div>
    `;
  },
};

