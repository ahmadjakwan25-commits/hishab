/* আল-মিফতাহ: পৃষ্ঠা অনুযায়ী কুরআন (মাদানী ৬০৪ পৃষ্ঠা) + পৃষ্ঠাভিত্তিক তেলাওয়াত */
(function () {
  "use strict";
  var API = "https://api.alquran.cloud/v1/";
  var TOTAL = 604, DATA = "almiftah-data";
  var KNOWN = {
    "ar.alafasy": "মিশারি আল-আফাসী",
    "ar.abdulbasitmurattal": "আব্দুল বাসিত (মুরাত্তাল)",
    "ar.husary": "খলিল আল-হুসারী",
    "ar.minshawi": "মুহাম্মদ আল-মিনশাবি",
    "ar.shaatree": "আবু বকর আশ-শাতরী",
    "ar.mahermuaiqly": "মাহের আল-মুয়াইকিলি",
    "ar.abdurrahmaansudais": "আবদুর রহমান আস-সুদাইস",
    "ar.saoodshuraym": "সউদ আশ-শুরাইম",
    "ar.hudhaify": "আলী আল-হুযাইফী",
    "ar.muhammadayyoub": "মুহাম্মদ আইয়ুব",
    "ar.ahmedajamy": "আহমদ আল-আজমী"
  };

  function ls(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {}
    return null;
  }
  var S = {
    page: parseInt(ls("mfm-page"), 10) || 1,
    rec: ls("mfm-rec") || "ar.alafasy",
    fs: parseInt(ls("mfm-fs"), 10) || 26,
    tr: ls("mfm-tr") === "1",
    rep: ls("mfm-rep") === "1",
    nxt: ls("mfm-nxt") !== "0"
  };

  function bd(n) { return String(n).replace(/\d/g, function (d) { return "০১২৩৪৫৬৭৮৯".charAt(d); }); }
  function ad(n) { return String(n).replace(/\d/g, function (d) { return "٠١٢٣٤٥٦٧٨٩".charAt(d); }); }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  function jget(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error("http " + r.status);
      return r.json();
    }).then(function (j) {
      if (!j || j.code !== 200 || !j.data) throw new Error("bad");
      return j.data;
    });
  }
  // প্রতি সূরার প্রথম আয়াতের শুরুতে বসে থাকা বিসমিল্লাহ (৪ শব্দ) বাদ দেয়
  function clean(a) {
    var t = a.text;
    if (a.numberInSurah === 1 && a.surah.number !== 1 && a.surah.number !== 9) {
      var tk = t.split(" ");
      var base = (tk[0] || "").replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "");
      if (base === "بسم" && tk.length > 4) t = tk.slice(4).join(" ");
    }
    return t;
  }

  /* ---------- ডিজাইন ---------- */
  var st = document.createElement("style");
  st.textContent =
    "#mfm{position:fixed;inset:0;z-index:10000;display:none;flex-direction:column;background:#ece6d3;color:#1c1a14;font-family:inherit}" +
    "#mfm *{box-sizing:border-box}" +
    "#mfm .bar{display:flex;gap:6px;align-items:center;padding:8px 10px;background:#17603c;color:#fff;padding-top:max(8px,env(safe-area-inset-top,0px))}" +
    "#mfm .bar button,#mfm .bar select,#mfm .bar input{font:inherit;border:0;border-radius:8px;padding:7px 10px;background:rgba(255,255,255,.18);color:#fff}" +
    "#mfm .bar select option{color:#000}" +
    "#mfm .bar input{width:64px;text-align:center}" +
    "#mfm .info{flex:1;text-align:center;font-size:13px;line-height:1.25;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}" +
    "#mfm .set{display:flex;flex-wrap:wrap;gap:6px;align-items:center;padding:6px 10px;background:#dcd5bd;font-size:13px}" +
    "#mfm .set button,#mfm .set select{font:inherit;border:1px solid #b9b08f;border-radius:8px;padding:5px 9px;background:#f6f1e1;color:#1c1a14}" +
    "#mfm .pwrap{flex:1;overflow:auto;padding:12px 10px 20px;-webkit-overflow-scrolling:touch}" +
    "#mfm .pg{max-width:640px;margin:0 auto;background:#fdf8ea;border:3px double #b79b3e;border-radius:10px;padding:16px 14px;box-shadow:0 2px 10px rgba(0,0,0,.15)}" +
    "#mfm .tx{direction:rtl;text-align:justify;text-align-last:center;font-family:'Amiri Quran','Scheherazade New','Noto Naskh Arabic','Traditional Arabic',serif;line-height:2.2}" +
    "#mfm .ay{cursor:pointer;border-radius:6px;padding:0 1px}" +
    "#mfm .ay.on{background:rgba(23,96,60,.22)}" +
    "#mfm .no{color:#9a7b12;font-size:.75em;white-space:nowrap}" +
    "#mfm .sh{direction:rtl;text-align:center;margin:10px 0 6px;padding:6px;border:2px solid #b79b3e;border-radius:8px;background:#f1e7c2;font-family:'Amiri Quran','Noto Naskh Arabic',serif;font-size:1.35em}" +
    "#mfm .bs{direction:rtl;text-align:center;font-family:'Amiri Quran','Noto Naskh Arabic',serif;margin:6px 0;line-height:2}" +
    "#mfm .trs{max-width:640px;margin:12px auto 0;font-size:15px;line-height:1.7}" +
    "#mfm .trs div{padding:6px 2px;border-bottom:1px dashed #cdc4a3}" +
    "#mfm .msg{padding:30px 10px;text-align:center;color:#6b6448}" +
    "#mfm .pl{display:flex;gap:6px;align-items:center;padding:8px 10px;background:#17603c;color:#fff;padding-bottom:max(8px,env(safe-area-inset-bottom,0px))}" +
    "#mfm .pl button,#mfm .pl select{font:inherit;border:0;border-radius:10px;padding:9px 12px;background:rgba(255,255,255,.2);color:#fff}" +
    "#mfm .pl select{flex:1;min-width:0}" +
    "#mfm .pl select option{color:#000}" +
    "#mfm .pl button.on{background:#f4c542;color:#1c1a14}" +
    "#mfm .pst{padding:3px 10px;font-size:12px;color:#6b6448;text-align:center;min-height:20px;background:#ece6d3}";
  document.head.appendChild(st);
  var fl = document.createElement("link");
  fl.rel = "stylesheet";
  fl.href = "https://fonts.googleapis.com/css2?family=Amiri+Quran&display=swap";
  document.head.appendChild(fl);

  var btn = document.createElement("button");
  btn.textContent = "📖";
  btn.setAttribute("aria-label", "পৃষ্ঠা অনুযায়ী কুরআন");
  btn.style.cssText = "position:fixed;right:12px;bottom:146px;z-index:9998;width:46px;height:46px;border-radius:50%;border:0;background:#b8860b;color:#fff;font-size:22px;box-shadow:0 2px 8px rgba(0,0,0,.3);cursor:pointer";

  var ov = document.createElement("div");
  ov.id = "mfm";
  ov.innerHTML =
    '<div class="bar">' +
    '<button id="mfm-x" aria-label="বন্ধ">✕</button>' +
    '<button id="mfm-nx" aria-label="পরের পৃষ্ঠা">◀</button>' +
    '<input id="mfm-pn" type="number" min="1" max="604" inputmode="numeric">' +
    '<button id="mfm-pv" aria-label="আগের পৃষ্ঠা">▶</button>' +
    '<div class="info" id="mfm-info"></div>' +
    '</div>' +
    '<div class="set">' +
    '<button id="mfm-fm">A−</button><button id="mfm-fp">A+</button>' +
    '<label><input type="checkbox" id="mfm-tr"> বাংলা অনুবাদ</label>' +
    '<select id="mfm-juz"></select>' +
    '<button id="mfm-dl">⬇ অফলাইনে নামান</button>' +
    '</div>' +
    '<div class="pwrap" id="mfm-w"><div class="pg"><div id="mfm-t"></div></div><div class="trs" id="mfm-trs"></div></div>' +
    '<div class="pst" id="mfm-st"></div>' +
    '<div class="pl">' +
    '<button id="mfm-pp" aria-label="চালান">▶</button>' +
    '<select id="mfm-rec" aria-label="কারী"></select>' +
    '<button id="mfm-rep" aria-label="পৃষ্ঠা বারবার">🔁</button>' +
    '<button id="mfm-nxt" aria-label="পরের পৃষ্ঠায় নিজে যাও">⏭</button>' +
    '</div>';

  function $(id) { return ov.querySelector("#mfm-" + id); }
  function say(t) { $("st").textContent = t || ""; }

  /* ---------- পৃষ্ঠা লোড ও আঁকা ---------- */
  var PG = null, tokLoad = 0;

  function draw() {
    var a = PG.ayahs, h = '<div class="tx">';
    a.forEach(function (x, i) {
      if (x.numberInSurah === 1) {
        h += '</div><div class="sh">' + esc(x.surah.name) + "</div>";
        if (x.surah.number !== 1 && x.surah.number !== 9) h += '<div class="bs">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</div>';
        h += '<div class="tx">';
      }
      h += '<span class="ay" data-i="' + i + '">' + esc(clean(x)) + ' <span class="no">﴿' + ad(x.numberInSurah) + "﴾</span></span> ";
    });
    h += "</div>";
    var t = $("t");
    t.innerHTML = h;
    t.style.fontSize = S.fs + "px";
    var f = a[0];
    $("info").textContent = "পারা " + bd(f.juz) + " · " + f.surah.name + " · পৃষ্ঠা " + bd(PG.n);
    var trs = $("trs");
    if (S.tr) {
      trs.innerHTML = a.map(function (x) {
        var tt = PG.tr[x.number];
        return tt ? "<div><b>" + bd(x.surah.number) + ":" + bd(x.numberInSurah) + "</b> " + esc(tt) + "</div>" : "";
      }).join("");
    } else trs.innerHTML = "";
  }

  function go(n, autoplay) {
    n = parseInt(n, 10);
    if (!(n >= 1)) n = 1;
    if (n > TOTAL) n = TOTAL;
    var my = ++tokLoad;
    stopAudio();
    S.page = n; ls("mfm-page", n);
    $("pn").value = n;
    say("");
    $("t").innerHTML = '<div class="msg">লোড হচ্ছে…</div>';
    $("trs").innerHTML = "";
    Promise.all([
      jget(API + "page/" + n + "/quran-uthmani"),
      jget(API + "page/" + n + "/bn.bengali").catch(function () { return null; })
    ]).then(function (r) {
      if (my !== tokLoad) return;
      PG = { n: n, ayahs: r[0].ayahs, tr: {} };
      if (r[1] && r[1].ayahs) r[1].ayahs.forEach(function (x) { PG.tr[x.number] = x.text; });
      draw();
      $("w").scrollTop = 0;
      if (autoplay) startAt(0);
      if (n < TOTAL) fetch(API + "page/" + (n + 1) + "/quran-uthmani").catch(function () {});
    }).catch(function () {
      if (my !== tokLoad) return;
      $("t").innerHTML = '<div class="msg">এই পৃষ্ঠা লোড করা যায়নি। ইন্টারনেট দেখে আবার চেষ্টা করুন, অথবা আগে "⬇ অফলাইনে নামান" দিয়ে সব পৃষ্ঠা নামিয়ে রাখুন।</div>';
    });
  }

  /* ---------- অডিও ---------- */
  var au = new Audio(), AUD = { key: "", list: [] }, q = [], qi = -1, playing = false, paused = false, tokPlay = 0;
  au.preload = "auto";

  function setPlaying(b) {
    playing = b;
    $("pp").textContent = b ? "⏸" : "▶";
  }
  function mark(i) {
    var o = ov.querySelector(".ay.on");
    if (o) o.classList.remove("on");
    var n = ov.querySelector('.ay[data-i="' + i + '"]');
    if (n) {
      n.classList.add("on");
      try { n.scrollIntoView({ block: "center", behavior: "smooth" }); } catch (e) {}
    }
  }
  function stopAudio() {
    tokPlay++;
    au.onended = null; au.onerror = null;
    try { au.pause(); } catch (e) {}
    paused = false; qi = -1;
    setPlaying(false);
    var o = ov.querySelector(".ay.on");
    if (o) o.classList.remove("on");
  }
  function loadAudio() {
    var key = PG.n + "|" + S.rec;
    if (AUD.key === key) return Promise.resolve(AUD.list);
    return jget(API + "page/" + PG.n + "/" + S.rec).then(function (d) {
      AUD = {
        key: key,
        list: d.ayahs.map(function (x) { return [x.audio].concat(x.audioSecondary || []).filter(Boolean); })
      };
      return AUD.list;
    });
  }
  function startAt(i) {
    if (!PG) return;
    var my = ++tokPlay;
    say("অডিও আনা হচ্ছে…");
    loadAudio().then(function (list) {
      if (my !== tokPlay) return;
      if (!list.length) throw new Error("empty");
      q = list; paused = false;
      playIdx(i);
    }).catch(function () {
      if (my !== tokPlay) return;
      say("এই কারীর অডিও আনা যায়নি। ইন্টারনেট দেখুন বা অন্য কারী বেছে নিন।");
      setPlaying(false);
    });
  }
  function playIdx(i) {
    if (i >= q.length) {
      if (S.rep) { playIdx(0); return; }
      if (S.nxt && S.page < TOTAL) { go(S.page + 1, true); return; }
      stopAudio(); say("তেলাওয়াত শেষ");
      return;
    }
    qi = i; mark(i); setPlaying(true);
    var urls = q[i], t = 0;
    function tryUrl() {
      if (t >= urls.length) { say("এই আয়াতের অডিও পাওয়া যায়নি"); stopAudio(); return; }
      au.src = urls[t++];
      var p = au.play();
      if (p && p.catch) p.catch(function (e) {
        if (e && e.name === "NotAllowedError") { setPlaying(false); paused = true; say("চালাতে ▶ চাপুন"); }
      });
    }
    au.onended = function () { playIdx(qi + 1); };
    au.onerror = function () { tryUrl(); };
    say("");
    tryUrl();
  }
  function toggle() {
    if (playing) { au.pause(); paused = true; setPlaying(false); }
    else if (paused && au.getAttribute("src")) { paused = false; setPlaying(true); au.play().catch(function () {}); }
    else startAt(0);
  }

  /* ---------- কারীর তালিকা ---------- */
  function fillRec(list) {
    var sel = $("rec");
    sel.innerHTML = list.map(function (x) { return '<option value="' + esc(x[0]) + '">' + esc(x[1]) + "</option>"; }).join("");
    var ok = list.some(function (x) { return x[0] === S.rec; });
    if (!ok) S.rec = list[0][0];
    sel.value = S.rec;
  }
  var staticList = Object.keys(KNOWN).map(function (k) { return [k, KNOWN[k]]; });
  fillRec(staticList);
  fetch(API + "edition?format=audio&language=ar&type=versebyverse").then(function (r) { return r.json(); }).then(function (j) {
    if (!j || !j.data || !j.data.length) return;
    var have = {}, out = [];
    j.data.forEach(function (e) { have[e.identifier] = e; });
    Object.keys(KNOWN).forEach(function (k) { if (have[k]) out.push([k, KNOWN[k]]); });
    j.data.forEach(function (e) { if (!KNOWN[e.identifier]) out.push([e.identifier, e.englishName || e.name]); });
    if (out.length) fillRec(out);
  }).catch(function () {});

  /* ---------- অফলাইনে নামানো (কুরআনের লেখা + বাংলা অনুবাদ) ---------- */
  var dl = false, dlCancel = false;
  function grab(u) {
    return caches.match(u).then(function (h) {
      if (h) return true;
      return fetch(u).then(function (r) {
        if (!r.ok) return false;
        return caches.open(DATA).then(function (c) { return c.put(u, r.clone()); })
          .then(function () { return r.arrayBuffer(); }).then(function () { return true; });
      });
    }).catch(function () { return false; });
  }
  function dlAll() {
    if (dl) { dlCancel = true; return; }
    dl = true; dlCancel = false;
    var urls = [], i;
    for (i = 1; i <= TOTAL; i++) { urls.push(API + "page/" + i + "/quran-uthmani", API + "page/" + i + "/bn.bengali"); }
    var idx = 0, done = 0, fail = 0;
    $("dl").textContent = "থামান";
    function next() {
      if (idx >= urls.length || dlCancel) return Promise.resolve();
      var u = urls[idx++];
      return grab(u).then(function (ok) {
        done++; if (!ok) fail++;
        say("নামছে… " + bd(Math.round(done / urls.length * 100)) + "%");
        return next();
      });
    }
    Promise.all([next(), next(), next(), next()]).then(function () {
      dl = false;
      $("dl").textContent = "⬇ অফলাইনে নামান";
      if (dlCancel) say("থামানো হয়েছে। আবার চাপলে বাকিটা নামবে।");
      else if (fail) say(bd(fail) + "টি নামেনি। আবার চেষ্টা করুন।");
      else say("সম্পন্ন! এখন ইন্টারনেট ছাড়াই ৬০৪ পৃষ্ঠার লেখা চলবে। (অডিওর জন্য ইন্টারনেট লাগবে)");
    });
  }

  /* ---------- ইভেন্ট ---------- */
  var opened = false;
  function openIt() {
    if (opened) return;
    opened = true;
    ov.style.display = "flex";
    try { history.pushState({ mfm: 1 }, ""); } catch (e) {}
    if (!PG) go(S.page);
  }
  function closeIt() {
    if (!opened) return;
    opened = false;
    ov.style.display = "none";
    stopAudio();
  }
  btn.onclick = openIt;
  $("x").onclick = function () {
    var had = false;
    try { had = history.state && history.state.mfm; } catch (e) {}
    if (had) history.back(); else closeIt();
  };
  window.addEventListener("popstate", function () { if (opened) closeIt(); });

  $("nx").onclick = function () { go(S.page + 1); };
  $("pv").onclick = function () { go(S.page - 1); };
  $("pn").onchange = function () { if (parseInt(this.value, 10) !== S.page) go(this.value); };
  $("fm").onclick = function () { S.fs = Math.max(16, S.fs - 2); ls("mfm-fs", S.fs); $("t").style.fontSize = S.fs + "px"; };
  $("fp").onclick = function () { S.fs = Math.min(48, S.fs + 2); ls("mfm-fs", S.fs); $("t").style.fontSize = S.fs + "px"; };
  $("tr").checked = S.tr;
  $("tr").onchange = function () { S.tr = this.checked; ls("mfm-tr", S.tr ? "1" : "0"); if (PG) draw(); };
  var js = "";
  for (var j = 1; j <= 30; j++) js += '<option value="' + (j === 1 ? 1 : 2 + (j - 1) * 20) + '">পারা ' + bd(j) + "</option>";
  $("juz").innerHTML = '<option value="">পারা…</option>' + js;
  $("juz").onchange = function () { if (this.value) go(this.value); this.value = ""; };
  $("dl").onclick = dlAll;
  $("rec").onchange = function () {
    S.rec = this.value; ls("mfm-rec", S.rec);
    if (playing) startAt(Math.max(qi, 0));
  };
  $("rep").className = S.rep ? "on" : "";
  $("rep").onclick = function () { S.rep = !S.rep; ls("mfm-rep", S.rep ? "1" : "0"); this.className = S.rep ? "on" : ""; };
  $("nxt").className = S.nxt ? "on" : "";
  $("nxt").onclick = function () { S.nxt = !S.nxt; ls("mfm-nxt", S.nxt ? "1" : "0"); this.className = S.nxt ? "on" : ""; };
  $("pp").onclick = toggle;

  // পৃষ্ঠায় ট্যাপ: আয়াতে ট্যাপ করলে সেখান থেকে, ফাঁকা জায়গায় ট্যাপ করলে চালু/বিরতি
  var sx = 0, sy = 0, swiped = false;
  var wrap = $("w");
  wrap.addEventListener("touchstart", function (e) {
    var t = e.touches[0]; sx = t.clientX; sy = t.clientY; swiped = false;
  }, { passive: true });
  wrap.addEventListener("touchend", function (e) {
    var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
    if (Math.abs(dx) > 70 && Math.abs(dy) < 45) {
      swiped = true;
      go(S.page + (dx < 0 ? 1 : -1));
    }
  }, { passive: true });
  wrap.addEventListener("click", function (e) {
    if (swiped) { swiped = false; return; }
    if (e.target.closest && e.target.closest(".trs")) return;
    var a = e.target.closest ? e.target.closest(".ay") : null;
    if (a) startAt(parseInt(a.getAttribute("data-i"), 10) || 0);
    else if (e.target.closest && e.target.closest(".pg")) toggle();
  });

  au.addEventListener("pause", function () { if (!playing && !paused) say(""); });

  function mount() { document.body.appendChild(btn); document.body.appendChild(ov); }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);

  window.__mfm = { go: go, S: S }; // পরীক্ষার সুবিধার জন্য
})();
