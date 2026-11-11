/* ============================================================
   IMPACTA — Profile Module
   ============================================================ */

window.ProfileModule = {

  currentTab: 'posts',

  render() {
    const user = IMPACTA_DATA.currentUser;
    const t = (key) => window.I18n ? window.I18n.t(key) : key;
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
            <button class="profile-avatar-edit-btn" id="profile-avatar-edit-btn" title="Alterar foto de perfil" aria-label="Alterar foto de perfil">${ICONS.image}</button>
            <input type="file" id="profile-avatar-input" accept="image/*" style="display:none;" aria-hidden="true" />
          </div>

          <div class="profile-header__actions">
            <button class="btn btn--outline btn--sm" data-action="open-settings" aria-label="Editar definições">${ICONS.edit} Definições</button>
            <button class="btn btn--outline btn--sm profile-bio-edit-btn" id="profile-bio-edit-btn" aria-label="Editar bio" title="Editar biografia e informações pessoais">${ICONS.edit} Editar Bio</button>
          </div>

          <div class="profile-name-row">
            <span class="profile-name">${user.name}</span>
            ${user.verified ? `<span class="profile-verified-badge" role="img" aria-label="Conta verificada">${ICONS.verified}</span>` : ''}
          </div>
          <div class="profile-handle">${user.handle} · <span style="color:var(--color-primary);font-weight:600;">${user.role === 'professor' ? (user.title || 'Docente') : (user.academicYear || '3º Ano')}</span></div>
          <div class="profile-uni">${user.university}${user.role === 'professor' ? '' : (' · ' + (user.faculty || ''))}</div>
          ${user.role === 'professor' ? `
          <div class="profile-professor-meta">
            <span class="profile-professor-badge">Docente · ${user.department || 'Departamento'}</span>
            ${user.teachingCourses ? '<span class="profile-professor-subjects">' + user.teachingCourses + '</span>' : ''}
            ${user.officeHours ? '<span class="profile-professor-subjects">Atendimento: ' + user.officeHours + '</span>' : ''}
          </div>` : ''}
          <p class="profile-bio">${user.bio}</p>

          <!-- Redes Sociais Externas Conectadas -->
          <div class="profile-social-chips" style="display:flex; gap:8px; flex-wrap:wrap; margin:10px 0 16px;">
            ${user.socialLinks?.linkedin ? '<span class="profile-social-pill">LinkedIn · ' + user.socialLinks.linkedin + '</span>' : ''}
            ${user.socialLinks?.github ? '<span class="profile-social-pill">GitHub · ' + user.socialLinks.github + '</span>' : ''}
            ${user.socialLinks?.instagram ? '<span class="profile-social-pill">Instagram · ' + user.socialLinks.instagram + '</span>' : ''}
            ${user.socialLinks?.whatsapp ? '<span class="profile-social-pill">WhatsApp · ' + user.socialLinks.whatsapp + '</span>' : ''}
          </div>

          <div class="profile-stats">
            <div class="profile-stat">
              <span class="profile-stat__value">${user.posts}</span>
              <span class="profile-stat__label">${t('ui.posts')}</span>
            </div>
            <div class="profile-stat">
              <span class="profile-stat__value">${formatCount(user.followers)}</span>
              <span class="profile-stat__label">${t('ui.followers')}</span>
            </div>
            <div class="profile-stat">
              <span class="profile-stat__value">${user.following}</span>
              <span class="profile-stat__label">${t('ui.following')}</span>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="tabs" style="margin-top:0; background:var(--color-surface-solid); border-bottom:1px solid var(--color-border);">
          <button class="tab-btn active" data-profile-tab="posts">${ICONS.grid} ${t('ui.posts')}</button>
          <button class="tab-btn" data-profile-tab="videos">${ICONS.video} ${t('ui.videos')}</button>
          <button class="tab-btn" data-profile-tab="resources">${ICONS.fileText} ${t('ui.resources')}</button>
          <button class="tab-btn" data-profile-tab="saved">${ICONS.bookmark} ${t('ui.saved')}</button>
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

  _escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  },

  _profileEmptyState(key) {
    const message = window.I18n ? window.I18n.t(key) : 'Ainda não há conteúdos para mostrar.';
    return '<div class="profile-empty-state"><p>' + this._escapeHTML(message) + '</p></div>';
  },

  _renderPostsGrid() {
    const user = IMPACTA_DATA.currentUser;
    const posts = (IMPACTA_DATA.posts || []).filter((post) => post.userId === user.id && post.status !== 'deleted');
    if (!posts.length) return this._profileEmptyState('ui.profileEmptyPosts');

    const cards = posts.map((post) => {
      const tags = (post.hashtags || []).map((tag) => {
        const label = String(tag).startsWith('#') ? tag : '#' + tag;
        return '<span>' + this._escapeHTML(label) + '</span>';
      }).join('');
      const tagList = tags ? '<div class="profile-post-preview__tags">' + tags + '</div>' : '';
      return '<article class="profile-post-preview"><p>' + this._escapeHTML(post.content || '') + '</p>' + tagList + '</article>';
    }).join('');
    return '<div class="profile-post-list">' + cards + '</div>';
  },

  _renderVideosGrid() {
    return this._profileEmptyState('ui.profileEmptyVideos');
  },

  _renderResourcesList() {
    return this._profileEmptyState('ui.profileEmptyResources');
  },

  _renderSavedPosts() {
    const saved = IMPACTA_DATA.posts.filter((post) => post.saved);
    if (!saved.length) return this._profileEmptyState('ui.profileEmptySaved');
    return saved.map((post) => window.FeedModule._renderPost(post)).join('');
  },
};

