/* ============================================================
   IMPACTA — Acesso offline a materiais de estudo (IndexedDB)
   Permite guardar e consultar materiais de estudo sem gastar dados móveis.
   ============================================================ */

const ImpactaOffline = {
  dbName: 'impacta_offline_apontamentos_db',
  dbVersion: 1,
  storeName: 'apontamentos',
  db: null,

  async init() {
    if (!('indexedDB' in window)) {
      console.warn('[IMPACTA Offline] IndexedDB não suportado neste navegador.');
      return false;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('title', 'title', { unique: false });
          store.createIndex('savedAt', 'savedAt', { unique: false });
        }
      };

      request.onsuccess = (e) => {
        this.db = e.target.result;
        console.log('[IMPACTA Offline] IndexedDB inicializado com sucesso.');
        resolve(true);
      };

      request.onerror = (e) => {
        console.error('[IMPACTA Offline] Erro ao abrir IndexedDB:', e.target.error);
        resolve(false);
      };
    });
  },

  async saveApontamento(apontamento) {
    if (!this.db) await this.init();
    if (!this.db) return false;

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        const record = {
          id: apontamento.id || apontamento.filename || `apontamento_${Date.now()}`,
          title: apontamento.title || 'Material de estudo',
          author: apontamento.author || 'Estudante IMPACTA',
          filename: apontamento.filename || 'apontamento.pdf',
          size: apontamento.size || '4.8 MB',
          pages: apontamento.pages || 36,
          content: apontamento.content || null,
          savedAt: new Date().toISOString(),
          watermark: `Propriedade Académica de ${apontamento.author || 'IMPACTA Angola'} • Protegido por Direitos Autorais`,
        };

        const req = store.put(record);
        req.onsuccess = () => {
          console.log(`[IMPACTA Offline] Material "${record.title}" guardado para acesso sem internet.`);
          resolve(true);
        };
        req.onerror = () => resolve(false);
      } catch (err) {
        console.error('[IMPACTA Offline] Erro ao guardar material de estudo:', err);
        resolve(false);
      }
    });
  },

  async isApontamentosaved(id) {
    if (!this.db) await this.init();
    if (!this.db) return false;

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction(this.storeName, 'readonly');
        const store = tx.objectStore(this.storeName);
        const req = store.get(id);
        req.onsuccess = () => resolve(!!req.result);
        req.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  },

  async listSaved() {
    if (!this.db) await this.init();
    if (!this.db) return [];

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction(this.storeName, 'readonly');
        const store = tx.objectStore(this.storeName);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      } catch (e) {
        resolve([]);
      }
    });
  },

  async deleteApontamento(id) {
    if (!this.db) await this.init();
    if (!this.db) return false;

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        const req = store.delete(id);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  }
};

window.ImpactaOffline = ImpactaOffline;
document.addEventListener('DOMContentLoaded', () => {
  ImpactaOffline.init();
});

