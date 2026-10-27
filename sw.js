const CACHE = "almiftah-v6";
const DATA = "almiftah-data"; // অফলাইন ডাউনলোড করা কুরআন-হাদিস, এটা কখনো মোছা হয় না
const CORE = ["./", "./index.html", "./offline.js", "./mushaf.js", "./hafezi.js", "./pdfread.js", "./share.js", "./readpages.js", "./manifest.json", "./icon-192.png", "./icon-512.png"];
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
  // একটি ফাইল না পেলেও বাকিগুলো জমা হবে
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(CORE.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
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
  // PDF ক্যাশে রাখা হয় না: ডাউনলোড করা কিতাব অ্যাপের নিজস্ব স্টোরেজে একবারই জমা থাকে
  if (/\.pdf$/i.test(url.pathname)) return;

  if (url.origin === location.origin) {
    // content.json: নেট থেকে আনার চেষ্টা (৬ সেকেন্ড), না হলে জমা করা কপি। একটি নামেই জমা রাখে।
    if (/\/content\.json$/i.test(url.pathname)) {
      e.respondWith((async () => {
        const key = location.origin + url.pathname;
        try {
          const ctl = new AbortController();
          const t = setTimeout(() => ctl.abort(), 6000);
          const res = await fetch(req, { signal: ctl.signal });
          clearTimeout(t);
          if (res && res.ok) {
            const copy = res.clone(), copy2 = res.clone();
            caches.open(CACHE).then(c => c.put(key, copy)).catch(() => {});
            // অফলাইন ডাউনলোডে আগে রাখা পুরোনো কপি থাকলে সেটাও নতুন করে দেয়
            caches.open(DATA).then(async d => { if (await d.match(key)) d.put(key, copy2); }).catch(() => {});
            return res;
          }
        } catch (err) {}
        // আগে নতুন জমা কপি, তারপর অফলাইন-ডাউনলোডের কপি
        const own = await caches.open(CACHE);
        const dat = await caches.open(DATA);
        return (await own.match(key)) || (await dat.match(key)) || Response.error();
      })());
      return;
    }
    // অ্যাপের ফাইল: আগে জমা কপি থেকে সাথে সাথে খোলে, পেছনে নতুন সংস্করণ এনে রাখে (পরের বার কাজে লাগে)
    e.respondWith((async () => {
      const c = await caches.open(CACHE);
      const hit = (await c.match(req, { ignoreSearch: true })) || (await caches.match(req, { ignoreSearch: true }));
      const net = fetch(req).then(res => {
        if (res && res.ok && res.status === 200) c.put(req, res.clone()).catch(() => {});
        return res;
      }).catch(() => null);
      if (hit) { e.waitUntil(net); return hit; }
      const res = await net;
      if (res) return res;
      return req.mode === "navigate" ? ((await c.match("./index.html")) || Response.error()) : Response.error();
    })());
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
