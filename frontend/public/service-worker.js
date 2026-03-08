// PWA
// Tutorial de como fazer (caso for usar a PWA): 
// 1 - Descomentar parte comentada com PWA em index.js, index.html e manifest.json(caso esteja comentado)
// 2 - Rodar no terminal "npm run build"
// 3 - Ligar o Servidor com "npx serve -s build"

// const CACHE_NAME = "podsmath-v1";

// const urlsToCache = [
//     "/",
//     "/index.html",
//     "/manifest.json"
// ];

// self.addEventListener("install", (event) => {
//     event.waitUntil(
//         caches.open(CACHE_NAME).then((cache) => {
//             return cache.addAll(urlsToCache);
//         })
//     );

//     self.skipWaiting();
// });

// self.addEventListener("activate", (event) => {
//     console.log("Service Worker ativo");
// });

// self.addEventListener("fetch", (event) => {
//     event.respondWith(
//         caches.match(event.request).then((response) => {
//             return response || fetch(event.request);
//         })
//     );
// });