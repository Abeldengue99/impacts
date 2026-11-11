/* ============================================================
   IMPACTA — Home Feed Module
   ============================================================ */

window.FeedModule = {

  render() {
    const t = (key) => window.I18n ? window.I18n.t(key) : key;
    return `
      <div class="page-content feed-page">
        <header class="feed-intro">
          <div>
            <span class="feed-intro__eyebrow">IMPACTA <span>·</span> ${t('ui.community')}</span>
            <h1>${t('ui.feedTitle')}</h1>
            <p>${t('ui.feedSubtitle')}</p>
          </div>
          <button class="feed-intro__explore" type="button" data-action="go-search">${ICONS.search}<span>${t('ui.exploreTopics')}</span></button>
        </header>
        ${this._renderTabs()}
        ${this._renderCreateBox()}
        <div id="feed-list">
          ${IMPACTA_DATA.posts.map(post => this._renderPost(post)).join('')}
        </div>
      </div>
    `;
  },

  afterRender(container) {
    // Tab switching
    container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.tab-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        this._refreshFeed(container, btn.dataset.tab);
      });
    });

    // Create box click → open modal
    const createBox = container.querySelector('.create-post__input');
    if (createBox) {
      createBox.addEventListener('click', () => {
        if (window.CreatePostModal) window.CreatePostModal.open('text');
        else if (window.App) window.App.openCreateModal();
      });
    }

    // Quick Image Action Button
    const btnImage = container.querySelector('[data-action="open-create-image"]');
    if (btnImage) {
      btnImage.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.CreatePostModal) window.CreatePostModal.open('image');
        else if (window.App) window.App.openCreateModal();
      });
    }

    // Quick Video Action Button
    const btnVideo = container.querySelector('[data-action="open-create-video"]');
    if (btnVideo) {
      btnVideo.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.CreatePostModal) window.CreatePostModal.open('video');
        else if (window.App) window.App.openCreateModal();
      });
    }
  },

  _refreshFeed(container, tab) {
    const list = container.querySelector('#feed-list');
    if (!list) return;
    list.style.opacity = '0';
    list.style.transform = 'translateY(8px)';
    list.style.transition = 'all 0.2s ease';
    setTimeout(() => {
      let posts = [...IMPACTA_DATA.posts];
      if (tab === 'following') {
        const followed = new Set(IMPACTA_DATA.users.filter(user => user.followed).map(user => user.id));
        posts = posts.filter(post => followed.has(post.userId));
      } else if (tab === 'popular') {
        posts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      }
      list.innerHTML = posts.map(post => this._renderPost(post)).join('');
      window.I18n?.applyDOM(list);
      list.style.opacity = '1';
      list.style.transform = 'translateY(0)';
    }, 160);
  },

  _renderTabs() {
    const t = (key) => window.I18n ? window.I18n.t(key) : key;
    return `
      <div class="tabs feed-tabs" role="tablist" aria-label="${t('ui.feedFilters')}">
        <button class="tab-btn active" type="button" role="tab" aria-selected="true" data-tab="foryou">${t('ui.forYou')}</button>
        <button class="tab-btn" type="button" role="tab" aria-selected="false" data-tab="following">${t('ui.following')}</button>
        <button class="tab-btn" type="button" role="tab" aria-selected="false" data-tab="popular">${t('ui.popular')}</button>
        <button class="tab-btn" type="button" role="tab" aria-selected="false" data-tab="latest">${t('ui.latest')}</button>
      </div>
    `;
  },

  _renderCreateBox() {
    const user = IMPACTA_DATA.currentUser;
    const t = (k) => window.I18n ? window.I18n.t(k) : k;
    return `
      <div class="create-post">
        <div class="avatar-wrap">
          <div class="avatar avatar--sm">
            <div class="avatar-placeholder">${user.initials}</div>
          </div>
        </div>
        <div class="create-post__input" role="button" tabindex="0" aria-label="${t('feed.sharePlaceholder') || 'Qual é a dúvida hoje? Partilha algo com a comunidade...'}">
          ${t('feed.sharePlaceholder') || 'Qual é a dúvida hoje? Partilha algo com a comunidade...'}
        </div>
        <div class="create-post__actions">
          <button type="button" class="create-post__action" data-action="open-create-image" aria-label="Adicionar imagem" title="Adicionar imagem">
            ${ICONS.image}
          </button>
          <button type="button" class="create-post__action" data-action="open-create-video" aria-label="Adicionar vídeo curto" title="Adicionar vídeo curto">
            ${ICONS.video}
          </button>
        </div>
      </div>
    `;
  },

  _renderPost(post) {
    const author = IMPACTA_DATA.users.find(u => u.id === post.userId) || (post.userId === IMPACTA_DATA.currentUser.id ? IMPACTA_DATA.currentUser : null);
    const status = author?.status || 'available';
    const statusTitles = { available: 'Disponível para estudo', studying: 'A estudar', exams: 'Em época de exames', teaching: 'A lecionar' };
    const statusTitle = statusTitles[status] || 'Disponível';

    return `
      <article class="post-card" data-post-id="${post.id}">
        <div class="post-card__header">
          <div class="post-card__user">
            <div class="avatar-wrap">
              <div class="avatar avatar--md">
                <div class="avatar-placeholder">${post.userInitials}</div>
              </div>
              <span class="avatar-status avatar-status--${status}" title="${statusTitle}"></span>
              ${post.verified ? `<div class="verified-badge">${ICONS.verified}</div>` : ''}
            </div>
            <div class="post-card__user-info">
              <div class="post-card__user-name">
                ${post.userName}
                ${post.verified ? ICONS.verified : ''}
              </div>
              <div class="post-card__user-meta">${post.userUni} · ${post.time}</div>
            </div>
          </div>
          <button class="post-card__more" aria-label="${window.I18n?.t('ui.moreOptions') || 'Mais opções'}">${ICONS.more}</button>
        </div>

        <p class="post-card__content">${post.content.replace(/\n/g, '<br>')}</p>

        ${post.hashtags.length ? `
          <div class="post-card__hashtags">
            ${post.hashtags.map(h => `<span class="hashtag">${h}</span>`).join('')}
          </div>
        ` : ''}

        ${this._renderMedia(post)}

        <div class="post-card__actions">
          <button class="post-action post-action--like ${post.liked ? 'liked' : ''}" 
            data-action="like-post" aria-label="${window.I18n?.t('feed.like') || 'Gostar'}">
            ${post.liked ? ICONS.heartFill : ICONS.heart}
            <span class="action-count">${formatCount(post.likes)}</span>
          </button>
          <button class="post-action" aria-label="${window.I18n?.t('feed.comment') || 'Comentar'}">
            ${ICONS.comment}
            <span class="action-count">${formatCount(post.comments)}</span>
          </button>
          <button class="post-action" aria-label="${window.I18n?.t('feed.share') || 'Partilhar'}">
            ${ICONS.share}
            <span class="action-count">${formatCount(post.shares)}</span>
          </button>
          <div class="post-action--spacer"></div>
          <button class="post-action post-action--bookmark ${post.saved ? 'saved' : ''}"
            data-action="save-post" aria-label="${window.I18n?.t('feed.save') || 'Guardar'}">
            ${post.saved ? ICONS.bookmarkFill : ICONS.bookmark}
            <span class="action-count">${post.saved ? window.I18n?.t('feed.saved') : window.I18n?.t('feed.save')}</span>
          </button>
        </div>
      </article>
    `;
  },

  _renderMedia(post) {
    const t = (key) => window.I18n ? window.I18n.t(key) : key;
    // ── Material de estudo em PDF ──
    if (post.mediaType === 'pdf' || post.document || (post.mediaType === 'image' && post.mediaPlaceholder)) {
      const doc = post.document || {
        title: post.mediaPlaceholder || 'Material de estudo',
        subtitle: post.userUni || 'Material partilhado para preparação de exames',
        filename: (post.mediaPlaceholder || 'Material_Estudo_IMPACTA').replace(/\s+/g, '_') + '.pdf',
        pages: 36,
        size: '4.8 MB',
        downloads: 1420
      };

      return `
        <div class="post-doc-card" data-post-id="${post.id}">
          <div class="post-doc-main">
            <div class="post-doc-badge">
              <span class="post-doc-type-tag">PDF</span>
              <span class="post-doc-icon">📑</span>
            </div>
            <div class="post-doc-info">
              <h3 class="post-doc-title">${doc.title}</h3>
              <p class="post-doc-subtitle">${doc.subtitle}</p>
              <div class="post-doc-meta">
                <span class="doc-meta-item">📄 ${doc.pages} ${t('ui.pages')}</span>
                <span class="doc-meta-item">💾 ${doc.size}</span>
                <span class="doc-meta-item">📥 <span class="doc-downloads-count">${formatCount(doc.downloads)}</span> ${t('ui.downloads')}</span>
              </div>
            </div>
          </div>
          <div class="post-doc-actions">
            <button type="button" class="btn-doc-download" data-action="download-doc" data-doc-title="${doc.title}" data-filename="${doc.filename}" aria-label="${t('ui.downloadMaterial')}">
              ${ICONS.download}
              <span>${t('ui.downloadMaterial')} (${doc.size})</span>
            </button>
            <button type="button" class="btn-doc-preview" data-action="preview-doc" data-doc-title="${doc.title}" aria-label="${t('ui.readOnline')}">
              <span>👁️ ${t('ui.readOnline')}</span>
            </button>
          </div>
        </div>
      `;
    }

    // ── Vídeo / Aula Curta ──
    if (post.mediaType === 'video') {
      const vid = post.video || {
        title: 'Vídeo Educativo / Dica Rápida',
        duration: '1:45',
        quality: '1080p HD',
        size: '18.4 MB',
        filename: 'video_aula_impacta.mp4',
        downloads: 890
      };

      return `
        <div class="post-video-card" data-post-id="${post.id}">
          <div class="post-video-thumb" data-action="play-video" data-video-title="${vid.title}">
            <div class="post-video-overlay-gradient"></div>
            <button type="button" class="post-video-play-btn" data-action="play-video" aria-label="${t('ui.playVideo')}">
              ${ICONS.play}
            </button>
            <span class="post-video-badge-duration">⏱️ ${vid.duration}</span>
            <span class="post-video-badge-quality">${vid.quality}</span>
          </div>
          <div class="post-video-footer">
            <div class="post-video-info">
              <div class="post-video-title">${vid.title}</div>
              <div class="post-video-meta">MP4 · ${vid.size} · <span class="video-downloads-count">${formatCount(vid.downloads)}</span> downloads</div>
            </div>
            <button type="button" class="btn-video-download" data-action="download-video" data-video-title="${vid.title}" data-filename="${vid.filename}" aria-label="${t('ui.downloadVideo')}">
              ${ICONS.download}
              <span>${t('ui.downloadVideo')}</span>
            </button>
          </div>
        </div>
      `;
    }

    // ── Imagem ──
    if (post.mediaType === 'image' && post.mediaUrl) {
      return `
        <div class="post-card__media">
          <img src="${post.mediaUrl}" alt="${t('ui.postImageAlt')}" loading="lazy" />
          <button type="button" class="btn-image-download" data-action="download-image" data-filename="imagem_impacta_${post.id}.jpg" title="${t('ui.downloadImage')}" aria-label="${t('ui.downloadImage')}">
            ${ICONS.download}
          </button>
        </div>
      `;
    }

    // ── Áudio ──
    if (post.mediaType === 'audio') {
      const bars = Array.from({length: 24}, (_, i) => {
        const h = 30 + Math.sin(i * 0.8) * 20 + Math.random() * 20;
        return `<div class="audio-bar" style="height:${Math.max(10, h)}%"></div>`;
      }).join('');
      return `
        <div class="post-card__audio">
          <button type="button" class="audio-play-btn" data-action="play-audio" aria-label="${t('ui.playAudio')}">${ICONS.play}</button>
          <div class="audio-waveform">${bars}</div>
          <span class="audio-duration">${post.mediaDuration}</span>
          <button type="button" class="btn-audio-download" data-action="download-audio" data-filename="aula_audio_${post.id}.mp3" title="${t('ui.downloadAudio')}" aria-label="${t('ui.downloadAudio')}">
            ${ICONS.download}
          </button>
        </div>
      `;
    }

    return '';
  },
};

