// Service Worker для DinoStyle
const CACHE_NAME = 'dinostyle-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/foto/Элегантное_платье_для_Брахиозавра.jpg',
    '/foto/Спортивный костюм для T-Rex.png',
    '/foto/Украшения из костей.png',
    '/foto/Кроссовки для Велоцираптора.png',
    '/foto/Королевская мантия для Трицератопса.png',
    '/foto/Теплая куртка для Диплодока.png',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Кэш открыт');
                return cache.addAll(urlsToCache);
            })
    );
});

// Перехват запросов
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Возвращаем кэшированную версию или загружаем с сети
                if (response) {
                    return response;
                }
                
                return fetch(event.request).then((response) => {
                    // Проверяем валидность ответа
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // Клонируем ответ для кэширования
                    const responseToCache = response.clone();
                    
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                });
            })
    );
});

// Обновление Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Удаляем старый кэш:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
}); 