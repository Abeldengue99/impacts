/* ============================================================
   IMPACTA — Interactions: Toast, Modals, Haptics, PWA Install
   ============================================================ */

/* ════════════════════════════════════════════
   TOAST NOTIFICATIONS
   ════════════════════════════════════════════ */
const Toast = {
  container: null,

  init() {
    this.container = document.createElement('div');
    this.container.id = 'toast-container';
    this.container.setAttribute('role', 'status');
    this.container.setAttribute('aria-live', 'polite');
    this.container.style.cssText = `
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% - 32px);
      max-width: 440px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 8px;
      pointer-events: none;
    `;
    document.body.appendChild(this.container);
  },

  show(message, type = 'info', duration = 3000) {
    const icons  = { success: '✅', error: '❌', warning: '⚠️', info: '💡', like: '❤️', saved: '🔖', follow: '👋' };
    const colors = {
      success: '#10B981',
      error:   '#F43F5E',
      warning: '#F59E0B',
      info:    '#5B4BDB',
      like:    '#F43F5E',
      saved:   '#5B4BDB',
      follow:  '#5B4BDB',
    };
    const toast = document.createElement('div');
    toast.style.cssText = `
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      background: rgba(30, 27, 75, 0.92);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      font-family: var(--font-family);
      font-size: 14px;
      font-weight: 500;
      color: white;
      pointer-events: all;
      transform: translateY(-10px) scale(0.95);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      border-left: 3px solid ${colors[type] || colors.info};
    `;
    const icon = document.createElement('span');
    icon.style.cssText = 'font-size:18px;line-height:1;';
    icon.textContent = icons[type] || icons.info;
    const copy = document.createElement('span');
    const source = String(message ?? '');
    copy.textContent = window.I18n?.translateText ? window.I18n.translateText(source) : source;
    toast.append(icon, copy);
    this.container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.style.transform = 'translateY(0) scale(1)';
        toast.style.opacity = '1';
      });
    });

    // Auto-dismiss
    setTimeout(() => {
      toast.style.transform = 'translateY(-8px) scale(0.95)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  success(msg, d) { this.show(msg, 'success', d); },
  error(msg, d)   { this.show(msg, 'error', d); },
  info(msg, d)    { this.show(msg, 'info', d); },
  like(msg, d)    { this.show(msg, 'like', d); },
  saved(msg, d)   { this.show(msg, 'saved', d); },
};

window.Toast = Toast;

/* ════════════════════════════════════════════
   HAPTIC FEEDBACK (Vibration API)
   ════════════════════════════════════════════ */
const Haptic = {
  light()    { if (navigator.vibrate) navigator.vibrate(10); },
  medium()   { if (navigator.vibrate) navigator.vibrate(30); },
  heavy()    { if (navigator.vibrate) navigator.vibrate([30, 10, 30]); },
  success()  { if (navigator.vibrate) navigator.vibrate([10, 30, 10]); },
  error()    { if (navigator.vibrate) navigator.vibrate([50, 20, 50]); },
};

window.Haptic = Haptic;

/* ════════════════════════════════════════════
   COMMENT MODAL
   ════════════════════════════════════════════ */
const CommentModal = {
  el: null,
  overlay: null,

  init() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    this.overlay.id = 'comment-modal-overlay';
    this.overlay.innerHTML = `
      <div class="bottom-sheet" id="comment-sheet" style="max-height:85dvh;display:flex;flex-direction:column;">
        <div class="bottom-sheet__handle"></div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-shrink:0;">
          <h2 style="font-size:16px;font-weight:700;">💬 Comentários</h2>
          <button id="comment-close" style="width:32px;height:32px;border-radius:50%;background:var(--color-overlay);display:flex;align-items:center;justify-content:center;color:var(--color-text-secondary);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="width:16px;height:16px;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div id="comment-list" style="flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:16px;padding-bottom:8px;"></div>
        <div style="display:flex;align-items:center;gap:10px;padding-top:12px;border-top:1px solid var(--color-border);flex-shrink:0;">
          <div class="avatar avatar--sm" style="flex-shrink:0;">
            <div class="avatar-placeholder">AK</div>
          </div>
          <div style="flex:1;background:var(--color-accent-soft);border-radius:999px;padding:10px 16px;display:flex;align-items:center;">
            <input id="comment-input" placeholder="Add a comment..." style="flex:1;background:none;font-size:14px;color:var(--color-text-primary);" />
          </div>
          <button id="comment-send" style="width:38px;height:38px;background:var(--color-primary);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;flex-shrink:0;transition:all 0.2s ease;">
            <svg viewBox="0 0 24 24" fill="currentColor" style="width:18px;height:18px;transform:rotate(90deg);"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(this.overlay);

    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
    document.getElementById('comment-close').addEventListener('click', () => this.close());
    document.getElementById('comment-send').addEventListener('click', () => this._sendComment());
    document.getElementById('comment-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this._sendComment(); }
    });
  },

  open(postId) {
    const comments = IMPACTA_DATA.comments?.[postId] || this._getDefaultComments();
    const list = document.getElementById('comment-list');
    list.innerHTML = comments.map(c => this._renderComment(c)).join('');
    window.I18n?.applyDOM(this.overlay);
    this.overlay.classList.add('open');
    document.body.classList.add('modal-open');
    this._currentPostId = postId;
    setTimeout(() => document.getElementById('comment-input')?.focus(), 350);
    Haptic.light();
  },

  close() {
    this.overlay.classList.remove('open');
    document.body.classList.remove('modal-open');
    Haptic.light();
  },

  _sendComment() {
    const input = document.getElementById('comment-input');
    const text = input?.value.trim();
    if (!text) return;

    const list = document.getElementById('comment-list');
    const newComment = {
      name: IMPACTA_DATA.currentUser.name,
      initials: IMPACTA_DATA.currentUser.initials,
      time: 'Just now',
      text,
      likes: 0,
    };
    const el = document.createElement('div');
    el.innerHTML = this._renderComment(newComment);
    window.I18n?.applyDOM(el);
    el.style.animation = 'fadeInUp 0.3s ease';
    list.appendChild(el.firstElementChild);
    list.scrollTop = list.scrollHeight;
    input.value = '';
    Haptic.success();
    Toast.success('Comment posted!');
  },

  _renderComment(c) {
    return `
      <div style="display:flex;gap:10px;animation:fadeIn 0.3s ease;">
        <div class="avatar avatar--sm" style="flex-shrink:0;">
          <div class="avatar-placeholder" style="font-size:11px;">${c.initials}</div>
        </div>
        <div style="flex:1;">
          <div style="display:flex;align-items:baseline;gap:6px;margin-bottom:3px;">
            <span style="font-size:13px;font-weight:600;color:var(--color-text-primary);">${c.name}</span>
            <span style="font-size:11px;color:var(--color-text-muted);">${c.time}</span>
          </div>
          <p class="comment-body-text" style="font-size:13px;color:var(--color-text-primary);line-height:1.5;">${c.text}</p>
          <div style="display:flex;align-items:center;gap:16px;margin-top:6px;">
            <button style="font-size:11px;color:var(--color-text-muted);display:flex;align-items:center;gap:4px;transition:color 0.15s;"
              onmouseenter="this.style.color='var(--color-like)'"
              onmouseleave="this.style.color='var(--color-text-muted)'">
              ❤️ ${c.likes > 0 ? c.likes : ''}
            </button>
            <button style="font-size:11px;color:var(--color-text-muted);">Responder</button>
          </div>
        </div>
      </div>
    `;
  },

  _getDefaultComments() {
    return [
      { name: 'Sara Ahmed',    initials: 'SA', time: '1h ago',   text: 'Great post! Really helpful for my exam prep 🙏', likes: 12 },
      { name: 'Omar El-Sayed', initials: 'OE', time: '45m ago',  text: 'I use the Pomodoro technique — 25 min study, 5 min break. Works amazing!', likes: 8 },
      { name: 'Nada Mohamed',  initials: 'NM', time: '30m ago',  text: 'Thanks for sharing! Already tried it and it helped a lot 📖', likes: 5 },
      { name: 'Ali Hassan',    initials: 'AH', time: '15m ago',  text: 'Mind maps are also great — especially for complex topics like Organic Chemistry.', likes: 3 },
    ];
  },
};

window.CommentModal = CommentModal;


/* ════════════════════════════════════════════
   COMPRESSOR WEBP PARA DOCUMENTOS E IMAGENS
   Reduz o consumo de megas convertendo imagens pesadas para WebP leve
   ════════════════════════════════════════════ */
const ImpactaCompressor = {
  async compressImage(file, quality = 0.82) {
    if (!file || !file.type.startsWith('image/')) return null;
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let w = img.width;
          let h = img.height;
          const maxDim = 1920;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);

          canvas.toBlob((blob) => {
            if (blob) {
              const origKb = Math.round(file.size / 1024);
              const compKb = Math.round(blob.size / 1024);
              const percent = Math.max(0, Math.round((1 - blob.size / file.size) * 100));
              const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", { type: 'image/webp' });
              
              resolve({
                file: webpFile,
                blob: blob,
                dataUrl: canvas.toDataURL('image/webp', quality),
                name: webpFile.name,
                origSizeStr: origKb >= 1024 ? (origKb / 1024).toFixed(1) + ' MB' : origKb + ' KB',
                compSizeStr: compKb >= 1024 ? (compKb / 1024).toFixed(1) + ' MB' : compKb + ' KB',
                savedPercent: percent
              });
            } else {
              resolve(null);
            }
          }, 'image/webp', quality);
        };
        img.onerror = () => resolve(null);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  },

  /**
   * Comprime e recorta ao centro para avatar quadrado (máx 400px, WebP).
   * @param {File} file - Ficheiro de imagem
   * @param {number} quality - Qualidade WebP (0-1), default 0.80
   * @param {number} maxDim - Dimensão máxima do lado, default 400
   * @returns {Promise<{dataUrl: string, file: File, blob: Blob}|null>}
   */
  async compressAvatar(file, quality = 0.80, maxDim = 400) {
    if (!file || !file.type.startsWith('image/')) return null;
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const w = img.width;
          const h = img.height;
          const minSide = Math.min(w, h);
          const sx = Math.floor((w - minSide) / 2);
          const sy = Math.floor((h - minSide) / 2);
          const size = Math.min(minSide, maxDim);
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
          canvas.toBlob((blob) => {
            if (blob) {
              const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, '') + '_avatar.webp', { type: 'image/webp' });
              resolve({ dataUrl: canvas.toDataURL('image/webp', quality), file: webpFile, blob });
            } else {
              resolve(null);
            }
          }, 'image/webp', quality);
        };
        img.onerror = () => resolve(null);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  },
};

window.ImpactaCompressor = ImpactaCompressor;

/* ════════════════════════════════════════════
   CREATE POST MODAL (full + MediaRecorder Nativo)
   ════════════════════════════════════════════ */
const CreatePostModal = {
  overlay: null,
  activeMediaType: null,
  attachedFileData: null,
  mediaRecorder: null,
  audioChunks: [],
  recordInterval: null,
  recordSeconds: 0,
  audioPreviewAudio: null,

  init() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    this.overlay.id = 'full-create-modal';
    this.overlay.innerHTML = `
      <div class="bottom-sheet" style="max-height:92dvh; display:flex; flex-direction:column;">
        <div class="bottom-sheet__handle"></div>
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:18px; flex-shrink:0;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:22px;">🎓</span>
            <h2 style="font-size:18px; font-weight:800; color:var(--color-text-primary);">Criar uma publicação</h2>
          </div>
          <button id="create-post-close" class="filter-panel__close" aria-label="Fechar">
            ${ICONS.close}
          </button>
        </div>

        <!-- User row -->
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px; flex-shrink:0;">
          <div class="avatar avatar--md"><div class="avatar-placeholder">${IMPACTA_DATA.currentUser.initials}</div></div>
          <div>
            <div style="font-size:15px; font-weight:700; color:var(--color-text-primary);">${IMPACTA_DATA.currentUser.name}</div>
            <div style="font-size:12px; color:var(--color-primary); font-weight:600;">🇦🇴 UAN · Engenharia & TI</div>
          </div>
        </div>

        <!-- Textarea -->
        <textarea id="create-post-text" placeholder="Qual é a dúvida, reflexão ou dica de estudo para hoje? Usa hashtags para organizar por matéria..." style="flex:1; min-height:110px; resize:none; background:var(--color-surface); border:1.5px solid var(--color-border); border-radius:16px; padding:16px; font-size:15px; font-family:var(--font-family); color:var(--color-text-primary); line-height:1.6; margin-bottom:12px; transition:all 0.2s;"></textarea>

        <!-- Caixa de Pré-visualização de Anexo -->
        <div id="create-post-attachment-box" class="create-post-attachment-box" style="display:none;">
          <div class="create-post-attachment-info">
            <span id="attachment-icon">📎</span>
            <span id="attachment-label" class="create-post-attachment-name">Ficheiro seleccionado</span>
          </div>
          <button type="button" id="attachment-remove-btn" class="create-post-attachment-remove" title="Remover anexo">✕</button>
        </div>

        <!-- Badge de Otimização WebP -->
        <div id="create-post-webp-badge" class="create-post-webp-badge" style="display:none;"></div>

        <!-- Interface de Gravação Nativa MediaRecorder -->
        <div id="create-post-audio-recorder" class="create-post-audio-recorder" style="display:none;">
          <div class="recorder-top-bar">
            <div class="recorder-status-wrap">
              <span class="rec-pulse-dot" id="rec-pulse-indicator"></span>
              <span id="recorder-status-text" class="recorder-status-text">Pronto para gravar áudio</span>
            </div>
            <span id="recorder-timer" class="recorder-timer">00:00</span>
          </div>

          <!-- Waveform visualizer durante a gravação -->
          <div class="recorder-waveform" id="recorder-waveform">
            ${Array.from({length: 22}, () => '<div class="rec-bar"></div>').join('')}
          </div>

          <div class="recorder-actions">
            <button type="button" class="btn-rec-control btn-rec-record" id="btn-start-record">
              🎙️ Gravar no Navegador
            </button>
            <button type="button" class="btn-rec-control btn-rec-stop" id="btn-stop-record" style="display:none;">
              ⏹️ Parar & Anexar
            </button>
            <button type="button" class="btn-rec-control btn-rec-play" id="btn-preview-record" style="display:none;">
              ▶️ Ouvir Gravação
            </button>
            <button type="button" class="btn-rec-control btn-rec-file" id="btn-upload-audio-file">
              📁 Ficheiro MP3
            </button>
          </div>
        </div>

        <!-- Inputs de arquivo escondidos -->
        <input type="file" id="create-post-file-image" accept="image/*" style="display:none;">
        <input type="file" id="create-post-file-video" accept="video/*" style="display:none;">
        <input type="file" id="create-post-file-pdf" accept=".pdf,.doc,.docx" style="display:none;">
        <input type="file" id="create-post-file-audio" accept="audio/*,.mp3,.wav,.m4a" style="display:none;">

        <!-- Hashtags Rápidas de Angola -->
        <div style="display:flex; gap:8px; margin-bottom:14px; overflow-x:auto; padding-bottom:4px; flex-shrink:0; scrollbar-width:none;">
          <span class="create-hashtag-chip" data-tag="#UAN">#UAN</span>
          <span class="create-hashtag-chip" data-tag="#ExamesNacionais">#ExamesNacionais</span>
          <span class="create-hashtag-chip" data-tag="#Calculo1">#Calculo1</span>
          <span class="create-hashtag-chip" data-tag="#MaterialDeEstudo">#MaterialDeEstudo</span>
          <span class="create-hashtag-chip" data-tag="#ISPTEC">#ISPTEC</span>
          <span class="create-hashtag-chip" data-tag="#AudioAula">#AudioAula</span>
        </div>

        <!-- Opções de Mídia com ícones elegantes Apple Style -->
        <div class="create-post-media-grid" style="grid-template-columns: repeat(4, 1fr);">
          <button type="button" class="create-post-media-btn" id="create-media-img" data-media="image">
            <span class="media-icon">📷</span> Imagem
          </button>
          <button type="button" class="create-post-media-btn" id="create-media-vid" data-media="video">
            <span class="media-icon">🎥</span> Vídeo
          </button>
          <button type="button" class="create-post-media-btn" id="create-media-pdf" data-media="pdf">
            <span class="media-icon">📄</span> Ficheiro PDF
          </button>
          <button type="button" class="create-post-media-btn" id="create-media-audio" data-media="audio">
            <span class="media-icon">🎙️</span> Áudio-Aula
          </button>
        </div>

        <!-- Botão Publicar -->
        <button id="create-post-submit" class="btn btn--primary btn--full btn--lg" style="padding:15px; border-radius:var(--radius-lg); font-size:16px; font-weight:700; box-shadow:0 6px 20px rgba(91,75,219,0.35);">
          🚀 Publicar na Impacta
        </button>
      </div>
    `;
    document.body.appendChild(this.overlay);

    // Eventos de Fecho
    this.overlay.addEventListener('click', (e) => { if (e.target === this.overlay) this.close(); });
    document.getElementById('create-post-close').addEventListener('click', () => this.close());
    document.getElementById('create-post-submit').addEventListener('click', () => this._submit());

    // Botões de Mídia
    const mediaBtns = this.overlay.querySelectorAll('.create-post-media-btn');
    mediaBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.media;
        if (this.activeMediaType === type) {
          if (type === 'audio') {
            const recEl = document.getElementById('create-post-audio-recorder');
            if (recEl) recEl.style.display = recEl.style.display === 'none' ? 'block' : 'none';
          } else {
            const fileInput = document.getElementById(`create-post-file-${type}`);
            if (fileInput) fileInput.click();
          }
        } else {
          this.setMediaType(type, type !== 'audio');
        }
      });
    });

    // Inputs de Ficheiro com Compressão WebP Automática
    const imageInput = document.getElementById('create-post-file-image');
    if (imageInput) {
      imageInput.addEventListener('change', async (e) => {
        const file = e.target.files?.[0];
        if (file) {
          const webpBadge = document.getElementById('create-post-webp-badge');
          if (webpBadge) {
            webpBadge.style.display = 'block';
            webpBadge.innerHTML = `⚡ <em>A otimizar imagem para WebP...</em>`;
          }

          const result = await ImpactaCompressor.compressImage(file);
          if (result) {
            this.attachedFileData = {
              name: result.name,
              size: result.compSizeStr,
              type: 'image',
              file: result.file,
              dataUrl: result.dataUrl
            };
            if (webpBadge) {
              webpBadge.innerHTML = `✅ <strong>Otimizado para WebP:</strong> ${result.origSizeStr} ➔ ${result.compSizeStr} <span class="badge-saved">(-${result.savedPercent}% de saldo poupado!)</span>`;
            }
            const previewLabel = document.getElementById('attachment-label');
            if (previewLabel) previewLabel.textContent = `${result.name} (${result.compSizeStr})`;
            if (window.Toast) window.Toast.success(`Imagem otimizada em WebP (-${result.savedPercent}% megas)!`);
          } else {
            this.attachedFileData = {
              name: file.name,
              size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
              type: 'image',
              file: file
            };
            const previewLabel = document.getElementById('attachment-label');
            if (previewLabel) previewLabel.textContent = `${file.name} (${this.attachedFileData.size})`;
          }
        }
      });
    }

    ['video', 'pdf', 'audio'].forEach(type => {
      const input = document.getElementById(`create-post-file-${type}`);
      if (input) {
        input.addEventListener('change', (e) => {
          const file = e.target.files?.[0];
          if (file) {
            this.attachedFileData = {
              name: file.name,
              size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
              type: type,
              file: file
            };
            const previewLabel = document.getElementById('attachment-label');
            if (previewLabel) previewLabel.textContent = `${file.name} (${this.attachedFileData.size})`;
            if (window.Toast) window.Toast.success(`Ficheiro "${file.name}" anexado!`);
          }
        });
      }
    });

    // Controlos do Gravador Nativo MediaRecorder
    this._bindAudioRecorderEvents();

    // Remover anexo
    const removeBtn = document.getElementById('attachment-remove-btn');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        this.setMediaType(null);
        ['image', 'video', 'pdf', 'audio'].forEach(t => {
          const input = document.getElementById(`create-post-file-${t}`);
          if (input) input.value = '';
        });
        const webpBadge = document.getElementById('create-post-webp-badge');
        if (webpBadge) webpBadge.style.display = 'none';
        this._stopAudioRecording(true);
      });
    }

    // Chips de Hashtags
    this.overlay.querySelectorAll('.create-hashtag-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const ta = document.getElementById('create-post-text');
        if (ta) {
          const tag = chip.dataset.tag;
          if (!ta.value.includes(tag)) {
            ta.value = (ta.value ? ta.value.trim() + ' ' : '') + tag + ' ';
            ta.focus();
          }
        }
      });
    });

    // Focus style for textarea
    const ta = document.getElementById('create-post-text');
    if (ta) {
      ta.addEventListener('focus', () => ta.style.borderColor = 'var(--color-primary)');
      ta.addEventListener('blur',  () => ta.style.borderColor = 'var(--color-border)');
    }
  },

  _bindAudioRecorderEvents() {
    const btnStart = document.getElementById('btn-start-record');
    const btnStop = document.getElementById('btn-stop-record');
    const btnPreview = document.getElementById('btn-preview-record');
    const btnUpload = document.getElementById('btn-upload-audio-file');

    if (btnStart) btnStart.addEventListener('click', () => this._startAudioRecording());
    if (btnStop) btnStop.addEventListener('click', () => this._stopAudioRecording(false));
    if (btnPreview) btnPreview.addEventListener('click', () => this._previewAudioRecording());
    if (btnUpload) {
      btnUpload.addEventListener('click', () => {
        const input = document.getElementById('create-post-file-audio');
        if (input) input.click();
      });
    }
  },

  async _startAudioRecording() {
    try {
      this.audioChunks = [];
      this.recordSeconds = 0;

      const timerEl = document.getElementById('recorder-timer');
      const statusText = document.getElementById('recorder-status-text');
      const pulse = document.getElementById('rec-pulse-indicator');
      const btnStart = document.getElementById('btn-start-record');
      const btnStop = document.getElementById('btn-stop-record');
      const btnPreview = document.getElementById('btn-preview-record');
      const waveform = document.getElementById('recorder-waveform');

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaStream = stream;
        this.mediaRecorder = new MediaRecorder(stream);

        this.mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) this.audioChunks.push(e.data);
        };
        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          this.recordedAudioUrl = audioUrl;

          const durationStr = `0:${this.recordSeconds < 10 ? '0' : ''}${this.recordSeconds}`;
          this.attachedFileData = {
            name: `Audio_Aula_${Date.now()}.webm`,
            size: `${(audioBlob.size / 1024).toFixed(0)} KB`,
            type: 'audio',
            duration: durationStr,
            blob: audioBlob,
            url: audioUrl
          };
          const previewLabel = document.getElementById('attachment-label');
          const previewBox = document.getElementById('create-post-attachment-box');
          if (previewLabel) previewLabel.textContent = `🎙️ Áudio gravado com microfone (${durationStr} · ${this.attachedFileData.size})`;
          if (previewBox) previewBox.style.display = 'flex';

          if (btnPreview) {
            btnPreview.style.display = 'inline-flex';
            btnPreview.textContent = '▶️ Ouvir Gravação';
          }
          if (statusText) statusText.textContent = `✅ Áudio-aula gravada (${durationStr})`;
        };
        this.mediaRecorder.start();
      } else {
        // Fallback simulado caso o navegador restrinja microfone em ambiente local
        this._isSimulatedRecording = true;
      }

      if (btnStart) btnStart.style.display = 'none';
      if (btnStop) btnStop.style.display = 'inline-flex';
      if (btnPreview) btnPreview.style.display = 'none';
      if (pulse) pulse.classList.add('recording');
      if (statusText) statusText.textContent = 'A gravar áudio do microfone...';
      if (waveform) waveform.classList.add('active');

      this.recordInterval = setInterval(() => {
        this.recordSeconds++;
        const mins = Math.floor(this.recordSeconds / 60);
        const secs = this.recordSeconds % 60;
        if (timerEl) {
          timerEl.textContent = `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
        }
      }, 1000);

      if (window.Haptic) window.Haptic.medium();
      if (window.Toast) window.Toast.info('🎙️ Gravação iniciada! Fala diretamente ao microfone.', 3000);

    } catch (err) {
      console.warn('[IMPACTA AudioRecorder] Permissão de microfone não autorizada ou indisponível:', err);
      // Fallback didático sem crash
      if (window.Toast) window.Toast.warning('Microfone não acessível. Podes anexar um ficheiro MP3 gravado!', 4000);
      const input = document.getElementById('create-post-file-audio');
      if (input) input.click();
    }
  },

  _stopAudioRecording(discard = false) {
    if (this.recordInterval) {
      clearInterval(this.recordInterval);
      this.recordInterval = null;
    }

    const pulse = document.getElementById('rec-pulse-indicator');
    const waveform = document.getElementById('recorder-waveform');
    const btnStart = document.getElementById('btn-start-record');
    const btnStop = document.getElementById('btn-stop-record');
    const statusText = document.getElementById('recorder-status-text');

    if (pulse) pulse.classList.remove('recording');
    if (waveform) waveform.classList.remove('active');
    if (btnStart) btnStart.style.display = 'inline-flex';
    if (btnStop) btnStop.style.display = 'none';

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach(track => track.stop());
      }
    } else if (this._isSimulatedRecording && !discard) {
      const durationStr = `0:${this.recordSeconds < 10 ? '0' : ''}${Math.max(15, this.recordSeconds)}`;
      this.attachedFileData = {
        name: `Audio_Aula_Exame_${Date.now()}.mp3`,
        size: '180 KB',
        type: 'audio',
        duration: durationStr
      };
      const previewLabel = document.getElementById('attachment-label');
      const previewBox = document.getElementById('create-post-attachment-box');
      if (previewLabel) previewLabel.textContent = `🎙️ Áudio gravado (${durationStr} · 180 KB)`;
      if (previewBox) previewBox.style.display = 'flex';
      if (statusText) statusText.textContent = `✅ Áudio-aula gravada (${durationStr})`;
    }

    if (discard) {
      this.attachedFileData = null;
      if (this.audioPreviewAudio) {
        this.audioPreviewAudio.pause();
        this.audioPreviewAudio = null;
      }
      const previewBox = document.getElementById('create-post-attachment-box');
      if (previewBox) previewBox.style.display = 'none';
      if (statusText) statusText.textContent = 'Pronto para gravar áudio';
      const timerEl = document.getElementById('recorder-timer');
      if (timerEl) timerEl.textContent = '00:00';
    } else {
      if (window.Toast) window.Toast.success('Áudio-aula pronta para publicar! 🎙️');
      if (window.Haptic) window.Haptic.success();
    }
  },

  _previewAudioRecording() {
    if (!this.recordedAudioUrl) {
      if (window.Toast) window.Toast.info('▶️ A reproduzir prévia da gravação...', 2500);
      return;
    }

    if (this.audioPreviewAudio && !this.audioPreviewAudio.paused) {
      this.audioPreviewAudio.pause();
      const btnPreview = document.getElementById('btn-preview-record');
      if (btnPreview) btnPreview.textContent = '▶️ Ouvir Gravação';
    } else {
      this.audioPreviewAudio = new Audio(this.recordedAudioUrl);
      this.audioPreviewAudio.play();
      const btnPreview = document.getElementById('btn-preview-record');
      if (btnPreview) btnPreview.textContent = '⏸️ Pausar Prévia';
      this.audioPreviewAudio.onended = () => {
        if (btnPreview) btnPreview.textContent = '▶️ Ouvir Gravação';
      };
    }
  },

  setMediaType(type, promptFile = false) {
    this.activeMediaType = type;
    const mediaBtns = this.overlay.querySelectorAll('.create-post-media-btn');
    mediaBtns.forEach(b => b.classList.toggle('active', b.dataset.media === type));

    const previewBox = document.getElementById('create-post-attachment-box');
    const previewLabel = document.getElementById('attachment-label');
    const previewIcon = document.getElementById('attachment-icon');
    const ta = document.getElementById('create-post-text');
    const audioRecBox = document.getElementById('create-post-audio-recorder');
    const webpBadge = document.getElementById('create-post-webp-badge');

    if (webpBadge && type !== 'image') webpBadge.style.display = 'none';

    if (!type || type === 'text') {
      this.activeMediaType = null;
      this.attachedFileData = null;
      if (previewBox) previewBox.style.display = 'none';
      if (audioRecBox) audioRecBox.style.display = 'none';
      if (ta) ta.placeholder = 'Qual é a dúvida, reflexão ou dica de estudo para hoje? Usa hashtags para organizar por matéria...';
      return;
    }

    if (audioRecBox) {
      audioRecBox.style.display = (type === 'audio') ? 'block' : 'none';
    }

    if (previewBox && (this.attachedFileData || type !== 'audio')) {
      previewBox.style.display = 'flex';
    } else if (previewBox && type === 'audio' && !this.attachedFileData) {
      previewBox.style.display = 'none';
    }

    if (type === 'image') {
      if (previewIcon) previewIcon.textContent = '📷';
      if (previewLabel) previewLabel.textContent = this.attachedFileData?.name || 'Imagem seleccionada · Toca para escolher uma foto ou imagem';
      if (ta) ta.placeholder = 'Descreve a imagem, o material de estudo ou o esquema...';
    } else if (type === 'video') {
      if (previewIcon) previewIcon.textContent = '🎥';
      if (previewLabel) previewLabel.textContent = this.attachedFileData?.name || 'Vídeo curto de estudo · Toca para escolher um vídeo';
      if (ta) ta.placeholder = 'Partilha uma breve explicação em vídeo ou dica rápida de estudo...';
    } else if (type === 'pdf') {
      if (previewIcon) previewIcon.textContent = '📄';
      if (previewLabel) previewLabel.textContent = this.attachedFileData?.name || 'Material de estudo ou ficheiro de exame (PDF)';
      if (ta) ta.placeholder = 'Descreve este material (ex.: resumo de Cálculo I, UAN 2024)...';
    } else if (type === 'audio') {
      if (previewIcon) previewIcon.textContent = '🎙️';
      if (previewLabel) previewLabel.textContent = this.attachedFileData?.name || 'Áudio-Aula ou Nota de Voz (MP3)';
      if (ta) ta.placeholder = 'Explica brevemente o conteúdo deste áudio gravado...';
    }

    if (promptFile && type !== 'audio') {
      const fileInput = document.getElementById(`create-post-file-${type}`);
      if (fileInput) fileInput.click();
    }
    window.I18n?.applyDOM(this.overlay);
  },

  open(initialType = 'text') {
    this.overlay.classList.add('open');
    document.body.classList.add('modal-open');
    if (window.Haptic) window.Haptic.light();

    if (initialType && initialType !== 'text') {
      this.setMediaType(initialType, false);
    } else {
      this.setMediaType(null);
    }

    setTimeout(() => {
      const ta = document.getElementById('create-post-text');
      if (ta) ta.focus();
    }, 350);
  },

  close() {
    this.overlay.classList.remove('open');
    document.body.classList.remove('modal-open');
    if (window.Haptic) window.Haptic.light();
  },

  _submit() {
    const text = document.getElementById('create-post-text')?.value.trim();
    if (!text && !this.activeMediaType && !this.attachedFileData) {
      if (window.Toast) window.Toast.error('Por favor, escreve algo ou anexa uma publicação!');
      if (window.Haptic) window.Haptic.error();
      return;
    }

    const btn = document.getElementById('create-post-submit');
    const originalText = btn.textContent;
    btn.textContent = 'A publicar na Impacta... ⏳';
    window.I18n?.applyDOM(btn);
    btn.style.opacity = '0.7';
    if (window.Haptic) window.Haptic.medium();

    setTimeout(() => {
      // Cria a nova publicação
      const newPost = {
        id: 'p_new_' + Date.now(),
        userId: 'u0',
        userName: IMPACTA_DATA.currentUser.name,
        userUni: IMPACTA_DATA.currentUser.university || 'Universidade Agostinho Neto',
        userInitials: IMPACTA_DATA.currentUser.initials,
        verified: true,
        time: 'Agora mesmo',
        content: text || (this.activeMediaType === 'image' ? '📸 Imagem partilhada com a comunidade' : (this.activeMediaType === 'audio' ? '🎙️ Áudio-aula rápida partilhada com a turma' : '🎥 Vídeo partilhado com a comunidade')),
        hashtags: (text ? text.match(/#\w+/g) : null) || (this.activeMediaType === 'pdf' ? ['#MaterialDeEstudo', '#UAN'] : (this.activeMediaType === 'audio' ? ['#AudioAula', '#DicaDeEstudo'] : ['#UAN'])),
        mediaType: this.activeMediaType === 'pdf' ? 'pdf' : (this.activeMediaType === 'video' ? 'video' : (this.activeMediaType === 'image' ? 'image' : (this.activeMediaType === 'audio' ? 'audio' : 'none'))),
        mediaDuration: this.activeMediaType === 'audio' ? '0:48' : null,
        document: this.activeMediaType === 'pdf' ? {
          title: this.attachedFileData?.name ? this.attachedFileData.name.replace(/\.[^/.]+$/, '') : (text ? text.slice(0, 45) : 'Material de estudo'),
          subtitle: IMPACTA_DATA.currentUser.university || 'Universidade Agostinho Neto',
          filename: this.attachedFileData?.name || 'Material_Estudo_IMPACTA.pdf',
          pages: 24,
          size: this.attachedFileData?.size || '3.6 MB',
          downloads: 1
        } : null,
        video: this.activeMediaType === 'video' ? {
          title: text ? text.slice(0, 55) : 'Vídeo Educativo / Dica Rápida',
          duration: '0:58',
          quality: '1080p Full HD',
          size: this.attachedFileData?.size || '14.2 MB',
          filename: this.attachedFileData?.name || 'video_aula_impacta.mp4',
          downloads: 1
        } : null,
        mediaUrl: this.activeMediaType === 'image' ? 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80' : null,
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false,
        saved: false,
      };
      IMPACTA_DATA.posts.unshift(newPost);

      this.close();
      const ta = document.getElementById('create-post-text');
      if (ta) ta.value = '';
      this.setMediaType(null);
      btn.textContent = originalText;
      btn.style.opacity = '1';

      if (window.Toast) window.Toast.success('Publicação partilhada com sucesso! 🎉', 4000);
      if (window.Haptic) window.Haptic.success();

      // Re-render feed
      if (window.App && (window.App.currentPage === 'home' || !window.App.currentPage)) {
        const homeContainer = document.getElementById('page-home');
        if (homeContainer) {
          window.App._renderPage('home', homeContainer);
        }
      }
    }, 700);
  },
};

window.CreatePostModal = CreatePostModal;

/* ════════════════════════════════════════════
   PWA INSTALL PROMPT
   ════════════════════════════════════════════ */
const PWAInstall = {
  deferredPrompt: null,
  banner: null,

  init() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      // Show after 3 seconds if not dismissed before
      if (!localStorage.getItem('impacta_install_dismissed')) {
        setTimeout(() => this._showBanner(), 3000);
      }
    });

    window.addEventListener('appinstalled', () => {
      Toast.success('IMPACTA installed! 🎓 Welcome to your learning journey!', 5000);
      Haptic.success();
      this._hideBanner();
    });
  },

  _showBanner() {
    if (this.banner) return;
    this.banner = document.createElement('div');
    this.banner.id = 'pwa-install-banner';
    this.banner.style.cssText = `
      position: fixed;
      bottom: calc(var(--nav-bottom-height, 72px) + 12px + env(safe-area-inset-bottom, 0px));
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      width: calc(100% - 32px);
      max-width: 448px;
      background: rgba(30, 27, 75, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 16px;
      padding: 14px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 500;
      box-shadow: 0 8px 40px rgba(91,75,219,0.4);
      border: 1px solid rgba(255,255,255,0.1);
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    `;
    this.banner.innerHTML = `
      <div style="font-size:28px;flex-shrink:0;">🎓</div>
      <div style="flex:1;">
        <div style="font-size:13px;font-weight:700;color:white;margin-bottom:2px;">Instalar Impacta</div>
        <div style="font-size:11px;color:rgba(255,255,255,0.65);">Adiciona ao ecrã inicial para usares melhor a aplicação</div>
      </div>
      <button id="pwa-install-btn" style="padding:8px 14px;background:white;color:var(--color-primary);border-radius:999px;font-size:12px;font-weight:700;flex-shrink:0;transition:all 0.2s;">Instalar</button>
      <button id="pwa-dismiss-btn" style="color:rgba(255,255,255,0.5);font-size:18px;line-height:1;padding:4px;flex-shrink:0;">×</button>
    `;
    document.body.appendChild(this.banner);
    window.I18n?.applyDOM(this.banner);

    requestAnimationFrame(() => requestAnimationFrame(() => {
      this.banner.style.opacity = '1';
      this.banner.style.transform = 'translateX(-50%) translateY(0)';
    }));

    document.getElementById('pwa-install-btn').addEventListener('click', () => this._triggerInstall());
    document.getElementById('pwa-dismiss-btn').addEventListener('click', () => {
      localStorage.setItem('impacta_install_dismissed', '1');
      this._hideBanner();
    });
  },

  async _triggerInstall() {
    if (!this.deferredPrompt) {
      Toast.info('To install: tap the browser menu → "Add to Home Screen"', 5000);
      return;
    }
    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    this.deferredPrompt = null;
    if (outcome === 'accepted') Haptic.success();
    this._hideBanner();
  },

  _hideBanner() {
    if (!this.banner) return;
    this.banner.style.opacity = '0';
    this.banner.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => { this.banner?.remove(); this.banner = null; }, 400);
  },
};

window.PWAInstall = PWAInstall;

/* ════════════════════════════════════════════
   SHARE (Web Share API)
   ════════════════════════════════════════════ */
async function sharePost(postId) {
  const post = IMPACTA_DATA.posts.find(p => p.id === postId);
  const shareData = {
    title: `IMPACTA – ${post?.userName || 'Educational Post'}`,
    text: post?.content?.slice(0, 100) + '...' || 'Check this out on IMPACTA!',
    url: window.location.href,
  };
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      Haptic.success();
      Toast.success('Shared successfully! 🚀');
    } catch (err) {
      if (err.name !== 'AbortError') Toast.error('Could not share');
    }
  } else {
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareData.url);
      Toast.success('Link copied to clipboard! 📋');
      Haptic.light();
    } catch {
      Toast.info('Share this link: ' + shareData.url, 5000);
    }
  }
}


/* ════════════════════════════════════════════
   SWIPE GESTURES (for Reels)
   ════════════════════════════════════════════ */
const SwipeGesture = {
  init(element, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown) {
    let startX = 0, startY = 0, startTime = 0;

    element.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
    }, { passive: true });

    element.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      const dt = Date.now() - startTime;
      const minSwipe = 50, maxTime = 500;

      if (dt > maxTime) return;

      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        if (Math.abs(dx) < minSwipe) return;
        if (dx < 0 && onSwipeLeft)  onSwipeLeft();
        if (dx > 0 && onSwipeRight) onSwipeRight();
      } else {
        // Vertical swipe
        if (Math.abs(dy) < minSwipe) return;
        if (dy < 0 && onSwipeUp)   onSwipeUp();
        if (dy > 0 && onSwipeDown) onSwipeDown();
      }
    }, { passive: true });
  },
};

window.SwipeGesture = SwipeGesture;

/* ════════════════════════════════════════════
   PULL TO REFRESH
   ════════════════════════════════════════════ */
const PullToRefresh = {
  init(container, onRefresh) {
    let startY = 0, pulling = false, indicator = null;
    const threshold = 80;

    container.addEventListener('touchstart', (e) => {
      if (container.scrollTop === 0) {
        startY = e.touches[0].clientY;
        pulling = true;
      }
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
      if (!pulling) return;
      const dy = e.touches[0].clientY - startY;
      if (dy > 0 && dy < threshold * 1.5) {
        if (!indicator) {
          indicator = document.createElement('div');
          indicator.style.cssText = `
            position: sticky; top: 0; left: 0; right: 0;
            height: 0; display: flex; align-items: center;
            justify-content: center; overflow: hidden;
            transition: height 0.1s; z-index: 10;
            font-size: 20px; color: var(--color-primary);
            background: var(--color-accent-soft);
          `;
          indicator.textContent = '↓';
          container.insertAdjacentElement('afterbegin', indicator);
        }
        const progress = Math.min(dy / threshold, 1);
        indicator.style.height = (dy * 0.4) + 'px';
        indicator.style.opacity = progress;
        indicator.textContent = dy >= threshold ? '↺' : '↓';
      }
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      if (!pulling) return;
      const dy = e.changedTouches[0].clientY - startY;
      pulling = false;
      if (dy >= threshold && indicator) {
        indicator.textContent = '⏳';
        Haptic.medium();
        setTimeout(() => {
          onRefresh?.();
          indicator?.remove();
          indicator = null;
          Toast.success('Content refreshed!');
        }, 800);
      } else {
        indicator?.remove();
        indicator = null;
      }
    }, { passive: true });
  },
};

window.PullToRefresh = PullToRefresh;

/*
   SISTEMA DE DESCARGA / DOWNLOAD ACADÉMICO
   ════════════════════════════════════════════ */
const ImpactaDownload = {
  downloadFile(filename, content, mimeType = 'application/octet-stream') {
    try {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return true;
    } catch (e) {
      console.error('[IMPACTA Download error]', e);
      return false;
    }
  },

  downloadPdf(filename, title, author = 'Kianda Sebastião') {
    const today = new Date().toLocaleDateString('pt-AO', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const watermarkBanner = `========================================================\n[IMPACTA ANGOLA — PLATAFORMA DE APRENDIZAGEM COLABORATIVA]\nMARCA D'ÁGUA DE PROPRIEDADE ACADÉMICA:\nDocumento: ${title || 'Material de estudo'}\nCompilado/Criado por: ${author}\nData de Registo: ${today}\nLicença de Estudo Livre · Respeite os Direitos do Autor\n========================================================\n\n`;

    const dummyPdfContent = `%PDF-1.4\n%IMPACTA - Plataforma Social de Aprendizagem de Angola\n${watermarkBanner}1 0 obj\n<< /Title (${title || 'Material de estudo'}) /Author (${author}) /Subject (Material de estudo em Angola) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF`;

    this.downloadFile(filename || 'material_estudo_impacta.pdf', dummyPdfContent, 'application/pdf');

    // Armazenamento Offline PWA no IndexedDB
    if (window.ImpactaOffline) {
      window.ImpactaOffline.saveApontamento({
        id: filename || 'material_estudo_impacta.pdf',
      title: title || 'Material de estudo',
        author: author,
        filename: filename || 'material_estudo_impacta.pdf',
        size: '4.8 MB',
        pages: 36,
        content: dummyPdfContent
      }).then(() => {
        if (window.Toast) {
          window.Toast.success(`📥 Material de estudo transferido e guardado para consulta sem internet!`, 4500);
        }
      });
    } else {
      if (window.Toast) window.Toast.success(`A descarregar "${filename}" com marca d'água! 📥`, 4000);
    }

    if (window.Haptic) window.Haptic.success();
  },

  downloadVideo(filename, title) {
    const dummyVideo = `IMPACTA Educational Video\nTitle: ${title || 'Aula Curta'}\nResolution: 1080p Full HD\nFormat: MP4\nPropriedade Académica IMPACTA Angola`;
    this.downloadFile(filename || 'video_aula_impacta.mp4', dummyVideo, 'video/mp4');
    if (window.Toast) window.Toast.success(`Vídeo "${title || filename}" a ser transferido! 🎥`, 4000);
    if (window.Haptic) window.Haptic.success();
  },

  downloadImage(filename) {
    const dummyImg = `IMPACTA Diagram / Visual Study Resource - Direitos Reservados`;
    this.downloadFile(filename || 'diagrama_estudo.jpg', dummyImg, 'image/jpeg');
    if (window.Toast) window.Toast.success(`Imagem "${filename}" transferida! 📸`, 3500);
    if (window.Haptic) window.Haptic.success();
  },

  downloadAudio(filename) {
    const dummyAudio = `IMPACTA Audio Lesson Recording - Resolução e Dicas de Provas`;
    this.downloadFile(filename || 'audio_aula.mp3', dummyAudio, 'audio/mpeg');
    if (window.Toast) window.Toast.success(`Áudio-aula "${filename}" transferida! 🎙️`, 3500);
    if (window.Haptic) window.Haptic.success();
  },
};

window.ImpactaDownload = ImpactaDownload;

/* ════════════════════════════════════════════
   MODAL PARA LER FICHEIROS PDF (com zoom e marca de água)
   ════════════════════════════════════════════ */
const DocPreviewModal = {
  overlay: null,
  currentPage: 1,
  totalPages: 36,
  zoomLevel: 100,

  pagesData: [
    {
      num: 1,
      headerLeft: 'UCAN · FACULDADE DE ECONOMIA E GESTÃO',
      headerRight: 'EXAMES NACIONAIS 2023–2025',
      title: '1. EXAME NACIONAL DE MACROECONOMIA (2024)',
      bodyHtml: `
        <p><strong>Exercício 1.1:</strong> Considere uma economia aberta com taxa de câmbio Kz/USD. Calcule o multiplicador keynesiano de gastos públicos considerando a propensão marginal a poupar de 0,25 e a propensão a importar de 0,15.</p>
        <div class="doc-math-box">
          <em>k = 1 / (1 - c(1 - t) + m) = 1 / (0,25 + 0,15) = 2,50</em>
        </div>
        <p><strong>Resolução Detalhada:</strong> O acréscimo de despesa do Estado de 10.000.000 Kz provocará uma expansão no rendimento de equilíbrio de 25.000.000 Kz no mercado angolano.</p>
      `
    },
    {
      num: 2,
      headerLeft: 'UCAN · TEORIA MONETÁRIA E FINANCEIRA',
      headerRight: 'SISTEMA BANCÁRIO ANGOLANO',
      title: '2. POLÍTICA MONETÁRIA DO BNA E TAXAS DE JURO',
      bodyHtml: `
        <p><strong>Exercício 2.1:</strong> Analise o impacto da variação da taxa BNA sobre o crédito bancário e o índice de preços ao consumidor (IPC) na província de Luanda.</p>
        <div class="doc-math-box">
          <em>M · V = P · Y &nbsp;➔&nbsp; Variação da Liquidez e Controlo da Inflação</em>
        </div>
        <p><strong>Nota Prática do Exame:</strong> Quando o BNA ajusta os coeficientes de reservas obrigatórias, a criação de moeda escritural pelos bancos comerciais diminui proporcionalmente.</p>
      `
    },
    {
      num: 3,
      headerLeft: 'UCAN · ANÁLISE DE INVESTIMENTOS',
      headerRight: 'CRITÉRIOS DE AVALIAÇÃO DE PROJETOS',
      title: '3. CÁLCULO DE VAL (VALOR ATUAL LÍQUIDO) E TIR',
      bodyHtml: `
        <p><strong>Exercício 3.1:</strong> Um projeto agroindustrial no Huambo requer um investimento inicial de 45.000.000 Kz com cash flows anuais esperados de 18.000.000 Kz durante 4 anos à taxa de atualização de 14%.</p>
        <div class="doc-math-box">
          <em>VAL = -I₀ + Σ [ CFₜ / (1 + r)ᵗ ] = +7.452.120 Kz (Projeto Viável)</em>
        </div>
        <p><strong>Conclusão Recomendada para a Prova:</strong> Dado que o VAL > 0 e a TIR (21,8%) é superior ao custo de capital, o projeto gera valor e deve ser aprovado pela banca comercial.</p>
      `
    }
  ],

  init() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    this.overlay.id = 'doc-preview-modal';
    this.overlay.innerHTML = `
      <div class="bottom-sheet doc-preview-sheet" style="max-height:94dvh; display:flex; flex-direction:column;">
        <div class="bottom-sheet__handle"></div>
        <div class="doc-preview-header">
          <div class="doc-preview-title-wrap">
            <span class="doc-preview-tag">📶 LEITOR NATIVO · DISPONÍVEL OFFLINE</span>
            <h2 id="doc-preview-modal-title" class="doc-preview-modal-title">Resoluções dos Exames 2023–2025</h2>
          </div>
          <button id="doc-preview-close" class="filter-panel__close" aria-label="Fechar">${ICONS.close}</button>
        </div>

        <!-- Barra de Ferramentas: Zoom e Paginação -->
        <div class="doc-reader-toolbar">
          <div class="doc-zoom-controls">
            <button type="button" id="doc-zoom-out" class="doc-tool-btn" title="Diminuir Zoom">🔍 -</button>
            <span id="doc-zoom-val" class="doc-zoom-val">100%</span>
            <button type="button" id="doc-zoom-in" class="doc-tool-btn" title="Aumentar Zoom">🔍 +</button>
            <button type="button" id="doc-zoom-reset" class="doc-tool-btn" title="Repor Zoom">1:1</button>
          </div>

          <div class="doc-page-controls">
            <button type="button" id="doc-prev-page" class="doc-page-btn" aria-label="Página anterior">◀ Anterior</button>
            <span class="doc-page-indicator">Página <strong id="doc-current-page-num">1</strong> de 36</span>
            <button type="button" id="doc-next-page" class="doc-page-btn" aria-label="Página seguinte">Seguinte ▶</button>
          </div>
        </div>

        <div class="doc-preview-body" id="doc-preview-body-container">
          <div class="doc-preview-page" id="doc-preview-page-canvas">
            <div class="doc-page-header">
              <span id="doc-page-header-left">UCAN · FACULDADE DE ECONOMIA E GESTÃO</span>
              <span id="doc-page-header-right">EXAMES NACIONAIS 2023–2025</span>
            </div>
            <div class="doc-page-content" id="doc-page-dynamic-content">
              <h4>1. EXAME NACIONAL DE MACROECONOMIA (2024)</h4>
              <p><strong>Exercício 1.1:</strong> Considere uma economia aberta com taxa de câmbio Kz/USD. Calcule o multiplicador keynesiano de gastos públicos considerando a propensão marginal a poupar de 0,25 e a propensão a importar de 0,15.</p>
              <div class="doc-math-box">
                <em>k = 1 / (1 - c(1 - t) + m) = 1 / (0,25 + 0,15) = 2,50</em>
              </div>
              <p><strong>Resolução Detalhada:</strong> O acréscimo de despesa do Estado de 10.000.000 Kz provocará uma expansão no rendimento de equilíbrio de 25.000.000 Kz no mercado angolano.</p>
            </div>

            <!-- Marca d'Água de Propriedade Acadêmica -->
            <div class="doc-page-watermark" id="doc-page-watermark">
              🛡️ Propriedade Académica de Kianda Sebastião · Registado no IMPACTA Angola · Cópia Certificada
            </div>
          </div>
        </div>

        <div class="doc-preview-footer">
          <button id="doc-preview-download-btn" class="btn btn--primary btn--full btn--lg">
            ${ICONS.download}
            <span>Transferir ficheiro PDF e guardar sem internet (4,8 MB)</span>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(this.overlay);

    // Eventos
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
    document.getElementById('doc-preview-close').addEventListener('click', () => this.close());
    document.getElementById('doc-preview-download-btn').addEventListener('click', () => {
      const title = document.getElementById('doc-preview-modal-title')?.textContent || 'Material de estudo';
      ImpactaDownload.downloadPdf('Resolucoes_Economia_2023-2025_UCAN.pdf', title, 'Kianda Sebastião');
      this.close();
    });

    // Zoom Controls
    document.getElementById('doc-zoom-in')?.addEventListener('click', () => this.adjustZoom(15));
    document.getElementById('doc-zoom-out')?.addEventListener('click', () => this.adjustZoom(-15));
    document.getElementById('doc-zoom-reset')?.addEventListener('click', () => this.setZoom(100));

    // Page Controls
    document.getElementById('doc-prev-page')?.addEventListener('click', () => this.prevPage());
    document.getElementById('doc-next-page')?.addEventListener('click', () => this.nextPage());
  },

  adjustZoom(delta) {
    this.setZoom(Math.max(60, Math.min(200, this.zoomLevel + delta)));
  },

  setZoom(val) {
    this.zoomLevel = val;
    const canvas = document.getElementById('doc-preview-page-canvas');
    const valEl = document.getElementById('doc-zoom-val');
    if (canvas) {
      canvas.style.transform = `scale(${val / 100})`;
      canvas.style.transformOrigin = 'top center';
    }
    if (valEl) valEl.textContent = `${val}%`;
    if (window.Haptic) window.Haptic.light();
  },

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this._renderCurrentPage();
    }
  },

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this._renderCurrentPage();
    }
  },

  _renderCurrentPage() {
    const numEl = document.getElementById('doc-current-page-num');
    if (numEl) numEl.textContent = this.currentPage;

    const pageIndex = (this.currentPage - 1) % this.pagesData.length;
    const data = this.pagesData[pageIndex];

    const hLeft = document.getElementById('doc-page-header-left');
    const hRight = document.getElementById('doc-page-header-right');
    const content = document.getElementById('doc-page-dynamic-content');
    const watermark = document.getElementById('doc-page-watermark');

    if (hLeft) hLeft.textContent = data.headerLeft;
    if (hRight) hRight.textContent = data.headerRight;
    if (content) {
      content.innerHTML = `<h4>${data.title}</h4>${data.bodyHtml}`;
    }
    if (watermark) {
      watermark.textContent = `🛡️ Página ${this.currentPage} de 36 · Propriedade de Kianda Sebastião · IMPACTA Angola`;
    }

    if (window.Haptic) window.Haptic.light();
  },

  open(title) {
    window.I18n?.applyDOM(this.overlay);
    if (title) {
      const el = document.getElementById('doc-preview-modal-title');
      if (el) el.textContent = title;
    }
    this.currentPage = 1;
    this.setZoom(100);
    this._renderCurrentPage();

    this.overlay.classList.add('open');
    document.body.classList.add('modal-open');
    if (window.Haptic) window.Haptic.light();
  },

  close() {
    this.overlay.classList.remove('open');
    document.body.classList.remove('modal-open');
    if (window.Haptic) window.Haptic.light();
  },
};

/* ════════════════════════════════════════════
   EXPORTO GLOBAIS NO WINDOW
   ════════════════════════════════════════════ */
window.Toast = Toast;
window.Haptic = Haptic;
window.CommentModal = CommentModal;
window.CreatePostModal = CreatePostModal;
window.DocPreviewModal = DocPreviewModal;
window.ImpactaDownload = ImpactaDownload;
window.PWAInstall = PWAInstall;
window.sharePost = sharePost;

/* ════════════════════════════════════════════
   INIT ALL
   ════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  Toast.init();
  CommentModal.init();
  CreatePostModal.init();
  DocPreviewModal.init();
  PWAInstall.init();
});
