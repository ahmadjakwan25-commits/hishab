/* আল-মিফতাহ: অ্যাপ খোলার সাথে সাথে খোলার জন্য দ্রুত সার্ভিস ওয়ার্কার
   নিয়ম: আগে ফোনের ভেতরের কপি দেখাও, নেট থাকলে গোপনে নতুন কপি এনে রাখো (পরের বার নতুনটা দেখাবে)। */
var V = 'mf-fast-v3';
var CORE = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'offline.js', 'mushaf.js', 'hafezi.js', 'pdfread.js', 'share.js', 'readpages.js', 'tiro-bangla.woff','hind-Regular.woff','hind-Medium.woff','hind-SemiBold.woff','hind-Bold.woff', 'tiro-bangla-italic.woff'];
self.addEventListener('install', function(e){
  self.skipWaiting();
  e.waitUntil(caches.open(V).then(function(c){
    return Promise.all(CORE.map(function(u){ return c.add(new Request(u, { cache: 'reload' })).catch(function(){}); }));
  }));
});
/* পুরোনো ক্যাশ মোছা হয় না — আগে সেভ করা অফলাইন ডেটা নিরাপদ থাকে */
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });
function keyOf(r, u){ return r.mode === 'navigate' ? new Request('index.html') : (u.search ? null : r); }
async function find(r, u){
  var c = await caches.open(V), k = keyOf(r, u), hit = null;
  if (k) hit = await c.match(k);
  if (!hit) hit = await caches.match(r.mode === 'navigate' ? 'index.html' : r, { ignoreSearch: !!u.search || r.mode === 'navigate' });
  if (!hit && r.mode === 'navigate') hit = await caches.match('./');
  return hit;
}
function store(r, u, res){
  if (!res || res.status !== 200 || res.type === 'opaque') return;
  var k = keyOf(r, u); if (!k) return;
  var cp = res.clone();
  caches.open(V).then(function(c){ return c.put(k, cp); }).catch(function(){});
}
self.addEventListener('fetch', function(e){
  var r = e.request; if (r.method !== 'GET' || r.headers.has('range')) return;
  var u = new URL(r.url); if (u.origin !== location.origin) return;
  if (/\/content\.json$/.test(u.pathname)) {
    e.respondWith(new Promise(function(done){
      var fin = false, t = setTimeout(function(){ find(r, u).then(function(h){ if (!fin && h) { fin = true; done(h); } }); }, 3500);
      fetch(r).then(function(res){ clearTimeout(t); if (!fin) { fin = true; done(res); } }, function(){ clearTimeout(t); find(r, u).then(function(h){ if (!fin) { fin = true; done(h || Response.error()); } }); });
    }));
    return;
  }
  e.respondWith((async function(){
    var hit = await find(r, u);
    var net = fetch(r.mode === 'navigate' ? new Request('index.html', { cache: 'no-cache' }) : new Request(r, { cache: 'no-cache' })).then(function(res){ store(r, u, res); return res; });
    if (hit) { e.waitUntil(net.catch(function(){})); return hit; }
    try { return await net; } catch(err) { return (await find(r, u)) || Response.error(); }
  })());
});
