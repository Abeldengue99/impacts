/* ============================================================
   IMPACTA — Search Module
   ============================================================ */

window.SearchModule = {

  query: 'Math',

  render() {
    return `
      <div class="page-content">
        ${this._renderSearchBar()}
        ${this._renderResultsHeader()}
        ${this._renderTabs()}
        ${this._renderResults()}
      </div>
    `;
  },

  afterRender(container) {
    // Focus search input
    const input = container.querySelector('#search-input');
    if (input) {
      setTimeout(() => input.focus(), 100);
      input.addEventListener('input', (e) => {
        this.query = e.target.value;
        const header = container.querySelector('#results-count');
        if (header) header.textContent = this.query ? `${IMPACTA_DATA.searchResults.length} results` : '0 results';
      });
    }

    // Clear button
    const clearBtn = container.querySelector('.search-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (input) { input.value = ''; input.focus(); this.query = ''; }
      });
    }

    // Tabs
    container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Filter btn
    const filterBtn = container.querySelector('.search-filter-btn');
    if (filterBtn) filterBtn.addEventListener('click', () => App.openFilterPanel());

    // Follow buttons
    container.querySelectorAll('[data-action="follow-user"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        App._toggleFollow(btn);
      });
    });

    // Join buttons
    container.querySelectorAll('[data-action="join-community"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        App._toggleJoin(btn);
      });
    });

    // Bookmark buttons
    container.querySelectorAll('.video-card__bookmark').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        btn.classList.toggle('saved');
        btn.innerHTML = btn.classList.contains('saved') ? ICONS.bookmarkFill : ICONS.bookmark;
      });
    });

    // Video cards → reels
    container.querySelectorAll('.video-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.video-card__bookmark')) {
          App._navigate('reels');
        }
      });
    });
  },

  _renderSearchBar() {
    return `
      <div class="search-bar">
        <button class="topbar__btn" style="margin-right:0;" onclick="App._navigate(App.previousPage || 'discover')" aria-label="Go back">
          ${ICONS.arrowLeft}
        </button>
        <div class="search-input-wrap" style="flex:1;">
          ${ICONS.search}
          <input type="text" class="search-input" id="search-input"
            placeholder="Search..." value="${this.query}" aria-label="Search" />
          <button class="search-clear" aria-label="Clear">${ICONS.close}</button>
        </div>
        <button class="search-filter-btn" aria-label="Filter">${ICONS.filter}</button>
      </div>
    `;
  },

  _renderResultsHeader() {
    return `
      <div class="search-results-header">
        <span class="search-results-count">Search Results · <strong id="results-count">${IMPACTA_DATA.searchResults.length} results</strong></span>
      </div>
    `;
  },

  _renderTabs() {
    return `
      <div class="tabs">
        <button class="tab-btn active">All</button>
        <button class="tab-btn">Posts</button>
        <button class="tab-btn">Users</button>
        <button class="tab-btn">Communities</button>
      </div>
    `;
  },

  _renderResults() {
    return IMPACTA_DATA.searchResults.map(r => this._renderResult(r)).join('');
  },

  _renderResult(result) {
    if (result.type === 'video') {
      return `
        <div class="video-card">
          <div class="video-card__thumb">
            <div style="width:100%;height:100%;background:var(--color-accent-soft);display:flex;align-items:center;justify-content:center;font-size:24px;">📖</div>
            <div class="video-card__play-overlay">${ICONS.play}</div>
          </div>
          <div class="video-card__info">
            <div class="video-card__title">${result.title}</div>
            <div class="video-card__meta">By ${result.author} · ${result.meta}</div>
          </div>
          <button class="video-card__bookmark" aria-label="Bookmark">${ICONS.bookmark}</button>
        </div>
      `;
    }

    if (result.type === 'user') {
      return `
        <div class="user-card">
          <div class="avatar avatar--md">
            <div class="avatar-placeholder" style="font-size:18px;">👤</div>
          </div>
          <div class="user-card__info">
            <div class="user-card__name">${result.title}</div>
            <div class="user-card__uni">${result.author} · ${result.meta}</div>
          </div>
          <button class="btn btn--sm btn--primary ${result.followed ? 'btn--joined following' : ''}"
            data-action="follow-user">
            ${result.followed ? 'Following' : 'Follow'}
          </button>
        </div>
      `;
    }

    if (result.type === 'community') {
      return `
        <div class="community-card" style="border-bottom:1px solid var(--color-border);">
          <div class="community-icon" style="background:linear-gradient(135deg,var(--color-primary)20,var(--color-accent)20);">
            π
          </div>
          <div class="community-card__info">
            <div class="community-card__name">${result.title}</div>
            <div class="community-card__members">${result.meta}</div>
          </div>
          <button class="btn btn--sm btn--primary ${result.joined ? 'btn--joined' : ''}"
            data-action="join-community">
            ${result.joined ? 'Joined' : 'Join'}
          </button>
        </div>
      `;
    }

    return '';
  },
};

