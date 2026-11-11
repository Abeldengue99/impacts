/* ============================================================
   IMPACTA — Communities Module
   ============================================================ */

window.CommunitiesModule = {

  render() {
    return `
      <div class="page-content">
        ${this._renderHeroBanner()}
        ${this._renderMyCommunities()}
        ${this._renderPopularCommunities()}
        ${this._renderCreateBtn()}
      </div>
    `;
  },

  afterRender(container) {
    // Join toggle
    container.querySelectorAll('[data-action="join-community"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        App._toggleJoin(btn);
      });
    });

    // Grid cards join
    container.querySelectorAll('[data-action="join-grid"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        App._toggleJoin(btn);
      });
    });
  },

  _renderHeroBanner() {
    return `
      <div class="hero-banner">
        <div class="hero-banner__content">
          <h2 class="hero-banner__title">Find Your University Community</h2>
          <p class="hero-banner__desc">Join and connect with students like you</p>
          <a class="hero-banner__btn" href="#" onclick="return false">
            Explore Communities →
          </a>
        </div>
        <div class="hero-banner__illustration">🎓</div>
      </div>
    `;
  },

  _renderMyCommunities() {
    const communities = IMPACTA_DATA.communities.mine;
    return `
      <div class="section-header">
        <span class="section-header__title">My Communities</span>
        <a class="section-header__link" href="#" onclick="return false">See All ›</a>
      </div>
      ${communities.map(c => `
        <div class="community-card" role="button" tabindex="0">
          <div class="community-icon">${c.emoji}</div>
          <div class="community-card__info">
            <div class="community-card__name">${c.name}</div>
            <div class="community-card__members">${c.members} Members</div>
          </div>
          <button class="btn btn--sm btn--joined" data-action="join-community" aria-label="Joined ${c.name}">
            Joined
          </button>
          <div class="community-card__chevron">${ICONS.arrow}</div>
        </div>
      `).join('')}
    `;
  },

  _renderPopularCommunities() {
    const communities = IMPACTA_DATA.communities.popular;
    return `
      <div class="section-header">
        <span class="section-header__title">Popular Communities</span>
        <a class="section-header__link" href="#" onclick="return false">See All ›</a>
      </div>
      <div style="padding: 0 var(--space-4) var(--space-4);">
        <!-- Top 3 as horizontal cards -->
        <div style="display: flex; gap: var(--space-3); margin-bottom: var(--space-3); overflow-x: auto; padding-bottom: var(--space-2); scrollbar-width: none;">
          ${communities.slice(0, 3).map(c => `
            <div style="flex-shrink:0; min-width:120px; background:var(--color-surface-solid); border:1px solid var(--color-border); border-radius:var(--radius-md); padding:var(--space-3); display:flex; flex-direction:column; align-items:center; gap:var(--space-2); text-align:center; cursor:pointer; transition: all var(--transition-base);">
              <div class="community-icon" style="width:48px;height:48px;">${c.emoji}</div>
              <span style="font-size:var(--font-size-xs); font-weight:var(--font-weight-semibold); color:var(--color-text-primary); line-height:1.3;">${c.name}</span>
              <span style="font-size:10px; color:var(--color-text-muted);">${c.members} Members</span>
              <button class="btn btn--sm btn--primary" data-action="join-grid" style="width:100%; border-radius:var(--radius-sm);">Join</button>
            </div>
          `).join('')}
        </div>

        <!-- Rest as list -->
        ${communities.slice(3).map(c => `
          <div class="community-card" style="border-radius:var(--radius-md); border:1px solid var(--color-border); margin-bottom:var(--space-2);">
            <div class="community-icon">${c.emoji}</div>
            <div class="community-card__info">
              <div class="community-card__name">${c.name}</div>
              <div class="community-card__members">${c.members} Members</div>
            </div>
            <button class="btn btn--sm btn--primary" data-action="join-community">Join</button>
          </div>
        `).join('')}
      </div>
    `;
  },

  _renderCreateBtn() {
    return `
      <div style="padding: var(--space-2) var(--space-4) var(--space-6);">
        <button class="btn btn--outline btn--full btn--lg" aria-label="Create a new community">
          ${ICONS.plus} Create a Community
        </button>
      </div>
    `;
  },
};

