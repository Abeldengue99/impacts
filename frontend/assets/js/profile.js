/* ============================================================
   IMPACTA — Profile Module
   ============================================================ */

window.ProfileModule = {

  currentTab: 'posts',

  render() {
    const user = IMPACTA_DATA.currentUser;
    return `
      <div class="page-content profile-page">
        <!-- Cover -->
        <div class="profile-cover"></div>

        <!-- Header -->
        <div class="profile-header">
          <div class="profile-avatar-wrap" style="position:relative; display:inline-block;" id="profile-avatar-wrap">
            <div class="profile-avatar" id="profile-avatar-ring">
              ${user.avatarUrl
                ? `<img src="${user.avatarUrl}" alt="${user.name}" class="profile-avatar-img" />`
                : `<div class="avatar-placeholder" style="width:100%;height:100%;font-size:28px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--color-primary),var(--color-accent));color:white;font-weight:700;">${user.initials}</div>`
              }
            </div>
            <span class="avatar-status avatar-status--${user.status || 'available'}" style="width:14px; height:14px; border-width:3px; bottom:2px; right:4px;" title="Status do Estudante"></span>
            <!-- Botão de edição do avatar -->
            <button class="profile-avatar-edit-btn" id="profile-avatar-edit-btn" title="Alterar foto de perfil" aria-label="Alterar foto de perfil">
              📷
            </button>
            <input type="file" id="profile-avatar-input" accept="image/*" style="display:none;" aria-hidden="true" />
          </div>

          <div class="profile-header__actions">
            <button class="btn btn--outline btn--sm" data-action="open-settings" aria-label="Editar definições">${ICONS.edit} Definições</button>
            <button class="btn btn--outline btn--sm profile-bio-edit-btn" id="profile-bio-edit-btn" aria-label="Editar bio" title="Editar biografia e informações pessoais">✏️ Editar Bio</button>
          </div>

          <div class="profile-name-row">
            <span class="profile-name">${user.name}</span>
            <span style="color:var(--color-primary);font-size:16px;">✓</span>
          </div>
          <div class="profile-handle">${user.handle} · <span style="color:var(--color-primary);font-weight:600;">${user.role === 'professor' ? (user.title || 'Docente') : (user.academicYear || '3º Ano')}</span></div>
          <div class="profile-uni">🏛️ ${user.university}${user.role === 'professor' ? '' : (' · ' + (user.faculty || ''))}</div>
          ${user.role === 'professor' ? `
          <div class="profile-professor-meta">
            <span class="profile-professor-badge">👨‍🏫 Docente · ${user.department || 'Departamento'}</span>
            ${user.teachingCourses ? `<span class="profile-professor-subjects">📚 ${user.teachingCourses}</span>` : ''}
            ${user.officeHours ? `<span class="profile-professor-subjects">🕐 Atendimento: ${user.officeHours}</span>` : ''}
          </div>` : ''}
          <p class="profile-bio">${user.bio}</p>

          <!-- Redes Sociais Externas Conectadas -->
          <div class="profile-social-chips" style="display:flex; gap:8px; flex-wrap:wrap; margin:10px 0 16px;">
            ${user.socialLinks?.linkedin ? `<span class="profile-social-pill">💼 ${user.socialLinks.linkedin}</span>` : ''}
            ${user.socialLinks?.github ? `<span class="profile-social-pill">🐙 ${user.socialLinks.github}</span>` : ''}
            ${user.socialLinks?.instagram ? `<span class="profile-social-pill">📸 ${user.socialLinks.instagram}</span>` : ''}
            ${user.socialLinks?.whatsapp ? `<span class="profile-social-pill">💬 ${user.socialLinks.whatsapp}</span>` : ''}
          </div>

          <div class="profile-stats">
            <div class="profile-stat">
              <span class="profile-stat__value">${user.posts}</span>
              <span class="profile-stat__label">Posts</span>
            </div>
            <div class="profile-stat">
              <span class="profile-stat__value">${formatCount(user.followers)}</span>
              <span class="profile-stat__label">Followers</span>
            </div>
            <div class="profile-stat">
              <span class="profile-stat__value">${user.following}</span>
              <span class="profile-stat__label">Following</span>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="tabs" style="margin-top:0; background:var(--color-surface-solid); border-bottom:1px solid var(--color-border);">
          <button class="tab-btn active" data-profile-tab="posts">${ICONS.grid} Posts</button>
          <button class="tab-btn" data-profile-tab="videos">${ICONS.video} Videos</button>
          <button class="tab-btn" data-profile-tab="resources">📚 Resources</button>
          <button class="tab-btn" data-profile-tab="saved">${ICONS.bookmark} Saved</button>
        </div>

        <!-- Content -->
        <div id="profile-content">
          ${this._renderPostsGrid()}
        </div>
      </div>
    `;
  },

  afterRender(container) {
    // Botão Editar Bio → abre Definições e foca no campo bio
    const bioEditBtn = container.querySelector('#profile-bio-edit-btn');
    if (bioEditBtn) {
      bioEditBtn.addEventListener('click', () => {
        if (window.ImpactaApp && window.ImpactaApp.openSettingsModal) {
          window.ImpactaApp.openSettingsModal();
          setTimeout(() => {
            const bioField = document.getElementById('settings-bio-input');
            if (bioField) { bioField.focus(); bioField.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
          }, 350);
        }
      });
    }

    // Tabs
    container.querySelectorAll('[data-profile-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('[data-profile-tab]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentTab = btn.dataset.profileTab;

        const content = container.querySelector('#profile-content');
        content.style.opacity = '0';
        setTimeout(() => {
          content.innerHTML = this._renderTabContent(this.currentTab);
          content.style.opacity = '1';
          content.style.transition = 'opacity 0.2s ease';
        }, 150);
      });
    });

    // Avatar upload
    const editBtn = container.querySelector('#profile-avatar-edit-btn');
    const avatarInput = container.querySelector('#profile-avatar-input');
    const avatarRing = container.querySelector('#profile-avatar-ring');

    if (editBtn && avatarInput) {
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        avatarInput.click();
      });

      avatarInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validar tipo
        if (!file.type.startsWith('image/')) {
          if (window.Toast) window.Toast.error('Por favor seleciona uma imagem válida.');
          return;
        }

        // Feedback de carregamento
        if (editBtn) {
          editBtn.textContent = '⏳';
          editBtn.disabled = true;
        }

        try {
          // Comprimir para WebP usando ImpactaCompressor (já existente em interactions.js)
          let dataUrl;
          if (window.ImpactaCompressor) {
            // Usar maxDim menor para avatares (400px) — reutilizamos a qualidade 0.80
            const result = await window.ImpactaCompressor.compressImage(file, 0.80);
            dataUrl = result ? result.dataUrl : null;
          }

          // Fallback se compressor falhar ou não estiver disponível
          if (!dataUrl) {
            dataUrl = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });
          }

          // Guardar no utilizador atual
          IMPACTA_DATA.currentUser.avatarUrl = dataUrl;

          // Atualizar avatar no perfil imediatamente
          if (avatarRing) {
            avatarRing.innerHTML = `<img src="${dataUrl}" alt="${IMPACTA_DATA.currentUser.name}" class="profile-avatar-img" />`;
          }

          // Atualizar todos os outros avatares na UI global
          if (window.ImpactaApp && window.ImpactaApp._refreshAvatarUI) {
            window.ImpactaApp._refreshAvatarUI(dataUrl);
          }

          if (window.Toast) window.Toast.success('✅ Foto de perfil atualizada e comprimida para WebP!');
          if (window.Haptic) window.Haptic.success();
        } catch (err) {
          console.error('[IMPACTA] Erro ao processar avatar:', err);
          if (window.Toast) window.Toast.error('Erro ao processar a imagem. Tenta novamente.');
        } finally {
          if (editBtn) {
            editBtn.textContent = '📷';
            editBtn.disabled = false;
          }
          // Limpar input para permitir selecionar o mesmo ficheiro novamente
          avatarInput.value = '';
        }
      });
    }
  },

  _renderTabContent(tab) {
    if (tab === 'videos')    return this._renderVideosGrid();
    if (tab === 'resources') return this._renderResourcesList();
    if (tab === 'saved')     return this._renderSavedPosts();
    return this._renderPostsGrid();
  },

  _renderPostsGrid() {
    const items = [
      { emoji: '📖', bg: '#5B4BDB20' },
      { emoji: '📐', bg: '#10B98120' },
      { emoji: '💡', bg: '#F59E0B20' },
      { emoji: '🔬', bg: '#3B82F620' },
      { emoji: '📊', bg: '#8B5CF620' },
      { emoji: '✏️', bg: '#EF444420' },
      { emoji: '🎓', bg: '#5B4BDB20' },
      { emoji: '📚', bg: '#10B98120' },
      { emoji: '🧪', bg: '#F59E0B20' },
    ];

    return `
      <div class="posts-grid">
        ${items.map(item => `
          <div class="posts-grid__item">
            <div style="width:100%;height:100%;background:${item.bg};display:flex;align-items:center;justify-content:center;font-size:36px;">
              ${item.emoji}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  _renderVideosGrid() {
    const items = [
      { emoji: '🎬', bg: '#1A104040', label: '1:24' },
      { emoji: '📐', bg: '#0D2A1A40', label: '2:15' },
      { emoji: '📅', bg: '#1A0D2A40', label: '3:20' },
      { emoji: '💡', bg: '#1A104040', label: '0:58' },
      { emoji: '🔢', bg: '#0D2A1A40', label: '1:45' },
      { emoji: '📖', bg: '#1A0D2A40', label: '4:10' },
    ];

    return `
      <div class="posts-grid">
        ${items.map(item => `
          <div class="posts-grid__item">
            <div style="width:100%;height:100%;background:${item.bg};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;">
              <span style="font-size:28px;">${item.emoji}</span>
            </div>
            <div class="video-indicator">${ICONS.video}</div>
            <div style="position:absolute;bottom:4px;right:4px;background:rgba(0,0,0,0.6);color:white;font-size:9px;padding:2px 5px;border-radius:3px;font-weight:600;">${item.label}</div>
          </div>
        `).join('')}
      </div>
    `;
  },

  _renderResourcesList() {
    const resources = [
      { title: 'Math Cheat Sheet — Final Exam', type: 'PDF', size: '2.3 MB', emoji: '📄' },
      { title: 'Computer Science Notes — Chapter 7', type: 'DOC', size: '1.1 MB', emoji: '📝' },
      { title: 'Physics Formula Collection', type: 'PDF', size: '3.7 MB', emoji: '⚛️' },
      { title: 'Data Structures Flashcards', type: 'PDF', size: '0.8 MB', emoji: '🗂️' },
    ];

    return `
      <div style="padding: var(--space-3) 0;">
        ${resources.map(r => `
          <div style="display:flex;align-items:center;gap:var(--space-3);padding:var(--space-3) var(--space-4);background:var(--color-surface-solid);border-bottom:1px solid var(--color-border);cursor:pointer;transition:background var(--transition-fast);">
            <div style="width:44px;height:44px;background:var(--color-accent-soft);border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">
              ${r.emoji}
            </div>
            <div style="flex:1;min-width:0;">
              <div style="font-size:var(--font-size-sm);font-weight:var(--font-weight-semibold);color:var(--color-text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${r.title}</div>
              <div style="font-size:var(--font-size-xs);color:var(--color-text-muted);margin-top:2px;">${r.type} · ${r.size}</div>
            </div>
            <button style="color:var(--color-primary);padding:6px;" aria-label="Download">${ICONS.bookmarkFill}</button>
          </div>
        `).join('')}
      </div>
    `;
  },

  _renderSavedPosts() {
    const saved = IMPACTA_DATA.posts.filter(p => p.saved);
    if (saved.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-state__icon">🔖</div>
          <div class="empty-state__title">No saved posts yet</div>
          <div class="empty-state__desc">Tap the bookmark icon on any post to save it here for later.</div>
        </div>
      `;
    }
    return saved.map(post => window.FeedModule._renderPost(post)).join('');
  },
};

