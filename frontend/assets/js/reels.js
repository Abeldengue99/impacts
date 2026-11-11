/* ============================================================
   IMPACTA — Reels Module (TikTok-style)
   ============================================================ */

window.ReelsModule = {

  currentIndex: 0,

  render() {
    return `
      <div class="reels-container" id="reels-container">
        ${IMPACTA_DATA.reels.map((reel, i) => this._renderReel(reel, i)).join('')}
      </div>
    `;
  },

  afterRender(container) {
    const reelsEl = container.querySelector('#reels-container') || document.getElementById('reels-container');
    if (!reelsEl) return;

    // Tabs interaction
    container.querySelectorAll('.reels-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        container.querySelectorAll('.reels-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });

    // Like / bookmark / follow
    reelsEl.addEventListener('click', (e) => {
      const likeBtn = e.target.closest('.reel-action--like');
      if (likeBtn) {
        likeBtn.classList.toggle('liked');
        const countEl = likeBtn.querySelector('span');
        if (countEl) {
          const idx = parseInt(likeBtn.dataset.reelIdx || '0');
          const reel = IMPACTA_DATA.reels[idx];
          if (reel) {
            const isLiked = likeBtn.classList.contains('liked');
            likeBtn.querySelector('svg').outerHTML = isLiked ? ICONS.heartFill : ICONS.heart;
          }
        }
      }

      const followBtn = e.target.closest('.reel-follow-btn');
      if (followBtn) {
        const isFollowing = followBtn.classList.toggle('following');
        followBtn.textContent = isFollowing ? 'Following' : 'Follow';
      }

      const bookmarkBtn = e.target.closest('.reel-action--bookmark');
      if (bookmarkBtn) {
        bookmarkBtn.classList.toggle('saved');
      }

      const downloadBtn = e.target.closest('.reel-action--download');
      if (downloadBtn) {
        const caption = downloadBtn.dataset.reelCaption || 'Reel Educativo';
        const id = downloadBtn.dataset.reelId || 'reel';
        if (window.ImpactaDownload) {
          window.ImpactaDownload.downloadVideo(`impacta_reel_${id}.mp4`, caption);
        }
      }
    });
  },

  _renderReel(reel, index) {
    // Generate gradient bg based on reel bgColor
    const gradients = [
      'linear-gradient(180deg, #1A1040 0%, #0D0820 100%)',
      'linear-gradient(180deg, #0D2A1A 0%, #051008 100%)',
      'linear-gradient(180deg, #1A0D2A 0%, #0A0514 100%)',
    ];

    return `
      <div class="reel-item" style="background: ${gradients[index % gradients.length]}">
        <!-- Background gradient + person silhouette -->
        <div class="reel-video-preview" style="background: ${gradients[index % gradients.length]}">
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0.15;">
            <div style="font-size:180px;line-height:1;user-select:none;">👤</div>
          </div>
          <!-- Gradient overlay -->
          <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.3) 0%,transparent 35%,transparent 50%,rgba(0,0,0,0.7) 100%);"></div>
        </div>

        <!-- Category tag -->
        <div class="reel-category-tag">${reel.category}</div>

        <!-- Tabs overlay -->
        <div class="reels-tabs">
          <div class="reels-tab ${index === 0 ? 'active' : ''}">For You</div>
          <div class="reels-tab ${index !== 0 ? 'active' : ''}">Following</div>
        </div>

        <!-- Overlay bottom -->
        <div class="reel-overlay">
          <div class="reel-info">
            <div class="reel-user-row">
              <div class="avatar avatar--sm" style="border: 2px solid rgba(255,255,255,0.6); background:linear-gradient(135deg,var(--color-primary),var(--color-accent));">
                <div class="avatar-placeholder" style="font-size:12px;">${reel.userInitials}</div>
              </div>
              <span class="reel-username">${reel.userName}</span>
              ${reel.verified ? `<span style="color:var(--color-accent-soft);font-size:12px;">✓</span>` : ''}
              <button class="reel-follow-btn ${reel.following ? 'following' : ''}" aria-label="Follow ${reel.userName}">
                ${reel.following ? 'Following' : 'Follow'}
              </button>
            </div>

            <p class="reel-caption">${reel.caption}</p>

            <div class="reel-hashtags">
              ${reel.hashtags.map(h => `<span class="reel-hashtag">${h}</span>`).join('')}
            </div>

            <div class="reel-sound">
              ${ICONS.music}
              <span>${reel.sound}</span>
            </div>
          </div>

          <!-- Sidebar actions -->
          <div class="reel-actions">
            <div class="reel-action reel-action--like" data-reel-idx="${index}" aria-label="Like">
              ${ICONS.heart}
              <span>${reel.likes}</span>
            </div>
            <div class="reel-action" aria-label="Comment">
              ${ICONS.comment}
              <span>${reel.comments}</span>
            </div>
            <div class="reel-action reel-action--bookmark" aria-label="Bookmark">
              ${ICONS.bookmark}
              <span>${reel.bookmarks}</span>
            </div>
            <div class="reel-action" aria-label="Share">
              ${ICONS.share}
              <span>${reel.shares}</span>
            </div>
            <div class="reel-action reel-action--download" data-reel-id="${reel.id}" data-reel-caption="${reel.caption}" aria-label="Baixar Vídeo">
              ${ICONS.download}
              <span>Baixar</span>
            </div>
          </div>
        </div>
      </div>
    `;
  },
};

