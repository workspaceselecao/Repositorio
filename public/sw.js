const CACHE_NAME = 'repositorio-vagas-v1'
const urlsToCache = [
  '/',
  '/vagas',
  '/comparativo',
  '/configuracoes',
  '/login',
  '/manifest.json',
  // Adicionar outros recursos estáticos conforme necessário
]

// Install event - cache recursos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto')
        return cache.addAll(urlsToCache)
      })
  )
})

// Fetch event - servir do cache quando offline
self.addEventListener('fetch', (event) => {
  // Apenas cache GET requests
  if (event.request.method !== 'GET') {
    return
  }

  // Ignorar requests para APIs externas
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - retorna a resposta
        if (response) {
          return response
        }

        return fetch(event.request).then((response) => {
          // Verifica se recebemos uma resposta válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }

          // Clone a resposta
          const responseToCache = response.clone()

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache)
            })

          return response
        })
      })
      .catch(() => {
        // Se falhar, retorna página offline para navegação
        if (event.request.destination === 'document') {
          return caches.match('/')
        }
      })
  )
})

// Activate event - limpar caches antigos
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME]

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Removendo cache antigo:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Background sync para dados quando voltar online
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Sincronização em background executada')
    // Implementar sincronização de dados offline aqui
  }
})

// Push notifications (futuro)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2'
      },
      actions: [
        {
          action: 'explore',
          title: 'Ver detalhes',
          icon: '/icons/icon-192x192.png'
        },
        {
          action: 'close',
          title: 'Fechar',
          icon: '/icons/icon-192x192.png'
        }
      ]
    }

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'explore') {
    // Abrir a aplicação
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})