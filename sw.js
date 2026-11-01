const CACHE_NAME="grand-line-classroom-v2";
const CORE_FILES=["./","./index.html","./styles.css","./app.js","./manifest.json","./icon.svg","./icon-192.png","./icon-512.png"];
const MUSIC_FILE="./grand-line-theme.mp3";
self.addEventListener("install",event=>{event.waitUntil((async()=>{const cache=await caches.open(CACHE_NAME);await cache.addAll(CORE_FILES);try{await cache.add(MUSIC_FILE);}catch(e){/* Large audio files may exceed a device's offline cache quota. */}})());self.skipWaiting();});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))));self.clients.claim();});
self.addEventListener("fetch",event=>{if(event.request.method!=="GET")return;event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{if(response&&response.status===200&&new URL(event.request.url).origin===self.location.origin){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));}return response;}).catch(()=>caches.match("./index.html"))));});
