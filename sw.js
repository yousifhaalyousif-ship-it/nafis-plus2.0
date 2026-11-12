const CACHE='nafis-plus-v9-static-3';
const BASE=new URL('./',self.registration.scope).href;
const CORE=['./','./index.html','./online.css','./online.js','./data.js','./install.js','./paper.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('nafis-plus-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
 const req=e.request;
 if(req.mode==='navigate'){
  e.respondWith(fetch(req).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE).then(cache=>cache.put(req,c))}return r}).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));
 }else {
  e.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(resp=>{if(resp.ok){const x=resp.clone();caches.open(CACHE).then(c=>c.put(req,x))}return resp})));
 }
});
