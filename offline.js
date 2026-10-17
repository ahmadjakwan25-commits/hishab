(function () {
  var QAPI = "https://api.alquran.cloud/v1/";
  var HB = [
    "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/",
    "https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/"
  ];
  var DATA = "almiftah-data";
  var NAMES = {
    bukhari: "সহীহ বুখারী", muslim: "সহীহ মুসলিম", abudawud: "সুনান আবু দাউদ",
    tirmidhi: "জামে তিরমিযী", nasai: "সুনান নাসায়ী", ibnmajah: "সুনান ইবনু মাজাহ",
    malik: "মুওয়াত্তা মালিক", nawawi: "আরবাঈন নববী",
    riyadussalihin: "রিয়াদুস সালিহীন", dehlawi: "আরবাঈন দেহলভী"
  };
  var cancel = false, busy = false;

  function el(t, css, html) {
    var e = document.createElement(t);
    if (css) e.style.cssText = css;
    if (html) e.innerHTML = html;
    return e;
  }

  var btn = el("button",
    "position:fixed;right:12px;bottom:92px;z-index:9998;width:46px;height:46px;border-radius:50%;" +
    "border:0;background:#17603c;color:#fff;font-size:22px;box-shadow:0 2px 8px rgba(0,0,0,.3);cursor:pointer",
    "⬇");
  btn.setAttribute("aria-label", "অফলাইন ডাউনলোড");

  var ov = el("div",
    "position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.55);display:none;align-items:center;justify-content:center;padding:14px");
  var box = el("div",
    "background:var(--card,#fff);color:var(--ink,#14261c);border-radius:16px;max-width:460px;width:100%;" +
    "max-height:88vh;overflow:auto;padding:16px;font-family:inherit;font-size:15px;line-height:1.5");
  ov.appendChild(box);

  box.innerHTML =
    '<h3 style="margin:0 0 6px">অফলাইনের জন্য ডাউনলোড</h3>' +
    '<p style="margin:0 0 10px;color:var(--mut,#5d7066);font-size:13px">ওয়াইফাই বা ভালো নেট চালু রেখে একবার ডাউনলোড করুন। এরপর ইন্টারনেট ছাড়াই চলবে।</p>' +
    '<label style="display:flex;gap:8px;align-items:center;margin:8px 0"><input type="checkbox" id="of-q" checked> সম্পূর্ণ কুরআন (আরবি + বাংলা)</label>' +
    '<label style="display:flex;gap:8px;align-items:center;margin:8px 0"><input type="checkbox" id="of-p" checked> আমার যোগ করা PDF ও ফাইল (কুরআন/হাদিস/দোয়ার PDF-লিংক পাতা)</label>' +
    '<div style="margin:8px 0 4px"><b>হাদিস</b> <small id="of-hs" style="color:var(--mut,#5d7066)">সংকলনের তালিকা আনা হচ্ছে…</small></div>' +
    '<div id="of-hl"></div>' +
    '<div style="height:10px;background:var(--line,#dbe5de);border-radius:6px;margin:12px 0 4px;overflow:hidden"><div id="of-bar" style="height:100%;width:0;background:#1f7a4d"></div></div>' +
    '<div id="of-st" style="font-size:13px;color:var(--mut,#5d7066);min-height:20px"></div>' +
    '<div style="display:flex;gap:8px;margin-top:12px">' +
    '<button id="of-go" style="flex:1;padding:11px;border:0;border-radius:10px;background:#17603c;color:#fff;font:inherit;cursor:pointer">ডাউনলোড শুরু</button>' +
    '<button id="of-x" style="padding:11px 16px;border:1px solid var(--line,#dbe5de);border-radius:10px;background:transparent;color:inherit;font:inherit;cursor:pointer">বন্ধ</button>' +
    '</div>';

  function q(id) { return box.querySelector("#" + id); }
  function status(t) { q("of-st").textContent = t; }
  function bar(p) { q("of-bar").style.width = Math.round(p * 100) + "%"; }

  function jget(urls) {
    var i = 0;
    return new Promise(function (res, rej) {
      (function nx() {
        if (i >= urls.length) return rej();
        fetch(urls[i++]).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(res, nx);
      })();
    });
  }

  // একটি URL ডাউনলোড করে DATA ক্যাশে রাখে (আগে থেকে থাকলে বাদ)
  async function grab(urls) {
    for (var i = 0; i < urls.length; i++) {
      try {
        if (await caches.match(urls[i])) return true;
        var r = await fetch(urls[i]);
        if (!r.ok) continue;
        var c = await caches.open(DATA);
        await c.put(urls[i], r.clone());
        await r.arrayBuffer();
        return true;
      } catch (e) {}
    }
    return false;
  }

  function collect(o, out) {
    if (Array.isArray(o)) { o.forEach(function (x) { collect(x, out); }); return; }
    if (o && typeof o === "object") {
      if (typeof o.name === "string" && /^[a-z]{3}-[a-z]+/.test(o.name) && o.language) out.push(o);
      else for (var k in o) collect(o[k], out);
    }
  }

  var EDS = [];
  function loadEditions() {
    var u = [];
    HB.forEach(function (b) { u.push(b + "editions.min.json"); u.push(b + "editions.json"); });
    jget(u).then(function (j) {
      var all = []; collect(j, all);
      EDS = all;
      var ben = all.filter(function (e) { return /^ben-/.test(e.name); });
      var list = ben.length ? ben : all.filter(function (e) { return /^eng-/.test(e.name); });
      var h = "";
      list.forEach(function (e) {
        var k = e.name.replace(/^[a-z]{3}-/, "");
        h += '<label style="display:flex;gap:8px;align-items:center;margin:4px 0"><input type="checkbox" class="of-ed" value="' +
          e.name + '" checked> ' + (NAMES[k] || k) + "</label>";
      });
      q("of-hl").innerHTML = h || "<small>কোনো সংকলন পাওয়া যায়নি</small>";
      q("of-hs").textContent = list.length ? "(প্রতিটি কয়েক MB, মোট জায়গা লাগতে পারে বেশি)" : "";
    }).catch(function () {
      q("of-hl").innerHTML = "<small>সংকলনের তালিকা আনা যায়নি। ইন্টারনেট দেখে আবার খুলুন।</small>";
      q("of-hs").textContent = "";
    });
  }

  async function run() {
    if (busy) return;
    busy = true; cancel = false;
    q("of-go").textContent = "থামান";
    var jobs = [];
    if (q("of-q").checked) {
      for (var n = 1; n <= 114; n++) {
        jobs.push({ t: "সূরা " + n, u: [QAPI + "surah/" + n + "/quran-uthmani"] });
        jobs.push({ t: "সূরা " + n, u: [QAPI + "surah/" + n + "/bn.bengali"] });
      }
    }
    if (q("of-p").checked) {
      try {
        status("আপনার যোগ করা PDF/ফাইলের তালিকা আনা হচ্ছে…");
        var cr = await fetch("content.json?" + Date.now());
        if (cr.ok) {
          var cc = await caches.open(DATA);
          await cc.put(new URL("content.json", location.href).href, cr.clone());
          var cj = await cr.json();
          var seen = {};
          (function walk(v) {
            if (Array.isArray(v)) { v.forEach(walk); return; }
            if (v && typeof v === "object") {
              for (var k in v) {
                if (k === "url" && typeof v[k] === "string") {
                  try {
                    var uu = new URL(v[k], location.href);
                    var same = uu.origin === location.origin;
                    if ((same || /\.pdf($|\?)/i.test(uu.pathname)) && !seen[uu.href]) {
                      seen[uu.href] = 1;
                      jobs.push({ t: decodeURIComponent(uu.pathname.split("/").pop() || "ফাইল"), u: [uu.href], soft: !same });
                    }
                  } catch (e) {}
                } else walk(v[k]);
              }
            }
          })(cj);
        }
      } catch (e) {}
    }
    var picks = [].slice.call(box.querySelectorAll(".of-ed:checked")).map(function (x) { return x.value; });
    picks.forEach(function (name) {
      var k = name.replace(/^[a-z]{3}-/, "");
      var ara = "ara-" + k;
      [name, ara].forEach(function (nm) {
        if (nm !== name && !EDS.some(function (e) { return e.name === nm; })) return;
        var u = [];
        HB.forEach(function (b) { u.push(b + "editions/" + nm + ".min.json"); u.push(b + "editions/" + nm + ".json"); });
        jobs.push({ t: (NAMES[k] || k) + (nm === name ? "" : " (আরবি)"), u: u, big: true });
      });
    });
    if (!jobs.length) { status("কিছু বেছে নিন।"); busy = false; q("of-go").textContent = "ডাউনলোড শুরু"; return; }

    try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}

    var done = 0, fail = [], idx = 0;
    async function worker() {
      while (idx < jobs.length && !cancel) {
        var j = jobs[idx++];
        status("ডাউনলোড হচ্ছে: " + j.t + " (" + done + "/" + jobs.length + ")");
        var ok = await grab(j.u);
        if (!ok && !j.soft) fail.push(j.t);
        done++; bar(done / jobs.length);
      }
    }
    var ws = [];
    for (var w = 0; w < 3; w++) ws.push(worker());
    await Promise.all(ws);

    busy = false; q("of-go").textContent = "ডাউনলোড শুরু";
    if (cancel) status("থামানো হয়েছে। যা নামানো হয়েছে তা জমা আছে, আবার চাপলে বাকিটা নামবে।");
    else if (fail.length) status("শেষ। " + fail.length + "টি নামেনি (" + fail.slice(0, 3).join(", ") + (fail.length > 3 ? "…" : "") + "). আবার চেষ্টা করুন।");
    else status("সম্পন্ন! এখন ইন্টারনেট ছাড়াই কুরআন ও হাদিস চলবে।");
  }

  q("of-go").onclick = function () { if (busy) { cancel = true; } else run(); };
  q("of-x").onclick = function () { ov.style.display = "none"; };
  ov.addEventListener("click", function (e) { if (e.target === ov) ov.style.display = "none"; });
  btn.onclick = function () {
    ov.style.display = "flex";
    if (!EDS.length) loadEditions();
  };

  function mount() { document.body.appendChild(btn); document.body.appendChild(ov); }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);
})();
