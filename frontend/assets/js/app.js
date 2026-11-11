/* ============================================================
   IMPACTA — SPA Router & App Initialization (Desktop 3 Colunas + Mobile)
   ============================================================ */

class ImpactaApp {
  constructor() {
    this.currentPage = 'home';
    this.previousPage = null;
    this.pages = ['home', 'reels', 'discover', 'inbox', 'profile', 'search', 'users', 'communities'];
    this.topbarConfig = {
      home:        { type: 'logo',  actions: ['lang', 'search', 'bell'] },
      reels:       { type: 'logo',  actions: ['lang', 'search', 'bell'] },
      discover:    { type: 'logo',  actions: ['lang', 'search', 'bell'] },
      inbox:       { type: 'logo',  actions: ['lang', 'search', 'bell'] },
      profile:     { type: 'logo',  actions: ['lang', 'search', 'bell'] },
      search:      { type: 'logo',  actions: ['lang', 'search', 'bell'] },
      users:       { type: 'logo',  actions: ['lang', 'search', 'bell'] },
      communities: { type: 'logo',  actions: ['lang', 'search', 'bell'] },
    };
    this.modules = {};
  }

  init() {
    this._buildShell();
    document.querySelectorAll('[data-set-lang="zh"], [data-settings-lang="zh"]').forEach(el => el.remove());
    this._initModules();
    this._navigate('home');
    this._bindGlobal();
    this._setupTopbarScroll();
    this._setupFooterReveal();
    window.I18n?.applyDOM(document.body);
    if (window.I18n && window.MutationObserver) {
      this._languageObserver = new MutationObserver(records => {
        records.forEach(record => record.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) window.I18n.applyDOM(node);
        }));
      });
      this._languageObserver.observe(document.getElementById('app'), { childList: true, subtree: true });
    }

    // Evento de troca de idioma
    window.addEventListener('impacta:langchange', () => {
      const activeLanguage = window.I18n?.currentLang;
      document.querySelectorAll('[data-set-lang]').forEach(button => {
        button.classList.toggle('btn--joined', button.dataset.setLang === activeLanguage);
      });
      document.querySelectorAll('[data-settings-lang]').forEach(button => {
        button.classList.toggle('active', button.dataset.settingsLang === activeLanguage);
      });
      this._updateNav(this.currentPage);
      this._updateTopbar(this.currentPage);
      this._updateDesktopWidgets();
      const container = document.getElementById(`page-${this.currentPage}`);
      if (container) {
        delete container.dataset.rendered;
        this._renderPage(this.currentPage, container);
      }
      window.I18n?.applyDOM(document.body);
    });
  }

  // ── Construção do Shell com Suporte Desktop e Mobile ───────
  _buildShell() {
    const app = document.getElementById('app');
    const t = (k) => window.I18n ? window.I18n.t(k) : k;

    app.innerHTML = `
      <div class="desktop-layout-wrapper">
        
        <!-- ══════════════════════════════════════════
             COLUNA ESQUERDA (Navegação Desktop)
             ══════════════════════════════════════════ -->
        <aside class="desktop-left-col">
          <div class="desktop-nav-card">
            <div class="desktop-logo" data-nav="home">
              <img src="../public/icons/impacta-logo.svg" alt="Impacta" class="desktop-logo__img" />
            </div>

            <nav class="desktop-menu-list">
              <button class="desktop-menu-btn active" data-nav="home">
                <span class="nav-icon">${ICONS.homeFill}</span>
                <span data-i18n="nav.home">${t('nav.home')}</span>
              </button>

              <button class="desktop-menu-btn" data-nav="discover">
                <span class="nav-icon">${ICONS.discover}</span>
                <span data-i18n="nav.discover">${t('nav.discover')}</span>
              </button>

              <button class="desktop-menu-btn" data-nav="reels">
                <span class="nav-icon">${ICONS.video}</span>
                <span data-i18n="tabs.videos">${t('tabs.videos')}</span>
              </button>

              <button class="desktop-menu-btn" data-nav="communities">
                <span class="nav-icon">${ICONS.users}</span>
                <span data-i18n="communities.title">${t('communities.title')}</span>
              </button>

              <button class="desktop-menu-btn" data-nav="inbox">
                <span class="nav-icon" style="position:relative;">
                  ${ICONS.inbox}
                  <span class="badge" style="top:-3px; right:-6px; min-width:14px; height:14px; font-size:9px;">3</span>
                </span>
                <span data-i18n="nav.inbox">${t('nav.inbox')}</span>
              </button>
            </nav>

            <button class="btn btn--primary btn--full btn--lg" id="desktop-create-btn" style="border-radius:var(--radius-lg); padding:13px; font-weight:700; margin-top:2px;">
              ✏️ <span data-i18n="nav.create">${t('nav.create')}</span>
            </button>

            <!-- Card do Estudante Logado (Encaixado dentro do menu) -->
            <div class="desktop-user-pill" data-nav="profile">
              <div class="avatar avatar--sm avatar-wrap" style="flex-shrink:0;" id="sidebar-avatar-wrap">
                ${IMPACTA_DATA.currentUser.avatarUrl
                  ? `<img src="${IMPACTA_DATA.currentUser.avatarUrl}" alt="${IMPACTA_DATA.currentUser.name}" class="sidebar-avatar-img" />`
                  : `<div class="avatar-placeholder">${IMPACTA_DATA.currentUser.initials}</div>`
                }
                <span class="avatar-status avatar-status--${IMPACTA_DATA.currentUser.status || 'available'}" title="Disponível para estudo"></span>
              </div>
              <div style="flex:1; min-width:0;">
                <div style="font-size:13px; font-weight:700; color:var(--color-text-primary);" class="truncate">
                  ${IMPACTA_DATA.currentUser.name}
                </div>
                <div style="font-size:11px; color:var(--color-primary); font-weight:600;" class="truncate">
                  Impacta · Angola
                </div>
              </div>
              <button class="topbar__btn desktop-user-more-btn" id="desktop-user-more-btn" title="Mais opções" aria-label="Mais opções" style="color:var(--color-text-secondary); width:32px; height:32px; flex-shrink:0;">
                ${ICONS.more}
              </button>

              <!-- Menu de Contexto Apple Glass -->
              <div class="user-context-menu" id="user-context-menu">
                <button class="context-menu-item" data-ctx-action="settings">
                  ${ICONS.settings}
                  <span>Definições</span>
                </button>
                <button class="context-menu-item" data-ctx-action="lang">
                  ${ICONS.globe || '🌐'}
                  <span>Idioma</span>
                </button>
                <div class="context-menu-divider"></div>
                <button class="context-menu-item" data-ctx-action="switch-account">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5"/><path d="M8 21H3v-5"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
                  <span>Trocar de Conta</span>
                </button>
                <div class="context-menu-divider"></div>
                <button class="context-menu-item context-menu-item--danger" data-ctx-action="logout">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  <span>Terminar Sessão</span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        <!-- ══════════════════════════════════════════
             COLUNA CENTRAL (Feed / Conteúdo SPA)
             ══════════════════════════════════════════ -->
        <div class="app-shell">
          ${this._renderTopbar()}
          <main class="pages-container" id="pages-container">
            ${this.pages.map(p => `<div class="page" id="page-${p}" data-page="${p}"></div>`).join('')}
            <footer class="impacta-footer" id="impacta-footer" aria-label="Impacta">
              <div class="impacta-footer__main">
                <div>
                  <a class="impacta-footer__brand" href="index.html"><img src="../public/icons/impacta-mark.svg" alt="" /> <span>Impacta</span></a>
                  <p data-i18n="auth.footerIntro">Um espaço para aprender, partilhar e avançar em conjunto.</p>
                </div>
                <nav class="impacta-footer__links" aria-label="Ligações da Impacta">
                  <button type="button" data-nav="home" data-i18n="auth.footerHome">Início</button>
                  <button type="button" data-nav="discover" data-i18n="auth.footerExplore">Explorar</button>
                  <button type="button" data-nav="communities" data-i18n="auth.footerCommunities">Comunidades</button>
                  <button type="button" data-nav="profile" data-i18n="auth.footerProfile">Perfil</button>
                </nav>
                <button class="impacta-footer__hide" id="impacta-footer-hide" type="button" data-i18n="auth.footerHide">Ocultar rodapé</button>
              </div>
              <div class="impacta-footer__bottom"><span>© <span id="impacta-footer-year"></span> Impacta</span><span data-i18n="auth.footerTagline">Aprender. Partilhar. Avançar.</span></div>
            </footer>
            <div class="impacta-footer-reopen" id="impacta-footer-reopen" hidden>
              <button type="button" id="impacta-footer-show" data-i18n="auth.footerShow">Mostrar rodapé</button>
            </div>
          </main>
          ${this._renderBottomNav()}
          ${this._renderFilterPanel()}
          ${this._renderCreateModal()}
          ${this._renderLangModal()}
          ${this._renderSettingsModal()}
          ${this._renderLogoutModal()}
        </div>

        <!-- ══════════════════════════════════════════
             COLUNA DIREITA (Widgets Académicos & Descoberta)
             ══════════════════════════════════════════ -->
        <aside class="desktop-right-col">
          
          <!-- Widget: Pesquisa Rápida -->
          <div class="desktop-widget-card" style="padding:14px 16px;">
            <div class="search-input-wrap" style="background:var(--color-surface); cursor:pointer;" data-action="go-search">
              ${ICONS.search}
              <input type="text" placeholder="${t('discover.searchPlaceholder')}" readonly style="flex:1; background:none; font-size:13px; cursor:pointer;" />
            </div>
          </div>

          <!-- Widget: Tópicos em Alta em Angola -->
          <div class="desktop-widget-card">
            <div class="desktop-widget-title">
              <span data-i18n="discover.trendingTitle">${t('discover.trendingTitle')}</span>
              <span style="font-size:12px; color:var(--color-primary); cursor:pointer;" data-action="go-search">Ver tudo ›</span>
            </div>
            <div style="display:flex; flex-direction:column; gap:6px;">
              <div class="desktop-trend-item" data-action="go-search">
                <span class="desktop-trend-topic">Universidade Agostinho Neto</span>
                <span class="desktop-trend-name">#ExamesNacionais2026</span>
                <span class="desktop-trend-meta">14.8K publicações</span>
              </div>
              <div class="desktop-trend-item" data-action="go-search">
                <span class="desktop-trend-topic">Engenharia & Ciências</span>
                <span class="desktop-trend-name">#CalculoDiferencial</span>
                <span class="desktop-trend-meta">9,2 mil materiais partilhados</span>
              </div>
              <div class="desktop-trend-item" data-action="go-search">
                <span class="desktop-trend-topic">Instituto Superior ISPTEC</span>
                <span class="desktop-trend-name">#BolsasEEstagios</span>
                <span class="desktop-trend-meta">5.4K estudantes</span>
              </div>
              <div class="desktop-trend-item" data-action="go-search">
                <span class="desktop-trend-topic">Tecnologia & Programação</span>
                <span class="desktop-trend-name">#ISUTICDevs</span>
                <span class="desktop-trend-meta">3.1K discussões</span>
              </div>
            </div>
          </div>

          <!-- Widget: Comunidades Académicas Recomendadas -->
          <div class="desktop-widget-card">
            <div class="desktop-widget-title">
              <span>🏛️ Comunidades Sugeridas</span>
              <span style="font-size:12px; color:var(--color-primary); cursor:pointer;" data-action="go-communities">Explorar ›</span>
            </div>
            <div style="display:flex; flex-direction:column;">
              <div class="desktop-comm-item">
                <div class="community-icon" style="width:40px; height:40px; font-size:20px;">🏛️</div>
                <div style="flex:1; min-width:0;">
                  <div style="font-size:13px; font-weight:700;" class="truncate">UAN - Geral</div>
                  <div style="font-size:11px; color:var(--color-text-muted);">142K Membros</div>
                </div>
                <button class="btn btn--sm btn--primary" data-action="join-community">Aderir</button>
              </div>
              <div class="desktop-comm-item">
                <div class="community-icon" style="width:40px; height:40px; font-size:20px;">⚙️</div>
                <div style="flex:1; min-width:0;">
                  <div style="font-size:13px; font-weight:700;" class="truncate">ISPTEC Politécnico</div>
                  <div style="font-size:11px; color:var(--color-text-muted);">76K Membros</div>
                </div>
                <button class="btn btn--sm btn--primary" data-action="join-community">Aderir</button>
              </div>
              <div class="desktop-comm-item">
                <div class="community-icon" style="width:40px; height:40px; font-size:20px;">🎓</div>
                <div style="flex:1; min-width:0;">
                  <div style="font-size:13px; font-weight:700;" class="truncate">UCAN Católica</div>
                  <div style="font-size:11px; color:var(--color-text-muted);">94K Membros</div>
                </div>
                <button class="btn btn--sm btn--primary" data-action="join-community">Aderir</button>
              </div>
            </div>
          </div>

        </aside>

      </div>
    `;

    const publishButton = document.getElementById('desktop-create-btn');
    publishButton?.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) node.textContent = node.textContent.replace(/\u270f\uFE0F?/gu, '');
    });
  }

  _renderTopbar() {
    return `
      <header class="topbar" id="topbar">
        <div class="topbar__logo" id="topbar-logo">
          <img src="../public/icons/impacta-logo.svg" alt="Impacta" class="topbar__logo-img" />
        </div>
        <button class="topbar__btn" id="topbar-back" style="display:none" aria-label="Voltar">
          ${ICONS.arrowLeft}
        </button>
        <h1 class="topbar__title" id="topbar-title" style="display:none"></h1>
        <div class="topbar__actions" id="topbar-actions"></div>
      </header>
    `;
  }

  _renderBottomNav() {
    const t = (k) => window.I18n ? window.I18n.t(k) : k;
    const items = [
      { id: 'home',        icon: ICONS.home,        iconActive: ICONS.homeFill,    labelKey: 'nav.home',     badge: 0 },
      { id: 'discover',    icon: ICONS.discover,    iconActive: ICONS.discoverFill,labelKey: 'nav.discover', badge: 0 },
      { id: 'create',      icon: ICONS.plus,        iconActive: ICONS.plus,        labelKey: '',             badge: 0, isCreate: true },
      { id: 'inbox',       icon: ICONS.inbox,       iconActive: ICONS.inboxFill,   labelKey: 'nav.inbox',    badge: 3 },
      { id: 'profile',     icon: ICONS.profile,     iconActive: ICONS.profileFill, labelKey: 'nav.profile',  badge: 0 },
    ];

    return `
      <nav class="bottom-nav" role="navigation" aria-label="Navegação móvel">
        ${items.map(item => {
          if (item.isCreate) {
            return `
              <button class="nav-item nav-item--create" id="nav-create" aria-label="${t('nav.create')}">
                <div class="create-btn">${item.icon}</div>
                <span>${t('nav.create')}</span>
              </button>`;
          }
          return `
            <button class="nav-item" data-nav="${item.id}" aria-label="${t(item.labelKey)}" aria-current="false">
              <span class="nav-icon">${item.icon}</span>
              ${item.badge ? `<span class="badge">${item.badge}</span>` : ''}
              <span>${t(item.labelKey)}</span>
            </button>`;
        }).join('')}
      </nav>
    `;
  }

  _renderLangModal() {
    const curLang = window.I18n ? window.I18n.currentLang : 'pt-AO';
    return `
      <div class="modal-overlay" id="lang-modal" role="dialog" aria-modal="true" aria-label="Selecionar Idioma">
        <div class="bottom-sheet">
          <div class="bottom-sheet__handle"></div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h2 style="font-size:16px; font-weight:700;">🌐 Escolhe o idioma</h2>
            <button class="filter-panel__close" id="lang-modal-close">${ICONS.close}</button>
          </div>
          <div style="display:flex; flex-direction:column; gap:10px;">
            <button class="btn btn--ghost ${curLang === 'pt-AO' ? 'btn--joined' : ''}" data-set-lang="pt-AO" style="justify-content:flex-start; padding:12px 16px; font-size:15px;">
              🇦🇴 Português (Angola) ${curLang === 'pt-AO' ? '✓' : ''}
            </button>
            <button class="btn btn--ghost ${curLang === 'en' ? 'btn--joined' : ''}" data-set-lang="en" style="justify-content:flex-start; padding:12px 16px; font-size:15px;">
              🇺🇸 English ${curLang === 'en' ? '✓' : ''}
            </button>
            <button class="btn btn--ghost ${curLang === 'fr' ? 'btn--joined' : ''}" data-set-lang="fr" style="justify-content:flex-start; padding:12px 16px; font-size:15px;">
              🇫🇷 Français ${curLang === 'fr' ? '✓' : ''}
            </button>
            <button class="btn btn--ghost ${curLang === 'zh' ? 'btn--joined' : ''}" data-set-lang="zh" style="justify-content:flex-start; padding:12px 16px; font-size:15px;">
              🇨🇳 中文 (Mandarin) ${curLang === 'zh' ? '✓' : ''}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  _renderSettingsModal() {
    const user = IMPACTA_DATA.currentUser;
    const curLang = window.I18n ? window.I18n.currentLang : (user.preferredLang || 'pt-AO');
    const socials = user.socialLinks || { linkedin: '', github: '', instagram: '', whatsapp: '' };

    return `
      <div class="modal-overlay" id="settings-modal" role="dialog" aria-modal="true" aria-label="Definições">
        <div class="bottom-sheet settings-modal-sheet" style="max-height:92dvh; display:flex; flex-direction:column;">
          <div class="bottom-sheet__handle"></div>
          
          <div class="settings-modal-header">
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="font-size:22px;">⚙️</span>
              <div>
                <h2 style="font-size:17px; font-weight:800; color:var(--color-text-primary); line-height:1.2;">Definições da conta</h2>
                <span style="font-size:12px; color:var(--color-text-muted);">Personaliza o teu perfil, idioma e privacidade</span>
              </div>
            </div>
            <button class="filter-panel__close" id="settings-modal-close" aria-label="Fechar">${ICONS.close}</button>
          </div>

          <div class="settings-modal-body" style="overflow-y:auto; padding-right:4px; display:flex; flex-direction:column; gap:16px;">
            
            <!-- Secção: Status Académico do Estudante -->
            <div class="settings-card-group">
              <label class="settings-group-title">🎯 Estado de actividade</label>
              <div class="settings-status-grid">
                <button type="button" class="settings-status-btn ${user.status === 'available' ? 'active' : ''}" data-select-status="available">
                  <span class="status-dot status-dot--available"></span>
                  <div class="status-btn-text">
                    <span class="status-btn-label">Disponível</span>
                    <span class="status-btn-desc">Para tirar dúvidas</span>
                  </div>
                </button>
                <button type="button" class="settings-status-btn ${user.status === 'studying' ? 'active' : ''}" data-select-status="studying">
                  <span class="status-dot status-dot--studying"></span>
                  <div class="status-btn-text">
                    <span class="status-btn-label">A Estudar</span>
                    <span class="status-btn-desc">Modo de concentração activo</span>
                  </div>
                </button>
                <button type="button" class="settings-status-btn ${user.status === 'exams' ? 'active' : ''}" data-select-status="exams">
                  <span class="status-dot status-dot--exams"></span>
                  <div class="status-btn-text">
                    <span class="status-btn-label">Em época de exames</span>
                    <span class="status-btn-desc">A preparar avaliações</span>
                  </div>
                </button>
                <button type="button" class="settings-status-btn ${user.status === 'teaching' ? 'active' : ''}" data-select-status="teaching">
                  <span class="status-dot status-dot--teaching"></span>
                  <div class="status-btn-text">
                    <span class="status-btn-label">A dar aulas</span>
                    <span class="status-btn-desc">Docente / Monitor</span>
                  </div>
                </button>
              </div>
            </div>

            <!-- Secção: Idioma Preferido da Plataforma -->
            <div class="settings-card-group">
              <label class="settings-group-title">🌐 Idioma da plataforma</label>
              <div class="settings-lang-grid">
                <button type="button" class="settings-lang-btn ${curLang === 'pt-AO' ? 'active' : ''}" data-settings-lang="pt-AO">
                  <span class="lang-flag">🇦🇴</span>
                  <div class="lang-btn-text">
                    <span class="lang-btn-label">Português</span>
                    <span class="lang-btn-sub">Angola (Padrão)</span>
                  </div>
                </button>
                <button type="button" class="settings-lang-btn ${curLang === 'en' ? 'active' : ''}" data-settings-lang="en">
                  <span class="lang-flag">🇺🇸</span>
                  <div class="lang-btn-text">
                    <span class="lang-btn-label">English</span>
                    <span class="lang-btn-sub">International</span>
                  </div>
                </button>
                <button type="button" class="settings-lang-btn ${curLang === 'fr' ? 'active' : ''}" data-settings-lang="fr">
                  <span class="lang-flag">🇫🇷</span>
                  <div class="lang-btn-text">
                    <span class="lang-btn-label">Français</span>
                    <span class="lang-btn-sub">Afrique Francophone</span>
                  </div>
                </button>
                <button type="button" class="settings-lang-btn ${curLang === 'zh' ? 'active' : ''}" data-settings-lang="zh">
                  <span class="lang-flag">🇨🇳</span>
                  <div class="lang-btn-text">
                    <span class="lang-btn-label">中文</span>
                    <span class="lang-btn-sub">Mandarin</span>
                  </div>
                </button>
              </div>
            </div>

            <!-- Secção: Bio & Apresentação -->
            <div class="settings-card-group">
              <label class="settings-group-title">✍️ Sobre ti</label>
              <div class="settings-row">
                <label class="settings-label" for="settings-bio-input">Sobre mim</label>
                <textarea id="settings-bio-input" class="settings-input" rows="3" maxlength="200"
                  placeholder="Conta um pouco sobre ti..."
                  style="resize:vertical; min-height:72px; font-family:var(--font-family);">${user.bio || ''}</textarea>
              </div>
              <div class="settings-row">
                <label class="settings-label" for="settings-location-input">Localização</label>
                <input type="text" id="settings-location-input" class="settings-input"
                  placeholder="Ex: Luanda, Angola" value="${user.location || 'Luanda, Angola'}" />
              </div>
            </div>

            <!-- Secção: Perfil Universitário & Dados Académicos -->
            <div class="settings-card-group">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <label class="settings-group-title" style="margin-bottom:0;">🏛️ Dados de estudo e trabalho</label>
                <div class="settings-role-pills">
                  <button type="button" class="role-pill-btn ${user.role !== 'professor' ? 'active' : ''}" data-academic-role="student">
                    🎓 Estudante
                  </button>
                  <button type="button" class="role-pill-btn ${user.role === 'professor' ? 'active' : ''}" data-academic-role="professor">
                    👨‍🏫 Docente
                  </button>
                </div>
              </div>

              <!-- Seleção de Universidade / Instituição -->
              <div class="settings-input-row">
                <span class="settings-field-label">Instituição:</span>
                <select id="settings-university-select" class="filter-select" style="flex:1; padding:8px 12px; font-size:13px;">
                  <option value="UAN" ${user.university?.includes('UAN') ? 'selected' : ''}>UAN - Universidade Agostinho Neto</option>
                  <option value="UCAN" ${user.university?.includes('UCAN') ? 'selected' : ''}>UCAN - Universidade Católica de Angola</option>
                  <option value="ISPTEC" ${user.university?.includes('ISPTEC') ? 'selected' : ''}>ISPTEC - Inst. Sup. Politécnico de Tecnologias</option>
                  <option value="ISUTIC" ${user.university?.includes('ISUTIC') ? 'selected' : ''}>ISUTIC - Inst. Sup. Tecnologias de Informação</option>
                  <option value="UMN" ${user.university?.includes('UMN') ? 'selected' : ''}>UMN - Mandume ya Ndemufayo (Huíla/Lubango)</option>
                  <option value="UKB" ${user.university?.includes('UKB') ? 'selected' : ''}>UKB - Universidade Katyavala Bwila (Benguela)</option>
                  <option value="UJES">UJES - Universidade José Eduardo dos Santos (Huambo)</option>
                  <option value="ISPSN">ISPSN - Inst. Sup. Politécnico Sol Nascente</option>
                  <option value="IMEL">IMEL - Instituto Médio de Economia de Luanda</option>
                  <option value="IPIL">IPIL - Instituto Politécnico Industrial de Luanda</option>
                  <option value="other">➕ Outra Escola / Instituto (Não listado)</option>
                </select>
              </div>

              <!-- Caixa de Escola / Universidade Não Listada (Custom) -->
              <div id="settings-custom-school-box" class="settings-custom-school-box" style="display:${user.customSchool ? 'flex' : 'none'};">
                <div class="custom-school-notice">
                  📍 A tua instituição será registada no directório universitário de Angola do IMPACTA.
                </div>
                <div class="settings-input-row" style="margin-top:6px;">
                  <span class="settings-field-label">Nome da escola:</span>
                  <input type="text" id="settings-custom-school-name" value="${user.customSchool || ''}" class="settings-input" style="flex:1;" placeholder="Ex: Instituto Superior Politécnico de Luanda..." />
                </div>
                <div class="settings-input-row" style="margin-top:8px;">
                  <span class="settings-field-label">Província:</span>
                  <select id="settings-school-province" class="filter-select" style="flex:1; padding:8px 12px; font-size:13px;">
                    <option value="Luanda" selected>Luanda</option>
                    <option value="Benguela">Benguela</option>
                    <option value="Huambo">Huambo</option>
                    <option value="Huíla">Huíla (Lubango)</option>
                    <option value="Cabinda">Cabinda</option>
                    <option value="Cuanza Sul">Cuanza Sul (Sumbe)</option>
                    <option value="Cuanza Norte">Cuanza Norte</option>
                    <option value="Malanje">Malanje</option>
                    <option value="Uíge">Uíge</option>
                    <option value="Namibe">Namibe</option>
                    <option value="Zaire">Zaire (Soyo/Mbanza Kongo)</option>
                    <option value="Bié">Bié (Cuito)</option>
                    <option value="Moxico">Moxico (Luena)</option>
                    <option value="Lunda Norte">Lunda Norte</option>
                    <option value="Lunda Sul">Lunda Sul</option>
                    <option value="Cuando Cubango">Cuando Cubango</option>
                    <option value="Cunene">Cunene (Ondjiva)</option>
                    <option value="Bengo">Bengo (Caxito)</option>
                    <option value="Exterior">Internacional / Diáspora</option>
                  </select>
                </div>
              </div>

              <!-- ── Campos Exclusivos para ESTUDANTE ── -->
              <div id="settings-student-fields" style="display:${user.role !== 'professor' ? 'flex' : 'none'}; flex-direction:column; gap:10px;">
                <div class="settings-input-row">
                  <span class="settings-field-label">Curso:</span>
                  <input type="text" id="settings-course-input" value="Engenharia Informática" class="settings-input" style="flex:1;" />
                </div>
                <div class="settings-input-row">
                  <span class="settings-field-label">Ano Curricular:</span>
                  <select id="settings-year-select" class="filter-select" style="flex:1; padding:8px 12px; font-size:13px;">
                    <option value="1º Ano">1º Ano (Caloiro)</option>
                    <option value="2º Ano">2º Ano</option>
                    <option value="3º Ano" selected>3º Ano (Finalista Licenciatura)</option>
                    <option value="4º Ano">4º Ano</option>
                    <option value="5º Ano">5º Ano (Engenharias)</option>
                    <option value="Mestrado">Pós-Graduação / Mestrado</option>
                  </select>
                </div>
                <div class="settings-input-row">
                  <span class="settings-field-label">Nº Matrícula:</span>
                  <input type="text" id="settings-studentid-input" value="${user.studentId || 'UAN-2023-8841'}" class="settings-input" style="flex:1;" placeholder="Ex: UAN-2023-8841" />
                </div>
              </div>

              <!-- ── Campos Exclusivos para DOCENTE / PROFESSOR ── -->
              <div id="settings-teacher-fields" style="display:${user.role === 'professor' ? 'flex' : 'none'}; flex-direction:column; gap:10px;">
                <div class="settings-input-row">
                  <span class="settings-field-label">Titulação / Grau:</span>
                  <select id="settings-teacher-degree" class="filter-select" style="flex:1; padding:8px 12px; font-size:13px;">
                    <option value="Prof. Doutor (Ph.D)">Prof. Doutor (Ph.D / Doutoramento)</option>
                    <option value="Mestre (M.Sc)">Mestre (M.Sc / Pós-Graduado)</option>
                    <option value="Licenciado / Eng.º" selected>Licenciado / Eng.º / Docente Auxiliar</option>
                    <option value="Prof. Catedrático">Professor Catedrático Titular</option>
                    <option value="Monitor Universitário">Monitor / Assistente de Cadeira</option>
                  </select>
                </div>
                <div class="settings-input-row">
                  <span class="settings-field-label">Departamento:</span>
                  <input type="text" id="settings-teacher-dept" value="${user.department || 'Departamento de Engenharia Informática'}" class="settings-input" style="flex:1;" placeholder="Ex: Departamento de Ciências da Computação" />
                </div>
                <div class="settings-input-row">
                  <span class="settings-field-label">Disciplinas:</span>
                  <input type="text" id="settings-teacher-courses" value="${user.teachingCourses || 'Algoritmos & Complexidade, Inteligência Artificial'}" class="settings-input" style="flex:1;" placeholder="Ex: Cálculo I, Álgebra Linear, Redes" />
                </div>
                <div class="settings-input-row">
                  <span class="settings-field-label">Atendimento:</span>
                  <input type="text" id="settings-teacher-hours" value="${user.officeHours || 'Terças e Quintas das 10h às 12h'}" class="settings-input" style="flex:1;" placeholder="Ex: Sala 204 · Quartas 14h–16h" />
                </div>
              </div>

            </div>

            <!-- Secção: Redes Sociais & Portfólio Externo -->
            <div class="settings-card-group">
              <label class="settings-group-title">🔗 Redes sociais e contactos</label>
              <div style="font-size:11px; color:var(--color-text-muted); margin-bottom:8px;">
                Os teus colegas podem falar contigo através das tuas redes sociais e profissionais.
              </div>
              
              <div class="settings-social-input-row">
                <span class="social-icon-badge" style="background:#0A66C2; color:white;">in</span>
                <input type="text" id="settings-social-linkedin" value="${socials.linkedin || ''}" placeholder="linkedin.com/in/teu-perfil" class="settings-input" style="flex:1;" />
              </div>

              <div class="settings-social-input-row" style="margin-top:10px;">
                <span class="social-icon-badge" style="background:#24292F; color:white;">🐙</span>
                <input type="text" id="settings-social-github" value="${socials.github || ''}" placeholder="github.com/teu-usuario" class="settings-input" style="flex:1;" />
              </div>

              <div class="settings-social-input-row" style="margin-top:10px;">
                <span class="social-icon-badge" style="background:linear-gradient(45deg, #F58529, #DD2A7B, #8134AF); color:white;">📸</span>
                <input type="text" id="settings-social-instagram" value="${socials.instagram || ''}" placeholder="@teu_instagram" class="settings-input" style="flex:1;" />
              </div>

              <div class="settings-social-input-row" style="margin-top:10px;">
                <span class="social-icon-badge" style="background:#25D366; color:white;">💬</span>
                <input type="text" id="settings-social-whatsapp" value="${socials.whatsapp || ''}" placeholder="+244 9XX XXX XXX (WhatsApp de Estudo)" class="settings-input" style="flex:1;" />
              </div>
            </div>

            <!-- Secção: Privacidade & Visibilidade de Estudos -->
            <div class="settings-card-group">
              <label class="settings-group-title">🔒 Privacidade & partilha de materiais de estudo</label>
              <div class="settings-input-row">
                <span class="settings-field-label">Visibilidade:</span>
                <select id="settings-privacy-select" class="filter-select" style="flex:1; padding:8px 12px; font-size:13px;">
                  <option value="public" selected>🌍 Público (Todos os estudantes de Angola)</option>
                  <option value="university">🏛️ Colegas da UAN apenas</option>
                  <option value="friends">👥 Apenas contactos que sigo</option>
                  <option value="private">🔒 Privado (Apenas eu)</option>
                </select>
              </div>

              <div class="settings-toggle-row" style="margin-top:12px;">
                <div>
                  <div class="settings-toggle-label">Exibir redes sociais no meu perfil público</div>
                  <div class="settings-toggle-desc">Permitir que colegas vejam o teu LinkedIn e GitHub</div>
                </div>
                <label class="apple-switch">
                  <input type="checkbox" id="settings-toggle-showsocials" checked>
                  <span class="apple-slider"></span>
                </label>
              </div>
            </div>

            <!-- Secção: Preferências de Estudo & Economia de Megas -->
            <div class="settings-card-group">
              <label class="settings-group-title">📶 Poupar dados e usar sem internet</label>
              
              <div class="settings-toggle-row">
                <div>
                  <div class="settings-toggle-label">Guardar materiais de estudo para usar sem internet</div>
                  <div class="settings-toggle-desc">Permite ler PDFs no telemóvel sem gastar saldo</div>
                </div>
                <label class="apple-switch">
                  <input type="checkbox" id="settings-toggle-offline" checked>
                  <span class="apple-slider"></span>
                </label>
              </div>

              <div class="settings-toggle-row" style="margin-top:12px;">
                <div>
                  <div class="settings-toggle-label">Alertas de novos exames nacionais</div>
                  <div class="settings-toggle-desc">Notificar quando professores publicarem resoluções</div>
                </div>
                <label class="apple-switch">
                  <input type="checkbox" id="settings-toggle-alerts" checked>
                  <span class="apple-slider"></span>
                </label>
              </div>
            </div>

          </div>

          <div style="margin-top:16px; padding-top:12px; border-top:1px solid var(--color-border); display:flex; gap:10px;">
            <button type="button" class="btn btn--primary btn--full btn--lg" id="settings-save-btn" style="border-radius:var(--radius-lg); padding:13px; font-weight:700;">
              💾 Guardar Todas as Definições
            </button>
          </div>
        </div>
      </div>
    `;
  }

  _renderLogoutModal() {
    const user = IMPACTA_DATA.currentUser;
    return `
      <div class="modal-overlay" id="logout-modal" role="dialog" aria-modal="true" aria-label="Terminar Sessão">
        <div class="bottom-sheet logout-modal-sheet" style="max-width:440px; margin:auto;">
          <div class="bottom-sheet__handle"></div>
          
          <div style="text-align:center; padding:10px 8px 16px;">
            <div class="logout-avatar-box">
              <div class="avatar avatar--lg" style="margin:0 auto 12px; border:3px solid rgba(244, 63, 94, 0.2);" id="logout-avatar-el">
                ${user.avatarUrl
                  ? `<img src="${user.avatarUrl}" alt="${user.name}" class="profile-avatar-img" />`
                  : `<div class="avatar-placeholder">${user.initials}</div>`
                }
              </div>
              <h2 style="font-size:18px; font-weight:800; color:var(--color-text-primary); margin-bottom:4px;">Terminar sessão?</h2>
              <p style="font-size:13px; color:var(--color-text-secondary); line-height:1.5; max-width:320px; margin:0 auto;">
                Tens a certeza de que desejas sair da conta de <strong>${user.name}</strong>?
              </p>
              <div class="logout-offline-note">
                📶 <strong>Modo sem internet:</strong> Os materiais de estudo transferidos continuarão guardados no dispositivo.
              </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:10px; margin-top:20px;">
              <button type="button" class="btn btn--full btn--lg" id="logout-confirm-btn" style="background:#F43F5E; color:white; border-radius:var(--radius-lg); font-weight:700; padding:13px; border:none; box-shadow:0 4px 16px rgba(244,63,94,0.3);">
                🚪 Sim, Terminar Sessão
              </button>
              <button type="button" class="btn btn--ghost btn--full" id="logout-cancel-btn" style="border-radius:var(--radius-lg); font-weight:600; padding:12px;">
                Voltar e Continuar Conectado
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  _renderFilterPanel() {
    const t = (k) => window.I18n ? window.I18n.t(k) : k;
    return `
      <div class="filter-panel-overlay" id="filter-overlay">
        <div class="filter-panel" id="filter-panel">
          <div class="filter-panel__handle"></div>
          <div class="filter-panel__header">
            <h2 class="filter-panel__title">🔍 ${t('actions.filterTitle')}</h2>
            <button class="filter-panel__close" id="filter-close">${ICONS.close}</button>
          </div>

          <div class="filter-section">
            <p class="filter-section__label">Tipo de conteúdo</p>
            <div class="filter-chips">
              <div class="chip active" data-filter-type="all">${t('tabs.all')}</div>
              <div class="chip" data-filter-type="posts">${t('tabs.posts')}</div>
              <div class="chip" data-filter-type="users">${t('tabs.students')}</div>
              <div class="chip" data-filter-type="communities">${t('communities.title')}</div>
            </div>
          </div>

          <div class="filter-section">
            <p class="filter-section__label">Universidade ou instituto</p>
            <select class="filter-select" aria-label="Selecionar universidade">
              <option value="">🏛️ Todas as instituições</option>
              <option value="uan">UAN - Universidade Agostinho Neto</option>
              <option value="ucan">UCAN - Universidade Católica de Angola</option>
              <option value="isptec">ISPTEC - Inst. Sup. Politécnico de Tecnologias</option>
              <option value="isutic">ISUTIC - Inst. Sup. de Tecnologias de Informação</option>
              <option value="umn">UMN - Universidade Mandume ya Ndemufayo</option>
              <option value="ukb">UKB - Universidade Katyavala Bwila</option>
            </select>
          </div>

          <div class="filter-section">
            <p class="filter-section__label">Ordenar por</p>
            <div class="filter-sort-chips">
              <div class="filter-sort-chip active">${t('actions.sortRelevant')}</div>
              <div class="filter-sort-chip">${t('actions.sortRecent')}</div>
              <div class="filter-sort-chip">${t('actions.sortPopular')}</div>
            </div>
          </div>

          <button class="btn btn--primary btn--full" id="apply-filters" style="margin-top: 8px; border-radius: var(--radius-lg); padding: 14px;">
            ${t('actions.applyFilters')}
          </button>
        </div>
      </div>
    `;
  }

  _renderCreateModal() {
    return `
      <div class="modal-overlay" id="create-modal" role="dialog" aria-modal="true" aria-label="Criar publicação">
        <div class="bottom-sheet">
          <div class="bottom-sheet__handle"></div>

          <!-- Cabeçalho -->
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-shrink:0;">
            <div>
              <h2 style="font-size:18px; font-weight:800; color:var(--color-text-primary); line-height:1.2;">✨ O que queres partilhar?</h2>
              <p style="font-size:12px; color:var(--color-text-muted); margin-top:3px; font-weight:400;">Escolhe o tipo de publicação</p>
            </div>
            <button class="filter-panel__close" id="create-modal-close" aria-label="Fechar modal">${ICONS.close}</button>
          </div>

          <!-- Opções -->
          <div style="display:flex; gap:10px; flex-direction:column; flex:1;">
            <button class="modal-option-btn" id="btn-create-write">
              <span class="modal-opt-icon">✏️</span>
              <div style="flex:1; min-width:0;">
                <div style="font-weight:700; font-size:14px; color:var(--color-text-primary);">Pergunta ou publicação</div>
                <div style="font-size:12px; color:var(--color-text-muted); font-weight:400; margin-top:2px; line-height:1.4;">Partilha uma pergunta, ideia ou dica de estudo</div>
              </div>
            </button>
            <button class="modal-option-btn" id="btn-create-video">
              <span class="modal-opt-icon">🎥</span>
              <div style="flex:1; min-width:0;">
                <div style="font-weight:700; font-size:14px; color:var(--color-text-primary);">Vídeo curto ou dica</div>
                <div style="font-size:12px; color:var(--color-text-muted); font-weight:400; margin-top:2px; line-height:1.4;">Partilha um vídeo de estudo com até 60 segundos</div>
              </div>
            </button>
            <button class="modal-option-btn" id="btn-create-resource">
              <span class="modal-opt-icon">📚</span>
              <div style="flex:1; min-width:0;">
                <div style="font-weight:700; font-size:14px; color:var(--color-text-primary);">Material de estudo ou ficheiro PDF</div>
                <div style="font-size:12px; color:var(--color-text-muted); font-weight:400; margin-top:2px; line-height:1.4;">Partilha exames resolvidos, resumos e livros digitais</div>
              </div>
            </button>
          </div>

          <!-- Cancelar -->
          <button class="btn btn--ghost" id="create-modal-cancel"
            style="width:100%; margin-top:16px; color:var(--color-text-muted); font-weight:600; padding:13px; border-radius:14px; font-size:14px; flex-shrink:0;">
            Cancelar
          </button>
        </div>
      </div>
    `;
  }

  // ── Navegação & Atualização Visual ─────────────────────────
  _navigate(pageId) {
    if (pageId === this.currentPage && pageId !== 'home') return;

    this.previousPage = this.currentPage;
    this.currentPage  = pageId;

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    const target = document.getElementById(`page-${pageId}`);
    if (target) {
      target.classList.add('active');
      this._renderPage(pageId, target);
    }

    this._updateNav(pageId);
    this._updateTopbar(pageId);

    const container = document.getElementById('pages-container');
    if (container) container.scrollTop = 0;

    const pagesContainer = document.getElementById('pages-container');
    const topbar = document.getElementById('topbar');
    if (pageId === 'reels') {
      pagesContainer.classList.add('no-topbar');
      topbar.style.display = 'none';
    } else {
      pagesContainer.classList.remove('no-topbar');
      topbar.style.display = '';
    }
  }

  _renderPage(pageId, container) {
    if (!container.dataset.rendered || pageId === 'home') {
      const module = this.modules[pageId];
      if (module && typeof module.render === 'function') {
        container.innerHTML = module.render();
        window.I18n?.applyDOM(container);
        if (typeof module.afterRender === 'function') module.afterRender(container);
      }
      if (pageId !== 'home') container.dataset.rendered = 'true';
    }
  }

  _setupFooterReveal() {
    const scroller = document.getElementById('pages-container');
    const footer = document.getElementById('impacta-footer');
    const reopen = document.getElementById('impacta-footer-reopen');
    const hideButton = document.getElementById('impacta-footer-hide');
    const showButton = document.getElementById('impacta-footer-show');
    if (!scroller || !footer || !reopen) return;
    const year = document.getElementById('impacta-footer-year');
    if (year) year.textContent = String(new Date().getFullYear());

    let hiddenByChoice = false;
    try { hiddenByChoice = localStorage.getItem('impacta.footerHidden') === 'true'; } catch (_) {}
    footer.hidden = hiddenByChoice;
    reopen.hidden = !hiddenByChoice;
    const observer = 'IntersectionObserver' in window
      ? new IntersectionObserver((entries) => {
          entries.forEach((entry) => entry.target.classList.toggle('is-visible', entry.isIntersecting));
        }, { root: scroller, threshold: 0.12 })
      : null;
    const observeCurrent = () => {
      if (!observer) {
        (hiddenByChoice ? reopen : footer).classList.add('is-visible');
        return;
      }
      observer.disconnect();
      observer.observe(hiddenByChoice ? reopen : footer);
    };
    observeCurrent();

    hideButton?.addEventListener('click', () => {
      hiddenByChoice = true;
      try { localStorage.setItem('impacta.footerHidden', 'true'); } catch (_) {}
      footer.classList.remove('is-visible');
      footer.hidden = true;
      reopen.hidden = false;
      observeCurrent();
    });
    showButton?.addEventListener('click', () => {
      hiddenByChoice = false;
      try { localStorage.removeItem('impacta.footerHidden'); } catch (_) {}
      reopen.classList.remove('is-visible');
      reopen.hidden = true;
      footer.hidden = false;
      observeCurrent();
    });
  }

  _updateNav(pageId) {
    const navMap = { home: 'home', reels: 'reels', discover: 'discover', inbox: 'inbox', profile: 'profile', search: 'discover', users: 'discover', communities: 'communities' };
    const activeNav = navMap[pageId] || pageId;
    const t = (k) => window.I18n ? window.I18n.t(k) : k;

    // Atualizar menu móvel
    document.querySelectorAll('.bottom-nav .nav-item[data-nav]').forEach(btn => {
      const isActive = btn.dataset.nav === activeNav;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-current', isActive ? 'page' : 'false');
    });

    // Atualizar menu Desktop
    document.querySelectorAll('.desktop-menu-btn[data-nav]').forEach(btn => {
      const isActive = btn.dataset.nav === activeNav;
      btn.classList.toggle('active', isActive);
      const iconEl = btn.querySelector('.nav-icon');
      if (iconEl) {
        if (btn.dataset.nav === 'home') iconEl.innerHTML = isActive ? ICONS.homeFill : ICONS.home;
        if (btn.dataset.nav === 'discover') iconEl.innerHTML = isActive ? ICONS.discoverFill : ICONS.discover;
        if (btn.dataset.nav === 'inbox') iconEl.innerHTML = isActive ? ICONS.inboxFill : ICONS.inbox;
      }
    });

    // Atualizar pill do estudante no desktop
    const userPill = document.querySelector('.desktop-user-pill');
    if (userPill) {
      userPill.classList.toggle('active', activeNav === 'profile');
    }
  }

  _updateTopbar(pageId) {
    const defaultCfg = { type: 'logo', actions: ['lang', 'search', 'bell'] };
    const cfg = this.topbarConfig[pageId] || defaultCfg;
    const logo    = document.getElementById('topbar-logo');
    const backBtn = document.getElementById('topbar-back');
    const title   = document.getElementById('topbar-title');
    const actions = document.getElementById('topbar-actions');
    const topbar  = document.getElementById('topbar');
    const t = (k) => window.I18n ? window.I18n.t(k) : k;

    // Cabeçalho unificado idêntico em todas as telas do Impacta
    if (topbar)  topbar.style.display = 'flex';
    if (logo)    logo.style.display = 'flex';
    if (backBtn) backBtn.style.display = 'none';
    if (title)   title.style.display = 'none';

    // Logo sempre clicável para voltar ao feed inicial
    if (logo) {
      logo.style.cursor = 'pointer';
      logo.onclick = () => this._navigate('home');
    }

    const actionMap = {
      lang:   `<button class="topbar__btn" aria-label="Idioma" id="topbar-lang-btn" style="color:var(--color-primary);">${ICONS.globe || '🌐'}</button>`,
      search: `<button class="topbar__btn" aria-label="Pesquisa" id="topbar-search-btn">${ICONS.search}</button>`,
      bell:   `<button class="topbar__btn" aria-label="Notificações" style="position:relative">
                  ${ICONS.bell}
                  <span class="badge" style="top:4px; right:4px; min-width:14px; height:14px; font-size:8px; border:1.5px solid var(--color-bg);">2</span>
               </button>`,
      filter: `<button class="topbar__btn" aria-label="Filtro" id="topbar-filter-btn">${ICONS.filter}</button>`,
      edit:   `<button class="topbar__btn" aria-label="Nova Mensagem">${ICONS.newMsg}</button>`,
    };

    if (actions) {
      actions.innerHTML = (cfg.actions && cfg.actions.length ? cfg.actions : defaultCfg.actions)
        .map(a => actionMap[a] || '')
        .join('');
    }

    const langBtn = document.getElementById('topbar-lang-btn');
    if (langBtn) langBtn.onclick = () => this.openLangModal();

    const searchBtn = document.getElementById('topbar-search-btn');
    if (searchBtn) searchBtn.onclick = () => this._navigate('search');

    const filterBtn = document.getElementById('topbar-filter-btn');
    if (filterBtn) filterBtn.onclick = () => this.openFilterPanel();
  }

  _updateDesktopWidgets() {
    const t = (k) => window.I18n ? window.I18n.t(k) : k;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (key) el.textContent = t(key);
    });
  }

  _initModules() {
    this.modules = {
      home:        window.FeedModule,
      reels:       window.ReelsModule,
      discover:    window.DiscoverModule,
      inbox:       window.InboxModule,
      profile:     window.ProfileModule,
      search:      window.SearchModule,
      users:       window.UsersModule,
      communities: window.CommunitiesModule,
    };
  }

  _bindGlobal() {
    // Cliques em navegação (Mobile e Desktop)
    document.addEventListener('click', (e) => {
      const navBtn = e.target.closest('[data-nav]');
      if (navBtn) {
        this._navigate(navBtn.dataset.nav);
        return;
      }
    });

    // Botão criar desktop
    const desktopCreate = document.getElementById('desktop-create-btn');
    if (desktopCreate) {
      desktopCreate.onclick = () => this.openCreateModal();
    }

    // Menu de contexto no Card do Estudante Desktop
    const ctxMenuBtn = document.getElementById('desktop-user-more-btn');
    const ctxMenu = document.getElementById('user-context-menu');
    if (ctxMenuBtn && ctxMenu) {
      ctxMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        ctxMenu.classList.toggle('open');
        if (window.Haptic) window.Haptic.light();
      });

      document.addEventListener('click', (e) => {
        if (!ctxMenu.contains(e.target) && e.target !== ctxMenuBtn) {
          ctxMenu.classList.remove('open');
        }
      });

      ctxMenu.querySelectorAll('[data-ctx-action]').forEach(item => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const action = item.dataset.ctxAction;
          ctxMenu.classList.remove('open');
          if (action === 'settings') {
            this.openSettingsModal();
          } else if (action === 'lang') {
            this.openLangModal();
          } else if (action === 'switch-account') {
            window.location.href = 'login.html';
            if (window.Toast) window.Toast.info('🔄 Troca de Conta — Funcionalidade de múltiplos perfis!');
          } else if (action === 'logout') {
            this.openLogoutModal();
          }
          if (window.Haptic) window.Haptic.medium();
        });
      });
    }

    // Create button mobile
    const createBtn = document.getElementById('nav-create');
    if (createBtn) {
      createBtn.addEventListener('click', () => this.openCreateModal());
    }

    // Fechar qualquer modal ativo com tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeCreateModal();
        this.closeLangModal();
        this.closeSettingsModal();
        this.closeLogoutModal();
        this.closeFilterPanel();
        if (window.CreatePostModal) window.CreatePostModal.close();
        if (window.CommentModal) window.CommentModal.close();
        if (window.DocPreviewModal) window.DocPreviewModal.close();
      }
    });

    const createClose = document.getElementById('create-modal-close');
    if (createClose) createClose.addEventListener('click', () => this.closeCreateModal());

    const createCancel = document.getElementById('create-modal-cancel');
    if (createCancel) createCancel.addEventListener('click', () => this.closeCreateModal());

    const createModal = document.getElementById('create-modal');
    if (createModal) {
      createModal.addEventListener('click', (e) => {
        if (e.target === createModal) this.closeCreateModal();
      });
    }

    const btnCreateWrite = document.getElementById('btn-create-write');
    if (btnCreateWrite) btnCreateWrite.onclick = () => {
      this.closeCreateModal();
      if (window.CreatePostModal) window.CreatePostModal.open('text');
    };

    const btnCreateVideo = document.getElementById('btn-create-video');
    if (btnCreateVideo) btnCreateVideo.onclick = () => {
      this.closeCreateModal();
      if (window.CreatePostModal) window.CreatePostModal.open('video');
    };

    const btnCreateResource = document.getElementById('btn-create-resource');
    if (btnCreateResource) btnCreateResource.onclick = () => {
      this.closeCreateModal();
      if (window.CreatePostModal) window.CreatePostModal.open('pdf');
    };

    // Lang modal
    const langModal = document.getElementById('lang-modal');
    const langClose = document.getElementById('lang-modal-close');
    if (langModal) langModal.addEventListener('click', (e) => {
      if (e.target === langModal) this.closeLangModal();
    });
    if (langClose) langClose.addEventListener('click', () => this.closeLangModal());

    document.querySelectorAll('[data-set-lang]').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.setLang;
        if (window.I18n) window.I18n.setLanguage(lang);
        this.closeLangModal();
      });
    });

    // Settings modal events
    const settingsModal = document.getElementById('settings-modal');
    const settingsClose = document.getElementById('settings-modal-close');
    if (settingsModal) {
      settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) this.closeSettingsModal();
      });
    }
    if (settingsClose) settingsClose.addEventListener('click', () => this.closeSettingsModal());

    // Seleção de status dentro de definições
    document.querySelectorAll('[data-select-status]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-select-status]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const status = btn.dataset.selectStatus;
        IMPACTA_DATA.currentUser.status = status;
        if (window.Haptic) window.Haptic.light();
      });
    });

    // Seleção de idioma preferido dentro de definições
    let selectedSettingsLang = IMPACTA_DATA.currentUser.preferredLang || 'pt-AO';
    document.querySelectorAll('[data-settings-lang]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-settings-lang]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedSettingsLang = btn.dataset.settingsLang;
        if (window.Haptic) window.Haptic.light();
      });
    });

    // Role pills: Estudante vs Docente
    document.querySelectorAll('[data-academic-role]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-academic-role]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        IMPACTA_DATA.currentUser.role = btn.dataset.academicRole;
        const isProf = btn.dataset.academicRole === 'professor';
        const stuFields = document.getElementById('settings-student-fields');
        const teachFields = document.getElementById('settings-teacher-fields');
        if (stuFields) stuFields.style.display = isProf ? 'none' : 'flex';
        if (teachFields) teachFields.style.display = isProf ? 'flex' : 'none';
        if (window.Haptic) window.Haptic.light();
      });
    });

    // Escola personalizada: mostrar caixa quando "outra" selecionada
    const uniSelectEl = document.getElementById('settings-university-select');
    if (uniSelectEl) {
      uniSelectEl.addEventListener('change', () => {
        const customBox = document.getElementById('settings-custom-school-box');
        if (customBox) {
          customBox.style.display = uniSelectEl.value === 'other' ? 'flex' : 'none';
        }
      });
    }

    const settingsSave = document.getElementById('settings-save-btn');
    if (settingsSave) {
      settingsSave.addEventListener('click', () => {
        const user = IMPACTA_DATA.currentUser;
        const uni = document.getElementById('settings-university-select')?.value;
        const course = document.getElementById('settings-course-input')?.value;
        const year = document.getElementById('settings-year-select')?.value;
        const studentId = document.getElementById('settings-studentid-input')?.value;
        const privacy = document.getElementById('settings-privacy-select')?.value;

        // Redes Sociais
        const linkedin = document.getElementById('settings-social-linkedin')?.value.trim();
        const github = document.getElementById('settings-social-github')?.value.trim();
        const instagram = document.getElementById('settings-social-instagram')?.value.trim();
        const whatsapp = document.getElementById('settings-social-whatsapp')?.value.trim();

        // Papel académico (Estudante / Docente)
        const roleBtn = document.querySelector('[data-academic-role].active');
        const role = roleBtn?.dataset.academicRole;
        if (role) user.role = role;

        // Escola personalizada
        const uniVal = document.getElementById('settings-university-select')?.value;
        const customSchoolName = document.getElementById('settings-custom-school-name')?.value.trim();
        const schoolProvince = document.getElementById('settings-school-province')?.value;
        if (uniVal === 'other' && customSchoolName) {
          user.customSchool = customSchoolName;
          user.university = customSchoolName;
        } else if (uniVal && uniVal !== 'other') {
          user.university = uniVal;
        }
        if (schoolProvince) user.schoolProvince = schoolProvince;

        // Campos de Docente
        const teacherDegree = document.getElementById('settings-teacher-degree')?.value;
        const teacherDept = document.getElementById('settings-teacher-dept')?.value;
        const teacherCourses = document.getElementById('settings-teacher-courses')?.value;
        const teacherHours = document.getElementById('settings-teacher-hours')?.value;
        if (role === 'professor') {
          if (teacherDegree) user.title = teacherDegree;
          if (teacherDept) user.department = teacherDept;
          if (teacherCourses) user.teachingCourses = teacherCourses;
          if (teacherHours) user.officeHours = teacherHours;
        }

        // Campos de Estudante
        if (course) user.faculty = course;
        if (year) user.academicYear = year;
        if (studentId) user.studentId = studentId;
        if (privacy) user.studyPrivacy = privacy;

        // Bio e localização
        const bioVal = document.getElementById('settings-bio-input')?.value.trim();
        const locationVal = document.getElementById('settings-location-input')?.value.trim();
        if (bioVal) user.bio = bioVal;
        if (locationVal) user.location = locationVal;

        user.socialLinks = {
          linkedin: linkedin || '',
          github: github || '',
          instagram: instagram || '',
          whatsapp: whatsapp || ''
        };

        // Atualizar ponto visual no desktop user pill
        const statusDot = document.querySelector('.desktop-user-pill .avatar-status');
        if (statusDot) {
          statusDot.className = `avatar-status avatar-status--${user.status || 'available'}`;
        }

        // Alterar idioma se for diferente
        if (selectedSettingsLang && window.I18n && window.I18n.currentLang !== selectedSettingsLang) {
          user.preferredLang = selectedSettingsLang;
          window.I18n.setLanguage(selectedSettingsLang);
        }

        this.closeSettingsModal();
        if (window.Toast) window.Toast.success('✅ Definições, redes e dados académicos guardados com sucesso!');
        if (window.Haptic) window.Haptic.success();
      });
    }

    // Logout modal events
    const logoutModal = document.getElementById('logout-modal');
    const logoutCancel = document.getElementById('logout-cancel-btn');
    const logoutConfirm = document.getElementById('logout-confirm-btn');
    if (logoutModal) {
      logoutModal.addEventListener('click', (e) => {
        if (e.target === logoutModal) this.closeLogoutModal();
      });
    }
    if (logoutCancel) logoutCancel.addEventListener('click', () => this.closeLogoutModal());
    if (logoutConfirm) {
      logoutConfirm.addEventListener('click', () => {
        this.closeLogoutModal();
        window.location.href = 'login.html';
        if (window.Toast) window.Toast.info('👋 Sessão terminada com sucesso! Até breve.');
        if (window.Haptic) window.Haptic.medium();
      });
    }

    // Filter panel
    const filterOverlay = document.getElementById('filter-overlay');
    const filterClose   = document.getElementById('filter-close');
    if (filterOverlay) filterOverlay.addEventListener('click', (e) => {
      if (e.target === filterOverlay) this.closeFilterPanel();
    });
    if (filterClose) filterClose.addEventListener('click', () => this.closeFilterPanel());

    const applyFilters = document.getElementById('apply-filters');
    if (applyFilters) applyFilters.addEventListener('click', () => {
      this.closeFilterPanel();
      if (window.Toast) window.Toast.success('Filtros aplicados!');
    });

    document.getElementById('pages-container').addEventListener('click', (e) => {
      this._handleGlobalClick(e);
    });
  }

  _handleGlobalClick(e) {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;

    if (action === 'go-search')       this._navigate('search');
    if (action === 'go-users')        this._navigate('users');
    if (action === 'go-communities')  this._navigate('communities');
    if (action === 'go-reels')        this._navigate('reels');
    if (action === 'go-profile')      this._navigate('profile');
    if (action === 'open-filter')     this.openFilterPanel();
    if (action === 'open-settings') {
      this.openSettingsModal();
      return;
    }
    if (action === 'open-create-image') {
      if (window.CreatePostModal) window.CreatePostModal.open('image');
      return;
    }
    if (action === 'open-create-video') {
      if (window.CreatePostModal) window.CreatePostModal.open('video');
      return;
    }

    if (action === 'download-doc') {
      const title = target.dataset.docTitle || 'Resolução de exames';
      const filename = target.dataset.filename || 'material_estudo_impacta.pdf';
      if (window.ImpactaDownload) window.ImpactaDownload.downloadPdf(filename, title);
      const counter = target.closest('.post-doc-card')?.querySelector('.doc-downloads-count');
      if (counter) {
        const val = parseInt(counter.textContent.replace(/\D/g, '')) || 1420;
        counter.textContent = formatCount(val + 1);
      }
      const label = target.querySelector('span');
      if (label) {
        const orig = label.textContent;
        label.textContent = window.I18n?.t('ui.downloadComplete') || '✅ Transferido!';
        setTimeout(() => { label.textContent = orig; }, 2500);
      }
      return;
    }

    if (action === 'preview-doc') {
      const title = target.dataset.docTitle || 'Resolução de exames';
      if (window.DocPreviewModal) window.DocPreviewModal.open(title);
      return;
    }

    if (action === 'download-video') {
      const title = target.dataset.videoTitle || 'Vídeo Educativo';
      const filename = target.dataset.filename || 'video_aula_impacta.mp4';
      if (window.ImpactaDownload) window.ImpactaDownload.downloadVideo(filename, title);
      const label = target.querySelector('span');
      if (label) {
        const orig = label.textContent;
        label.textContent = window.I18n?.t('ui.downloadComplete') || '✅ Transferido!';
        setTimeout(() => { label.textContent = orig; }, 2500);
      }
      return;
    }

    if (action === 'download-image') {
      const filename = target.dataset.filename || 'imagem_impacta.jpg';
      if (window.ImpactaDownload) window.ImpactaDownload.downloadImage(filename);
      return;
    }

    if (action === 'download-audio') {
      const filename = target.dataset.filename || 'audio_aula.mp3';
      if (window.ImpactaDownload) window.ImpactaDownload.downloadAudio(filename);
      return;
    }

    if (action === 'play-video') {
      const title = target.dataset.videoTitle || 'Vídeo';
      if (window.Toast) window.Toast.info(`▶️ A reproduzir "${title}" em Full HD 1080p`, 3500);
      if (window.Haptic) window.Haptic.medium();
      return;
    }

    if (action === 'play-audio') {
      const card = target.closest('.post-card__audio');
      const isPlaying = target.classList.toggle('playing');
      if (card) {
        card.classList.toggle('audio-active', isPlaying);
        const bars = card.querySelectorAll('.audio-bar');
        bars.forEach((b, i) => {
          b.style.animation = isPlaying ? `audioWave 0.8s ease-in-out infinite alternate ${i * 0.05}s` : 'none';
        });
      }
      target.innerHTML = isPlaying 
        ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`
        : ICONS.play;

      if (window.Toast) {
        window.Toast.info(isPlaying ? '▶️ A reproduzir áudio-aula...' : '⏸️ Áudio em pausa.', 2500);
      }
      if (window.Haptic) window.Haptic.light();
      return;
    }

    if (action === 'like-post') {
      const postId = target.closest('[data-post-id]')?.dataset.postId;
      this._toggleLike(target, postId);
    }

    if (action === 'save-post') {
      const postId = target.closest('[data-post-id]')?.dataset.postId;
      this._toggleSave(target, postId);
    }

    if (action === 'comment-post') {
      const postId = target.closest('[data-post-id]')?.dataset.postId;
      if (window.CommentModal) window.CommentModal.open(postId);
    }

    if (action === 'share-post') {
      const postId = target.closest('[data-post-id]')?.dataset.postId;
      if (typeof window.sharePost === 'function') window.sharePost(postId);
    }

    if (action === 'follow-user') {
      this._toggleFollow(target);
    }

    if (action === 'join-community') {
      this._toggleJoin(target);
    }
  }

  _toggleLike(btn, postId) {
    const isLiked = btn.classList.toggle('liked');
    const countEl = btn.querySelector('.action-count');
    if (countEl) {
      const post = IMPACTA_DATA.posts.find(p => p.id === postId);
      if (post) {
        post.liked = isLiked;
        post.likes += isLiked ? 1 : -1;
        countEl.textContent = formatCount(post.likes);
      }
    }
    const svg = btn.querySelector('svg');
    if (svg) {
      svg.outerHTML = isLiked ? ICONS.heartFill : ICONS.heart;
    }
    if (window.Haptic) isLiked ? window.Haptic.medium() : window.Haptic.light();
    if (isLiked && window.Toast) window.Toast.like('Marcaste como útil!');
  }

  _toggleSave(btn, postId) {
    const isSaved = btn.classList.toggle('saved');
    const t = (k) => window.I18n ? window.I18n.t(k) : k;
    if (isSaved) {
      btn.innerHTML = ICONS.bookmarkFill + `<span class="action-count">${t('feed.saved')}</span>`;
      if (window.Toast) window.Toast.saved('Guardado na tua coleção de estudos!');
    } else {
      btn.innerHTML = ICONS.bookmark + `<span class="action-count">${t('feed.save')}</span>`;
    }
    if (window.Haptic) window.Haptic.light();
  }

  _toggleFollow(btn) {
    const isFollowing = btn.classList.contains('following');
    const t = (k) => window.I18n ? window.I18n.t(k) : k;
    if (isFollowing) {
      btn.classList.remove('following');
      btn.textContent = t('users.follow');
      btn.classList.remove('btn--joined');
      btn.classList.add('btn--primary');
    } else {
      btn.classList.add('following');
      btn.textContent = t('users.following');
      btn.classList.remove('btn--primary');
      btn.classList.add('btn--joined');
      if (window.Toast) window.Toast.info('Agora estás a acompanhar este colega!');
    }
    if (window.Haptic) window.Haptic.medium();
  }

  _toggleJoin(btn) {
    const isJoined = btn.classList.contains('btn--joined');
    const t = (k) => window.I18n ? window.I18n.t(k) : k;
    if (isJoined) {
      btn.classList.remove('btn--joined');
      btn.classList.add('btn--primary');
      btn.textContent = t('communities.join');
    } else {
      btn.classList.add('btn--joined');
      btn.classList.remove('btn--primary');
      btn.textContent = t('communities.joined');
      if (window.Toast) window.Toast.success('Bem-vindo à comunidade académica!');
    }
    if (window.Haptic) window.Haptic.success();
  }

  openCreateModal()  {
    document.getElementById('create-modal')?.classList.add('open');
    document.body.classList.add('modal-open');
    if (window.Haptic) window.Haptic.light();
  }
  closeCreateModal() {
    document.getElementById('create-modal')?.classList.remove('open');
    document.body.classList.remove('modal-open');
  }
  openLangModal()    {
    document.getElementById('lang-modal')?.classList.add('open');
    document.body.classList.add('modal-open');
    if (window.Haptic) window.Haptic.light();
  }
  closeLangModal()   {
    document.getElementById('lang-modal')?.classList.remove('open');
    document.body.classList.remove('modal-open');
  }
  openSettingsModal() {
    document.getElementById('settings-modal')?.classList.add('open');
    document.body.classList.add('modal-open');
    if (window.Haptic) window.Haptic.light();
  }
  closeSettingsModal() {
    document.getElementById('settings-modal')?.classList.remove('open');
    document.body.classList.remove('modal-open');
  }
  openLogoutModal() {
    document.getElementById('logout-modal')?.classList.add('open');
    document.body.classList.add('modal-open');
    if (window.Haptic) window.Haptic.light();
  }
  closeLogoutModal() {
    document.getElementById('logout-modal')?.classList.remove('open');
    document.body.classList.remove('modal-open');
  }
  openFilterPanel()  {
    document.getElementById('filter-overlay')?.classList.add('open');
    document.body.classList.add('modal-open');
    if (window.Haptic) window.Haptic.light();
  }
  closeFilterPanel() {
    document.getElementById('filter-overlay')?.classList.remove('open');
    document.body.classList.remove('modal-open');
  }

  _setupTopbarScroll() {
    const container = document.getElementById('pages-container');
    const topbar    = document.getElementById('topbar');
    if (!container || !topbar) return;
    container.addEventListener('scroll', () => {
      topbar.classList.toggle('scrolled', container.scrollTop > 8);
    }, { passive: true });
  }

  /**
   * Atualiza todos os avatares da UI após o utilizador alterar a foto de perfil.
   * Garante consistência visual sem recarregar a página.
   * @param {string} dataUrl - Base64 da nova imagem (WebP comprimido)
   */
  _refreshAvatarUI(dataUrl) {
    // 1. Sidebar desktop pill
    const sidebarWrap = document.getElementById('sidebar-avatar-wrap');
    if (sidebarWrap) {
      const statusEl = sidebarWrap.querySelector('.avatar-status');
      sidebarWrap.innerHTML = `<img src="${dataUrl}" alt="Avatar" class="sidebar-avatar-img" />`;
      if (statusEl) sidebarWrap.appendChild(statusEl);
    }

    // 2. Mobile topbar avatar (CreatePostModal trigger area)
    document.querySelectorAll('.avatar-placeholder').forEach(el => {
      // Substituir apenas placeholders que mostram iniciais do currentUser (não os de outros utilizadores)
      const parent = el.closest('.avatar');
      if (parent && !parent.closest('[data-post-id]') && !parent.closest('.post-card')) {
        parent.innerHTML = `<img src="${dataUrl}" alt="Avatar" class="sidebar-avatar-img" />`;
      }
    });

    // 3. Logout modal
    const logoutAvatar = document.getElementById('logout-avatar-el');
    if (logoutAvatar) {
      logoutAvatar.innerHTML = `<img src="${dataUrl}" alt="Avatar" class="profile-avatar-img" />`;
    }
  }
}

let App;
document.addEventListener('DOMContentLoaded', () => {
  App = new ImpactaApp();
  App.init();
  // Expor globalmente para módulos externos (ex: profile.js, feed.js)
  window.ImpactaApp = App;
});
