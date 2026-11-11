/* ============================================================
   IMPACTA — Modo Offline PWA para Sebentas (IndexedDB)
   Permite armazenar e folhear sebentas sem gastar dados móveis.
   ============================================================ */

const ImpactaOffline = {
  dbName: 'impacta_offline_sebentas_db',
  dbVersion: 1,
  storeName: 'sebentas',
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

  async saveSebenta(sebenta) {
    if (!this.db) await this.init();
    if (!this.db) return false;

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        const record = {
          id: sebenta.id || sebenta.filename || `sebenta_${Date.now()}`,
          title: sebenta.title || 'Sebenta Académica',
          author: sebenta.author || 'Estudante IMPACTA',
          filename: sebenta.filename || 'sebenta.pdf',
          size: sebenta.size || '4.8 MB',
          pages: sebenta.pages || 36,
          content: sebenta.content || null,
          savedAt: new Date().toISOString(),
          watermark: `Propriedade Académica de ${sebenta.author || 'IMPACTA Angola'} • Protegido por Direitos Autorais`,
        };

        const req = store.put(record);
        req.onsuccess = () => {
          console.log(`[IMPACTA Offline] Sebenta "${record.title}" guardada para acesso sem internet.`);
          resolve(true);
        };
        req.onerror = () => resolve(false);
      } catch (err) {
        console.error('[IMPACTA Offline] Erro ao salvar sebenta:', err);
        resolve(false);
      }
    });
  },

  async isSebentaSaved(id) {
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

  async deleteSebenta(id) {
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

