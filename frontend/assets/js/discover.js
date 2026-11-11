/* ============================================================
   IMPACTA — Discover Module
   ============================================================ */

window.DiscoverModule = {

  render() {
    return `
      <div class="page-content">
        ${this._renderSearchBar()}
        ${this._renderChipTabs()}
        ${this._renderTrending()}
        ${this._renderPopularContent()}
        ${this._renderJoinBanner()}
      </div>
    `;
  },

  afterRender(container) {
    // Search bar → go to search page
    const searchInput = container.querySelector('#discover-search-input');
    if (searchInput) {
      searchInput.addEventListener('focus', () => App._navigate('search'));
      searchInput.addEventListener('click', () => App._navigate('search'));
    }

    // Chip tabs
    container.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        container.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      });
    });

    // Filter btn
    const filterBtn = container.querySelector('.search-filter-btn');
    if (filterBtn) filterBtn.addEventListener('click', () => App.openFilterPanel());

    // Trending items
    container.querySelectorAll('.trending-item').forEach(item => {
      item.addEventListener('click', () => App._navigate('search'));
    });

    // Video cards
    container.querySelectorAll('.video-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.video-card__bookmark')) {
          App._navigate('reels');
        }
      });
    });

    // Bookmark toggle
    container.querySelectorAll('.video-card__bookmark').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        btn.classList.toggle('saved');
        const svg = btn.querySelector('svg');
        if (btn.classList.contains('saved')) {
          btn.innerHTML = ICONS.bookmarkFill;
          btn.classList.add('saved');
        } else {
          btn.innerHTML = ICONS.bookmark;
        }
      });
    });
  },

  _renderSearchBar() {
    return `
      <div class="search-bar">
        <div class="search-input-wrap">
          ${ICONS.search}
          <input type="text" class="search-input" id="discover-search-input"
            placeholder="Search for topics, courses..." 
            readonly aria-label="Search" />
          <button class="search-clear" aria-label="Clear search">${ICONS.close}</button>
        </div>
        <button class="search-filter-btn" aria-label="Filter results">${ICONS.filter}</button>
      </div>
    `;
  },

  _renderChipTabs() {
    const tabs = ['All', 'Study Tips', 'Exams', 'Assignments', 'Notes', 'Videos'];
    return `
      <div class="chip-tabs">
        ${tabs.map((t, i) => `<div class="chip ${i === 0 ? 'active' : ''}">${t}</div>`).join('')}
      </div>
    `;
  },

  _renderTrending() {
    const data = IMPACTA_DATA.discover.trending;
    return `
      <div class="section-header">
        <span class="section-header__title">🔥 Trending Topics</span>
        <a class="section-header__link" href="#" onclick="return false">See All ›</a>
      </div>
      <div class="trending-grid">
        ${data.map(item => `
          <div class="trending-item" role="button" tabindex="0">
            <div class="trending-item__icon">${item.emoji}</div>
            <span class="trending-item__label">${item.label}</span>
          </div>
        `).join('')}
      </div>
    `;
  },

  _renderPopularContent() {
    const videos = IMPACTA_DATA.discover.popularVideos;
    const colors = ['#5B4BDB20', '#10B98120', '#F59E0B20'];
    const emojis = ['📖', '📐', '📅'];
    return `
      <div class="section-header">
        <span class="section-header__title">⭐ Popular Content</span>
        <a class="section-header__link" href="#" onclick="return false">See All ›</a>
      </div>
      ${videos.map((v, i) => `
        <div class="video-card">
          <div class="video-card__thumb">
            <div style="width:100%;height:100%;background:${colors[i % colors.length]};display:flex;align-items:center;justify-content:center;font-size:28px;">
              ${emojis[i % emojis.length]}
            </div>
            <div class="video-card__duration">${v.duration}</div>
            <div class="video-card__play-overlay">${ICONS.play}</div>
          </div>
          <div class="video-card__info">
            <div class="video-card__title">${v.title}</div>
            <div class="video-card__meta">
              By ${v.author} · ${v.views}
            </div>
          </div>
          <button class="video-card__bookmark" aria-label="Bookmark video">${ICONS.bookmark}</button>
        </div>
      `).join('')}
    `;
  },

  _renderJoinBanner() {
    const t = (key) => window.I18n ? window.I18n.t(key) : key;
    return `
      <div class="join-banner" data-action="go-communities" role="button" tabindex="0" aria-label="${t('discover.joinCommunityTitle')}">
        <div class="join-banner__left">
          <div class="join-banner__icon">🏆</div>
          <div>
            <div class="join-banner__text">${t('discover.joinCommunityTitle')}</div>
            <div class="join-banner__sub">${t('discover.joinCommunitySub')}</div>
          </div>
        </div>
        <div class="join-banner__arrow">${ICONS.arrow}</div>
      </div>
    `;
  },
};

