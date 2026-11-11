/* ============================================================
   IMPACTA — Home Feed Module
   ============================================================ */

window.FeedModule = {

  render() {
    return `
      <div class="page-content">
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
        container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
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
    list.style.opacity = '0';
    list.style.transform = 'translateY(8px)';
    list.style.transition = 'all 0.2s ease';
    setTimeout(() => {
      list.style.opacity = '1';
      list.style.transform = 'translateY(0)';
    }, 200);
  },

  _renderTabs() {
    return `
      <div class="tabs">
        <button class="tab-btn active" data-tab="foryou">For You</button>
        <button class="tab-btn" data-tab="following">Following</button>
        <button class="tab-btn" data-tab="popular">Popular</button>
        <button class="tab-btn" data-tab="latest">Latest</button>
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
          <button class="post-card__more" aria-label="More options">${ICONS.more}</button>
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
            data-action="like-post" aria-label="Like post">
            ${post.liked ? ICONS.heartFill : ICONS.heart}
            <span class="action-count">${formatCount(post.likes)}</span>
          </button>
          <button class="post-action" aria-label="Comment">
            ${ICONS.comment}
            <span class="action-count">${formatCount(post.comments)}</span>
          </button>
          <button class="post-action" aria-label="Share">
            ${ICONS.share}
            <span class="action-count">${formatCount(post.shares)}</span>
          </button>
          <div class="post-action--spacer"></div>
          <button class="post-action post-action--bookmark ${post.saved ? 'saved' : ''}"
            data-action="save-post" aria-label="Save post">
            ${post.saved ? ICONS.bookmarkFill : ICONS.bookmark}
            <span class="action-count">${post.saved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </article>
    `;
  },

  _renderMedia(post) {
    // ── Documento Académico / Sebenta PDF ──
    if (post.mediaType === 'pdf' || post.document || (post.mediaType === 'image' && post.mediaPlaceholder)) {
      const doc = post.document || {
        title: post.mediaPlaceholder || 'Sebenta de Estudo Académico',
        subtitle: post.userUni || 'Material partilhado para preparação de exames',
        filename: (post.mediaPlaceholder || 'Sebenta_Estudo_IMPACTA').replace(/\s+/g, '_') + '.pdf',
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
                <span class="doc-meta-item">📄 ${doc.pages} páginas</span>
                <span class="doc-meta-item">💾 ${doc.size}</span>
                <span class="doc-meta-item">📥 <span class="doc-downloads-count">${formatCount(doc.downloads)}</span> downloads</span>
              </div>
            </div>
          </div>
          <div class="post-doc-actions">
            <button type="button" class="btn-doc-download" data-action="download-doc" data-doc-title="${doc.title}" data-filename="${doc.filename}" aria-label="Baixar sebenta">
              ${ICONS.download}
              <span>Baixar Sebenta (${doc.size})</span>
            </button>
            <button type="button" class="btn-doc-preview" data-action="preview-doc" data-doc-title="${doc.title}" aria-label="Visualizar sebenta">
              <span>👁️ Ler Online</span>
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
            <button type="button" class="post-video-play-btn" data-action="play-video" aria-label="Reproduzir vídeo">
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
            <button type="button" class="btn-video-download" data-action="download-video" data-video-title="${vid.title}" data-filename="${vid.filename}" aria-label="Baixar vídeo">
              ${ICONS.download}
              <span>Baixar Vídeo</span>
            </button>
          </div>
        </div>
      `;
    }

    // ── Imagem ──
    if (post.mediaType === 'image' && post.mediaUrl) {
      return `
        <div class="post-card__media">
          <img src="${post.mediaUrl}" alt="Imagem do post" loading="lazy" />
          <button type="button" class="btn-image-download" data-action="download-image" data-filename="imagem_impacta_${post.id}.jpg" title="Baixar imagem" aria-label="Baixar imagem">
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
          <button type="button" class="audio-play-btn" data-action="play-audio" aria-label="Ouvir áudio">${ICONS.play}</button>
          <div class="audio-waveform">${bars}</div>
          <span class="audio-duration">${post.mediaDuration}</span>
          <button type="button" class="btn-audio-download" data-action="download-audio" data-filename="aula_audio_${post.id}.mp3" title="Baixar áudio" aria-label="Baixar áudio">
            ${ICONS.download}
          </button>
        </div>
      `;
    }

    return '';
  },
};

