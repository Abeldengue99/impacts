/* ============================================================
   IMPACTA â€” Service Worker (PWA Offline Support)
   Version: 1.0.0
   ============================================================ */

const CACHE_NAME    = 'impacta-v2.3.1';
const STATIC_ASSETS = [
  '/Impactaa/frontend/pages/index.html',
  '/Impactaa/frontend/pages/login.html',
  '/Impactaa/frontend/pages/signup.html',
  '/Impactaa/frontend/assets/css/variables.css',
  '/Impactaa/frontend/assets/css/base.css',
  '/Impactaa/frontend/assets/css/layout.css',
  '/Impactaa/frontend/assets/css/components.css',
  '/Impactaa/frontend/assets/css/responsive.css',
  '/Impactaa/frontend/assets/css/visual-refresh.css?v=2.3.1',
  '/Impactaa/frontend/assets/css/auth.css?v=2.3.0',
  '/Impactaa/frontend/assets/images/auth-learning.svg',
  '/Impactaa/frontend/assets/js/data.js',
  '/Impactaa/frontend/assets/js/admin-feed-preview.js?v=2.3.1',
  '/Impactaa/frontend/assets/js/offline-storage.js',
  '/Impactaa/frontend/assets/js/app.js?v=2.3.0',
  '/Impactaa/frontend/assets/js/i18n.js',
  '/Impactaa/frontend/assets/js/i18n-overrides.js?v=2.3.1',
  '/Impactaa/frontend/assets/js/auth-pages.js?v=2.3.0',
  '/Impactaa/frontend/assets/js/feed.js?v=2.3.1',
  '/Impactaa/frontend/assets/js/reels.js',
  '/Impactaa/frontend/assets/js/discover.js',
  '/Impactaa/frontend/assets/js/communities.js',
  '/Impactaa/frontend/assets/js/users.js',
  '/Impactaa/frontend/assets/js/inbox.js',
  '/Impactaa/frontend/assets/js/profile.js?v=2.3.1',
  '/Impactaa/frontend/assets/js/search.js',
  '/Impactaa/frontend/assets/js/interactions.js',
  '/Impactaa/frontend/public/icons/impacta-logo.svg',
  '/Impactaa/frontend/public/icons/impacta-mark.svg',
  '/Impactaa/frontend/public/manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
];

// â”€â”€ Install: pre-cache all static assets â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cache what we can, ignore failures for external resources
      return Promise.allSettled(
        STATIC_ASSETS.map(url => cache.add(url).catch(() => {}))
      );
    }).then(() => self.skipWaiting())
  );
});

// â”€â”€ Activate: clean old caches â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// â”€â”€ Fetch: Cache-first for assets, Network-first for pages â”€â”€
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension, etc.
  if (!url.protocol.startsWith('http')) return;

  // For HTML pages â€” Network first, fallback to cache
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // For CSS, JS, images â€” Cache first, fallback to network
  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        return response;
      }).catch(() => {
        // Return offline placeholder for images
        if (request.destination === 'image') {
          return new Response('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="#EDE9FF" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="#5B4BDB" font-size="30">ðŸ“–</text></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } });
        }
      });
    })
  );
});

// â”€â”€ Push notifications (future) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'IMPACTA', {
      body: data.body || 'New educational content available!',
      icon: '/Impactaa/frontend/public/icons/impacta-mark.svg',
      badge: '/Impactaa/frontend/public/icons/impacta-mark.svg',
      tag: data.tag || 'impacta-notification',
      data: { url: data.url || '/Impactaa/frontend/pages/index.html' },
      vibrate: [100, 50, 100],
      actions: [
        { action: 'open',    title: 'Open' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;
  const url = event.notification.data?.url || '/Impactaa/frontend/pages/index.html';
  event.waitUntil(clients.openWindow(url));
});



