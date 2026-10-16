const CACHE = "almiftah-v3";
const DATA = "almiftah-data"; // অফলাইন ডাউনলোড করা কুরআন-হাদিস, এটা কখনো মোছা হয় না
const CORE = ["./", "./index.html", "./offline.js", "./manifest.json", "./icon-192.png", "./icon-512.png"];
const KEEP = [
  "fonts.googleapis.com",
  "fonts.gstatic.com",
  "api.alquran.cloud",
  "cdn.jsdelivr.net",
  "raw.githubusercontent.com"
];
const HRE = /\/editions\/([a-z]{3}-[a-z0-9]+)\/(\d+)(?:\.min)?\.json$/;
const FULL = {};

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== DATA).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// ডাউনলোড করা পূর্ণ সংকলন থেকে একটি হাদিস বের করে দেয়
async function hadithFromFull(url) {
  const m = url.pathname.match(HRE);
  if (!m) return null;
  const ed = m[1], n = m[2];
  if (!FULL[ed]) {
    const re = new RegExp("/editions/" + ed + "(\\.min)?\\.json$");
    let found = null;
    for (const name of [DATA, CACHE]) {
      const c = await caches.open(name);
      const keys = await c.keys();
      const k = keys.find(r => re.test(new URL(r.url).pathname));
      if (k) { found = await c.match(k); break; }
    }
    if (!found) return null;
    const j = await found.json();
    const map = new Map();
    (j.hadiths || []).forEach(h => map.set(String(h.hadithnumber), h));
    FULL[ed] = map;
  }
  const h = FULL[ed].get(n);
  if (!h) return null;
  return new Response(JSON.stringify(Object.assign({}, h, { hadiths: [h] })), {
    headers: { "Content-Type": "application/json" }
  });
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then(r => r || caches.match("./index.html")))
    );
    return;
  }

  if (KEEP.includes(url.hostname)) {
    e.respondWith((async () => {
      const hit = await caches.match(req);
      if (hit) return hit;
      try {
        const res = await fetch(req);
        if (res && (res.ok || res.type === "opaque")) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      } catch (err) {
        const h = await hadithFromFull(url);
        return h || Response.error();
      }
    })());
  }
});
