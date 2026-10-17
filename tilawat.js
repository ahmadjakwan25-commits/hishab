/* আল-মিফতাহ: তেলাওয়াত
   নিজের হাফেজী কুরআন PDF ফোনেই রেখে হুবহু পৃষ্ঠা দেখা, আঙুলে পাতা উল্টানো, সূরা/পারার সূচি ও খোঁজ। */
(function () {
  "use strict";

  var BASE = (function () {
    var s = document.currentScript;
    return (s && s.src ? s.src : location.href).replace(/[^\/]*$/, "");
  })();

  /* ---------- এই PDF-এর (নূরানী হাফেজী, এমদাদিয়া) পৃষ্ঠা-তালিকা ---------- */
  var EXPECT_PAGES = 614;
  // প্রতিটি সূরা PDF-এর যে পৃষ্ঠায় শুরু (১ম থেকে ১১৪তম)
  var SP = [2, 3, 51, 78, 107, 129, 152, 178, 188, 209, 222, 236, 250, 256, 262, 268, 283, 294, 306, 313, 323, 332, 343, 351, 360, 367, 377, 386, 397, 405, 412, 416, 419, 429, 435, 441, 446, 453, 459, 468, 478, 484, 490, 496, 499, 503, 507, 512, 516, 519, 521, 524, 527, 529, 532, 535, 538, 543, 546, 550, 552, 554, 555, 557, 559, 561, 563, 565, 568, 570, 572, 574, 577, 579, 581, 583, 585, 587, 588, 590, 591, 592, 593, 595, 596, 597, 598, 598, 599, 601, 601, 602, 603, 603, 604, 604, 605, 605, 606, 606, 607, 607, 608, 608, 608, 609, 609, 609, 609, 610, 610, 610, 611, 611];
  // প্রতিটি পারা যে পৃষ্ঠায় শুরু
  var PS = [2, 23, 43, 63, 83, 103, 123, 143, 163, 183, 203, 223, 243, 263, 283, 303, 323, 343, 363, 383, 403, 423, 443, 463, 483, 503, 523, 543, 563, 587];
  var PN = ["আলিফ লাম মীম", "সাইয়াকূল", "তিলকার রুসুল", "লান তানালূ", "ওয়াল মুহসানাত", "লা ইউহিব্বুল্লাহ", "ওয়া ইযা সামিঊ", "ওয়া লাও আন্নানা", "কালাল মালাউ", "ওয়া'লামূ", "ইয়াতাযিরূন", "ওয়ামা মিন দাব্বাহ", "ওয়ামা উবাররিউ", "রুবামা", "সুবহানাল্লাযী", "কালা আলাম", "ইকতারাবা", "কাদ আফলাহা", "ওয়া কালাল্লাযীনা", "আম্মান খালাক্বা", "উতলু মা উহিয়া", "ওয়া মান ইয়াকনুত", "ওয়া মা লিয়া", "ফামান আযলামু", "ইলাইহি ইউরাদ্দু", "হা-মীম", "কালা ফামা খাতবুকুম", "কাদ সামিআল্লাহু", "তাবারাকাল্লাযী", "আম্মা"];
  var SB = ["আল-ফাতিহা", "আল-বাকারা", "আলে ইমরান", "আন-নিসা", "আল-মায়িদা", "আল-আনআম", "আল-আ'রাফ", "আল-আনফাল", "আত-তাওবা", "ইউনুস", "হূদ", "ইউসুফ", "আর-রা'দ", "ইবরাহীম", "আল-হিজর", "আন-নাহল", "বনী ইসরাঈল", "আল-কাহফ", "মারইয়াম", "ত্বা-হা", "আল-আম্বিয়া", "আল-হাজ্জ", "আল-মুমিনূন", "আন-নূর", "আল-ফুরকান", "আশ-শু'আরা", "আন-নামল", "আল-কাসাস", "আল-আনকাবূত", "আর-রূম", "লুকমান", "আস-সাজদা", "আল-আহযাব", "সাবা", "ফাতির", "ইয়া-সীন", "আস-সাফফাত", "ছোয়াদ", "আয-যুমার", "আল-মুমিন (গাফির)", "হা-মীম আস-সাজদা", "আশ-শূরা", "আয-যুখরুফ", "আদ-দুখান", "আল-জাসিয়া", "আল-আহকাফ", "মুহাম্মাদ", "আল-ফাতহ", "আল-হুজুরাত", "ক্বাফ", "আয-যারিয়াত", "আত-তূর", "আন-নাজম", "আল-ক্বামার", "আর-রহমান", "আল-ওয়াক্বিয়া", "আল-হাদীদ", "আল-মুজাদালা", "আল-হাশর", "আল-মুমতাহিনা", "আস-সাফ", "আল-জুমু'আ", "আল-মুনাফিকূন", "আত-তাগাবুন", "আত-তালাক্ব", "আত-তাহরীম", "আল-মুলক", "আল-ক্বালাম", "আল-হাক্কাহ", "আল-মা'আরিজ", "নূহ", "আল-জিন", "আল-মুযযাম্মিল", "আল-মুদ্দাসসির", "আল-ক্বিয়ামাহ", "আদ-দাহর", "আল-মুরসালাত", "আন-নাবা", "আন-নাযি'আত", "আবাসা", "আত-তাকবীর", "আল-ইনফিতার", "আল-মুতাফফিফীন", "আল-ইনশিক্বাক", "আল-বুরূজ", "আত-তারিক্ব", "আল-আ'লা", "আল-গাশিয়াহ", "আল-ফাজর", "আল-বালাদ", "আশ-শামস", "আল-লাইল", "আয-যোহা", "আল-ইনশিরাহ", "আত-তীন", "আল-আলাক্ব", "আল-ক্বদর", "আল-বাইয়্যিনাহ", "আয-যিলযাল", "আল-আদিয়াত", "আল-ক্বারি'আহ", "আত-তাকাসুর", "আল-আসর", "আল-হুমাযাহ", "আল-ফীল", "কুরাইশ", "আল-মা'ঊন", "আল-কাউসার", "আল-কাফিরূন", "আন-নাসর", "আল-মাসাদ", "আল-ইখলাস", "আল-ফালাক্ব", "আন-নাস"];
  var SE = ["Al-Fatihah", "Al-Baqarah", "Ali Imran", "An-Nisa", "Al-Maidah", "Al-Anam", "Al-Araf", "Al-Anfal", "At-Tawbah", "Yunus", "Hud", "Yusuf", "Ar-Rad", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra Bani Israil", "Al-Kahf", "Maryam", "Ta-Ha", "Al-Anbiya", "Al-Hajj", "Al-Muminun", "An-Nur", "Al-Furqan", "Ash-Shuara", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum", "Luqman", "As-Sajdah", "Al-Ahzab", "Saba", "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir Al-Mumin", "Fussilat Ha-Mim Sajdah", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf", "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqiah", "Al-Hadid", "Al-Mujadilah", "Al-Hashr", "Al-Mumtahanah", "As-Saff", "Al-Jumuah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Maarij", "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir", "Al-Qiyamah", "Al-Insan Ad-Dahr", "Al-Mursalat", "An-Naba", "An-Naziat", "Abasa", "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-Ala", "Al-Ghashiyah", "Al-Fajr", "Al-Balad", "Ash-Shams", "Al-Layl", "Ad-Duha", "Ash-Sharh Al-Inshirah", "At-Tin", "Al-Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-Adiyat", "Al-Qariah", "At-Takathur", "Al-Asr", "Al-Humazah", "Al-Fil", "Quraysh", "Al-Maun", "Al-Kawthar", "Al-Kafirun", "An-Nasr", "Al-Masad Lahab", "Al-Ikhlas", "Al-Falaq", "An-Nas"];

  /* ---------- ছোট সহায়ক ---------- */
  function ls(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {}
    return null;
  }
  function bd(n) { return String(n).replace(/\d/g, function (d) { return "০১২৩৪৫৬৭৮৯".charAt(d); }); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function norm(s) {
    return String(s).toLowerCase()
      .replace(/[০-৯]/g, function (d) { return "০১২৩৪৫৬৭৮৯".indexOf(d); })
      .replace(/[-'’‘`\s.]/g, "");
  }
  function curSurah(p) {
    var best = -1, bp = -1;
    for (var i = 0; i < SP.length; i++) { if (SP[i] <= p && SP[i] > bp) { bp = SP[i]; best = i; } }
    return best; // একই পৃষ্ঠায় একাধিক শুরু হলে প্রথমটি
  }
  function curPara(p) {
    var best = 0;
    for (var i = 0; i < PS.length; i++) if (PS[i] <= p) best = i;
    return best;
  }

  /* ---------- IndexedDB: PDF ফোনেই জমা থাকে ---------- */
  function idb() {
    return new Promise(function (res, rej) {
      var r = indexedDB.open("almiftah-tlw", 1);
      r.onupgradeneeded = function () { r.result.createObjectStore("f"); };
      r.onsuccess = function () { res(r.result); };
      r.onerror = function () { rej(r.error); };
    });
  }
  function idbGet(k) {
    return idb().then(function (db) {
      return new Promise(function (res, rej) {
        var q = db.transaction("f", "readonly").objectStore("f").get(k);
        q.onsuccess = function () { res(q.result); };
        q.onerror = function () { rej(q.error); };
      });
    });
  }
  function idbSet(k, v) {
    return idb().then(function (db) {
      return new Promise(function (res, rej) {
        var t = db.transaction("f", "readwrite");
        t.objectStore("f").put(v, k);
        t.oncomplete = function () { res(); };
        t.onerror = function () { rej(t.error); };
      });
    });
  }
  function idbDel(k) {
    return idb().then(function (db) {
      return new Promise(function (res, rej) {
        var t = db.transaction("f", "readwrite");
        t.objectStore("f").delete(k);
        t.oncomplete = function () { res(); };
        t.onerror = function () { rej(t.error); };
      });
    });
  }

  /* ---------- ডিজাইন ---------- */
  var st = document.createElement("style");
  st.textContent =
    "#tlw{position:fixed;inset:0;z-index:10001;display:none;flex-direction:column;background:#d9d3bf;color:#1c1a14;font-family:inherit;-webkit-user-select:none;user-select:none}" +
    "#tlw *{box-sizing:border-box}" +
    "#tlw .tb{display:flex;gap:6px;align-items:center;padding:8px 10px;padding-top:max(8px,env(safe-area-inset-top,0px));background:linear-gradient(#1b6e45,#145132);color:#fff;box-shadow:0 2px 6px rgba(0,0,0,.3);z-index:3}" +
    "#tlw .tb button{font:inherit;border:0;border-radius:10px;padding:8px 12px;background:rgba(255,255,255,.18);color:#fff;font-size:16px}" +
    "#tlw .tb input{width:70px;padding:8px 4px;text-align:center;border:0;border-radius:10px;background:rgba(255,255,255,.18);color:#fff;font:inherit;font-weight:700}" +
    "#tlw .tb .of{font-size:12px;opacity:.9}" +
    "#tlw .tb .lb{flex:1;min-width:0;text-align:center;font-size:13px;line-height:1.25;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}" +
    "#tlw .stg{position:relative;flex:1;overflow:hidden;touch-action:pan-y;background:radial-gradient(circle at 50% 30%,#e8e2cd,#cfc8ae)}" +
    "#tlw .stg canvas{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:#fff;box-shadow:0 3px 14px rgba(0,0,0,.35);transition:transform .24s ease}" +
    "#tlw .stg.z{overflow:auto;touch-action:auto;-webkit-overflow-scrolling:touch}" +
    "#tlw .stg.z canvas{position:relative;left:auto;top:auto;transform:none;margin:0 auto;display:block;transition:none}" +
    "#tlw .msg{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:24px;text-align:center;line-height:1.6;color:#3a3420}" +
    "#tlw .msg .big{font-size:44px}" +
    "#tlw .pick{display:inline-block;padding:12px 22px;border-radius:12px;background:#17603c;color:#fff;font-size:16px;cursor:pointer}" +
    "#tlw .sl{padding:6px 14px;padding-bottom:max(6px,env(safe-area-inset-bottom,0px));background:#145132}" +
    "#tlw .sl input{width:100%;margin:0;accent-color:#f4c542}" +
    /* পাশের সূচি-মেনু */
    "#tlw .bk{position:absolute;inset:0;background:rgba(0,0,0,.45);opacity:0;pointer-events:none;transition:opacity .2s;z-index:4}" +
    "#tlw .mn{position:absolute;top:0;bottom:0;left:0;width:min(88%,380px);background:#fbf6e6;z-index:5;transform:translateX(-102%);transition:transform .24s ease;display:flex;flex-direction:column;box-shadow:4px 0 18px rgba(0,0,0,.35)}" +
    "#tlw.mo .bk{opacity:1;pointer-events:auto}" +
    "#tlw.mo .mn{transform:none}" +
    "#tlw .mh{display:flex;align-items:center;gap:8px;padding:12px;padding-top:max(12px,env(safe-area-inset-top,0px));background:linear-gradient(#1b6e45,#145132);color:#fff}" +
    "#tlw .mh b{flex:1;font-size:17px}" +
    "#tlw .mh button{border:0;border-radius:10px;padding:6px 12px;background:rgba(255,255,255,.2);color:#fff;font:inherit}" +
    "#tlw .sr{padding:10px 12px 6px}" +
    "#tlw .sr input{width:100%;padding:10px 12px;border:1.5px solid #c9bd8f;border-radius:10px;font:inherit;background:#fff;color:#1c1a14}" +
    "#tlw .tabs{display:flex;gap:8px;padding:4px 12px 8px}" +
    "#tlw .tabs button{flex:1;padding:9px;border:1.5px solid #c9bd8f;border-radius:10px;background:#f4edd2;font:inherit;color:#3a3420}" +
    "#tlw .tabs button.on{background:#17603c;border-color:#17603c;color:#fff}" +
    "#tlw .ls{flex:1;overflow:auto;padding:0 8px 12px;-webkit-overflow-scrolling:touch}" +
    "#tlw .it{display:flex;align-items:center;gap:10px;width:100%;text-align:left;padding:10px;margin:0 0 6px;border:1px solid #e0d6b0;border-radius:10px;background:#fff;font:inherit;color:#1c1a14}" +
    "#tlw .it.on{background:#e3f1e8;border-color:#17603c}" +
    "#tlw .it .n{min-width:34px;height:34px;line-height:34px;text-align:center;border-radius:50%;background:#f1e7c2;border:1.5px solid #b8932f;color:#6b4f08;font-size:13px;font-weight:700}" +
    "#tlw .it .t{flex:1;min-width:0}" +
    "#tlw .it .t small{display:block;color:#7a735a;font-size:12px}" +
    "#tlw .it .pg{font-size:12px;color:#17603c;white-space:nowrap}" +
    "#tlw .em{padding:18px 8px;text-align:center;color:#7a735a}" +
    "#tlw .ft{display:flex;flex-wrap:wrap;gap:6px;padding:8px 12px;padding-bottom:max(8px,env(safe-area-inset-bottom,0px));border-top:1px solid #e0d6b0;background:#f4edd2}" +
    "#tlw .ft button{flex:1;min-width:120px;padding:8px;border:1px solid #c9bd8f;border-radius:10px;background:#fff;font:inherit;font-size:13px;color:#3a3420}" +
    /* কুরআন ফিচারের কার্ড */
    "#tlw-card{display:flex;align-items:center;gap:12px;width:100%;margin:12px 0;padding:14px 16px;border:2px solid #d8b64a;border-radius:16px;background:linear-gradient(135deg,#5b3a12,#8a5a1a 60%,#a8741f);color:#fff;text-align:left;font:inherit;cursor:pointer;box-shadow:0 4px 12px rgba(91,58,18,.35)}" +
    "#tlw-card .ci{font-size:38px;line-height:1;filter:drop-shadow(0 2px 2px rgba(0,0,0,.3))}" +
    "#tlw-card .ct{flex:1;min-width:0}" +
    "#tlw-card b{display:block;font-size:18px;color:#fff1b8}" +
    "#tlw-card small{display:block;margin-top:2px;font-size:13px;opacity:.95}" +
    "#tlw-card .cg{font-size:22px;color:#f4c542}";
  document.head.appendChild(st);

  var ov = document.createElement("div");
  ov.id = "tlw";
  ov.innerHTML =
    '<div class="tb">' +
    '<button id="tl-m" aria-label="সূচি">☰</button>' +
    '<input id="tl-p" type="number" min="1" inputmode="numeric" aria-label="পৃষ্ঠা নম্বর"><span class="of" id="tl-of"></span>' +
    '<div class="lb" id="tl-lb"></div>' +
    '<button id="tl-x" aria-label="বন্ধ">✕</button>' +
    '</div>' +
    '<div class="stg" id="tl-s"></div>' +
    '<div class="sl"><input id="tl-r" type="range" min="1" max="614" value="1" aria-label="পাতা সরান"></div>' +
    '<div class="bk" id="tl-bk"></div>' +
    '<div class="mn">' +
    '<div class="mh"><b>সূচি</b><button id="tl-mx">✕ বন্ধ</button></div>' +
    '<div class="sr"><input id="tl-q" type="search" placeholder="সূরা বা পারার নাম/নম্বর লিখুন…" autocomplete="off"></div>' +
    '<div class="tabs"><button id="tl-ts" class="on">সূরা (১১৪)</button><button id="tl-tp">পারা (৩০)</button></div>' +
    '<div class="ls" id="tl-l"></div>' +
    '<div class="ft"><button id="tl-dir"></button><button id="tl-chg">📂 অন্য PDF বেছে নিন</button></div>' +
    '</div>';

  function $(id) { return ov.querySelector("#tl-" + id); }

  /* ---------- অবস্থা ---------- */
  var S = {
    page: parseInt(ls("tlw-page"), 10) || 2,
    rtl: ls("tlw-dir") !== "ltr",   // ডান দিকে টানলে পরের পাতা (আরবি বইয়ের নিয়ম)
    tab: "s"
  };
  var pdfjs = null, DOC = null, NUM = 0, Z = 1, token = 0, cache = {}, order = [];

  function loadLib() {
    if (pdfjs) return Promise.resolve(pdfjs);
    return import(BASE + "pdf.min.js").then(function (m) {
      pdfjs = m;
      m.GlobalWorkerOptions.workerSrc = BASE + "pdf.worker.min.js";
      return m;
    });
  }
  function openBlob(blob) {
    return Promise.all([loadLib(), blob.arrayBuffer()]).then(function (r) {
      return r[0].getDocument({
        data: new Uint8Array(r[1]),
        wasmUrl: BASE,
        isEvalSupported: false
      }).promise;
    }).then(function (d) {
      DOC = d; NUM = d.numPages;
      cache = {}; order = [];
      $("r").max = NUM;
      $("of").textContent = "/ " + bd(NUM);
      $("p").max = NUM;
      return d;
    });
  }

  /* ---------- পাতা আঁকা ---------- */
  function stage() { return $("s"); }
  function render(n) {
    var sg = stage(), W = sg.clientWidth, H = sg.clientHeight;
    var key = n + "|" + W + "x" + H + "|" + Z;
    if (cache[n] && cache[n].key === key) return Promise.resolve(cache[n].c);
    return DOC.getPage(n).then(function (page) {
      var v1 = page.getViewport({ scale: 1 });
      var fit = Z > 1 ? (W / v1.width) * Z : Math.min(W / v1.width, H / v1.height); // বড় করলে প্রস্থ ধরে
      var dpr = Math.min(window.devicePixelRatio || 1, 3);
      var vw = v1.width * fit * dpr, vh = v1.height * fit * dpr;
      var cap = 14e6;
      if (vw * vh > cap) dpr = dpr * Math.sqrt(cap / (vw * vh));
      var vp = page.getViewport({ scale: fit * dpr });
      var c = document.createElement("canvas");
      c.width = Math.floor(vp.width); c.height = Math.floor(vp.height);
      c.style.width = Math.floor(v1.width * fit) + "px";
      c.style.height = Math.floor(v1.height * fit) + "px";
      return page.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise.then(function () {
        cache[n] = { key: key, c: c };
        order = order.filter(function (x) { return x !== n; }); order.push(n);
        while (order.length > 6) { delete cache[order.shift()]; }
        return c;
      });
    });
  }
  function place(c, exitDir) {
    var sg = stage();
    var old = sg.querySelector("canvas");
    var msg = sg.querySelector(".msg"); if (msg) sg.removeChild(msg);
    if (Z > 1 || !old || !exitDir) {
      while (sg.firstChild) sg.removeChild(sg.firstChild);
      sg.appendChild(c);
      sg.classList.toggle("z", Z > 1);
      if (Z > 1) { sg.scrollLeft = (sg.scrollWidth - sg.clientWidth) / 2; sg.scrollTop = 0; }
      return;
    }
    var W = sg.clientWidth;
    c.style.transition = "none";
    c.style.transform = "translate(-50%,-50%) translateX(" + (-exitDir * W) + "px)";
    sg.appendChild(c);
    void c.offsetWidth;
    c.style.transition = "";
    c.style.transform = "translate(-50%,-50%)";
    old.style.transform = "translate(-50%,-50%) translateX(" + (exitDir * W) + "px)";
    setTimeout(function () { if (old.parentNode === sg) sg.removeChild(old); }, 300);
    var extra = sg.querySelectorAll("canvas");
    for (var i = 0; i < extra.length; i++) if (extra[i] !== c && extra[i] !== old) sg.removeChild(extra[i]);
  }
  function labels() {
    var p = S.page, s = curSurah(p), k = curPara(p);
    $("p").value = p;
    $("r").value = p;
    var t = "";
    if (p >= SP[0] && p <= 611) t = "পারা " + bd(k + 1) + " · " + (s >= 0 ? SB[s] : "");
    else if (p < SP[0]) t = "প্রচ্ছদ";
    else t = "শেষের পাতা";
    $("lb").textContent = t;
    markList();
  }
  function show(n, exitDir) {
    var my = ++token;
    render(n).then(function (c) {
      if (my !== token) return;
      place(c, exitDir);
      [n + 1, n - 1].forEach(function (m) { if (m >= 1 && m <= NUM) render(m).catch(function () {}); });
    }).catch(function () {
      if (my !== token) return;
      info("😔", "এই পাতা আঁকা যায়নি। আবার চেষ্টা করুন।");
    });
  }
  function go(n, exitDir) {
    n = parseInt(n, 10);
    if (!(n >= 1)) n = 1;
    if (n > NUM) n = NUM;
    S.page = n; ls("tlw-page", n);
    Z = 1; stage().classList.remove("z");
    labels();
    show(n, exitDir || 0);
  }
  function flip(delta) {
    var n = S.page + delta;
    if (n < 1 || n > NUM) return;
    // exitDir: পুরোনো পাতা যে দিকে বেরিয়ে যাবে (আঙুল যে দিকে টানা হয়েছে)
    var finger = (delta > 0) === S.rtl ? 1 : -1;
    go(n, finger);
  }
  function info(icon, html, withPick) {
    var sg = stage();
    sg.classList.remove("z");
    sg.innerHTML = '<div class="msg"><div class="big">' + icon + "</div><div>" + html + "</div>" +
      (withPick ? '<label class="pick">📂 PDF ফাইল বেছে নিন<input type="file" accept="application/pdf,.pdf" id="tl-f" style="display:none"></label>' : "") +
      "</div>";
    var f = sg.querySelector("#tl-f");
    if (f) f.onchange = function () { if (this.files && this.files[0]) importFile(this.files[0]); };
  }

  /* ---------- PDF বেছে নেওয়া ও জমা ---------- */
  function importFile(file) {
    info("⏳", "PDF খোলা হচ্ছে…");
    openBlob(file).then(function () {
      if (NUM !== EXPECT_PAGES) {
        alert("সতর্কতা: এই PDF-এ " + bd(NUM) + "টি পৃষ্ঠা আছে, অথচ সূচির তালিকা " + bd(EXPECT_PAGES) + " পৃষ্ঠার নূরানী হাফেজী কুরআনের জন্য বানানো। পাতা ঠিকই দেখা যাবে, কিন্তু সূরা/পারার সূচি ঠিক নাও মিলতে পারে।");
      }
      return idbSet("pdf", file).catch(function () {
        alert("ফাইলটি ফোনে জমা রাখা যায়নি (জায়গা কম থাকতে পারে)। এখন পড়া যাবে, কিন্তু পরের বার আবার বেছে নিতে হতে পারে।");
      });
    }).then(function () {
      go(S.page > NUM ? 2 : S.page);
    }).catch(function () {
      info("😔", "এই ফাইল খোলা যায়নি। সঠিক PDF বেছে নিন।", true);
    });
  }
  function start() {
    if (DOC) { go(S.page); return; }
    info("⏳", "খোলা হচ্ছে…");
    idbGet("pdf").then(function (blob) {
      if (!blob) {
        info("📖", "আপনার <b>হাফেজী কুরআনের PDF</b> একবার বেছে নিন।<br><small>ফাইলটি আপনার ফোনের ভেতরেই থাকবে, কোথাও আপলোড হবে না। পরের বার নিজে নিজে খুলবে, ইন্টারনেটও লাগবে না।</small>", true);
        return;
      }
      return openBlob(blob).then(function () { go(S.page > NUM ? 2 : S.page); });
    }).catch(function () {
      info("😔", "ফাইল খোলা যায়নি।<br><small>প্রথমবার ইন্টারনেট চালু রাখুন (প্রয়োজনীয় ফাইল নামাতে), তারপর আবার চেষ্টা করুন।</small>", true);
    });
  }

  /* ---------- সূচি-মেনু ---------- */
  function listItems() {
    var q = norm($("q").value), items = [], i;
    var numQ = /^\d+$/.test(q) ? q : null;
    if (S.tab === "s") {
      for (i = 0; i < 114; i++) {
        var ok = !q || (numQ ? String(i + 1).indexOf(numQ) === 0 : (norm(SB[i]).indexOf(q) > -1 || norm(SE[i]).indexOf(q) > -1));
        if (ok) items.push({ n: i + 1, t: SB[i], sm: SE[i], p: SP[i] });
      }
    } else {
      for (i = 0; i < 30; i++) {
        var ok2 = !q || (numQ ? String(i + 1).indexOf(numQ) === 0 : norm(PN[i]).indexOf(q) > -1);
        if (ok2) items.push({ n: i + 1, t: "পারা " + bd(i + 1), sm: PN[i], p: PS[i] });
      }
    }
    return { items: items, numQ: numQ };
  }
  function drawList() {
    var r = listItems(), h = "", cur = S.tab === "s" ? curSurah(S.page) + 1 : curPara(S.page) + 1;
    r.items.forEach(function (x) {
      h += '<button class="it' + (x.n === cur ? " on" : "") + '" data-p="' + x.p + '"><span class="n">' + bd(x.n) + '</span><span class="t">' + esc(x.t) + "<small>" + esc(x.sm) + '</small></span><span class="pg">পৃষ্ঠা ' + bd(x.p) + "</span></button>";
    });
    if (r.numQ && +r.numQ >= 1 && +r.numQ <= (NUM || EXPECT_PAGES)) {
      h = '<button class="it" data-p="' + (+r.numQ) + '"><span class="n">↪</span><span class="t">পৃষ্ঠা ' + bd(+r.numQ) + '-এ যান</span></button>' + h;
    }
    $("l").innerHTML = h || '<div class="em">কিছু পাওয়া যায়নি</div>';
  }
  function markList() {
    if (!ov.classList.contains("mo")) return;
    drawList();
  }
  function openMenu() { ov.classList.add("mo"); drawList(); var a = $("l").querySelector(".it.on"); if (a && a.scrollIntoView) a.scrollIntoView({ block: "center" }); }
  function closeMenu() { ov.classList.remove("mo"); }
  function dirLabel() {
    $("dir").textContent = S.rtl ? "↔ এখন: ডানে টানলে পরের পাতা" : "↔ এখন: বামে টানলে পরের পাতা";
  }

  /* ---------- ইভেন্ট ---------- */
  var opened = false;
  function openIt() {
    if (opened) return;
    opened = true;
    ov.style.display = "flex";
    try { history.pushState({ tlw: 1 }, ""); } catch (e) {}
    start();
  }
  function closeIt() {
    if (!opened) return;
    opened = false;
    closeMenu();
    ov.style.display = "none";
  }
  $("x").onclick = function () {
    var had = false;
    try { had = history.state && history.state.tlw; } catch (e) {}
    if (had) history.back(); else closeIt();
  };
  window.addEventListener("popstate", function () { if (opened) closeIt(); });

  $("m").onclick = openMenu;
  $("mx").onclick = closeMenu;
  $("bk").onclick = closeMenu;
  $("p").onchange = function () { if (DOC) go(this.value); };
  $("p").onkeydown = function (e) { if (e.key === "Enter") this.blur(); };
  $("r").oninput = function () { $("p").value = this.value; };
  $("r").onchange = function () { if (DOC) go(this.value); };
  $("q").oninput = drawList;
  $("ts").onclick = function () { S.tab = "s"; $("ts").className = "on"; $("tp").className = ""; drawList(); };
  $("tp").onclick = function () { S.tab = "p"; $("tp").className = "on"; $("ts").className = ""; drawList(); };
  $("l").onclick = function (e) {
    var b = e.target.closest ? e.target.closest(".it") : null;
    if (!b || !DOC) return;
    closeMenu();
    go(parseInt(b.getAttribute("data-p"), 10));
  };
  $("dir").onclick = function () {
    S.rtl = !S.rtl; ls("tlw-dir", S.rtl ? "rtl" : "ltr"); dirLabel(); applyDir();
  };
  $("chg").onclick = function () {
    closeMenu();
    info("📖", "নতুন PDF বেছে নিন।<br><small>আগেরটি বদলে যাবে।</small>", true);
    DOC = null;
  };
  function applyDir() { $("r").style.direction = S.rtl ? "rtl" : "ltr"; }
  dirLabel(); applyDir();

  // আঙুল দিয়ে পাতা উল্টানো (Pointer Events) + ডবল ট্যাপে বড় করা
  var sg0 = $("s"), px = 0, py = 0, pid = null, pt = 0, lastTap = 0;
  sg0.addEventListener("pointerdown", function (e) {
    if (Z > 1) return;
    px = e.clientX; py = e.clientY; pid = e.pointerId; pt = Date.now();
  });
  sg0.addEventListener("pointercancel", function () { pid = null; });
  sg0.addEventListener("pointerup", function (e) {
    if (Z > 1) {
      var now2 = Date.now();
      if (now2 - lastTap < 300) { zoomToggle(); lastTap = 0; } else lastTap = now2;
      return;
    }
    if (pid !== e.pointerId) return;
    pid = null;
    var dx = e.clientX - px, dy = e.clientY - py;
    if (Math.abs(dx) > 50 && Math.abs(dx) > 1.4 * Math.abs(dy)) {
      flip((dx > 0) === S.rtl ? 1 : -1);
      lastTap = 0;
    } else if (Math.abs(dx) < 12 && Math.abs(dy) < 12 && Date.now() - pt < 350) {
      var now = Date.now();
      if (now - lastTap < 300) { zoomToggle(); lastTap = 0; } else lastTap = now;
    }
  });
  function zoomToggle() {
    if (!DOC) return;
    Z = Z > 1 ? 1 : 2.2;
    stage().classList.toggle("z", Z > 1);
    show(S.page, 0);
  }
  document.addEventListener("keydown", function (e) {
    if (!opened || ov.classList.contains("mo")) return;
    if (e.target && e.target.tagName === "INPUT") return;
    if (e.key === "ArrowLeft") flip(S.rtl ? 1 : -1);
    else if (e.key === "ArrowRight") flip(S.rtl ? -1 : 1);
  });
  window.addEventListener("resize", function () { if (opened && DOC) { cache = {}; order = []; show(S.page, 0); } });

  /* ---------- কুরআন ফিচারের ভেতরে কার্ড ---------- */
  function cardHtml() {
    var p = parseInt(ls("tlw-page"), 10);
    return '<span class="ci">🕌</span><span class="ct"><b>তেলাওয়াত</b><small>আপনার হাফেজী কুরআন · হুবহু পৃষ্ঠা, আঙুলে পাতা উল্টান' +
      (p > 2 ? " · চালিয়ে যান: পৃষ্ঠা " + bd(p) : "") + '</small></span><span class="cg">◀</span>';
  }
  function mountCard() {
    var app = document.getElementById("app");
    if (!app) return;
    var anchor = app.querySelector(".qtabs");
    if (!anchor) return;
    var c = app.querySelector("#tlw-card"), m = app.querySelector("#mfm-card");
    if (!c) {
      c = document.createElement("button");
      c.id = "tlw-card";
      c.innerHTML = cardHtml();
      c.onclick = openIt;
      anchor.parentNode.insertBefore(c, anchor.nextSibling);
      setTimeout(prefetchLib, 2500);
    }
    // "তেলাওয়াত" কার্ড সবার ওপরে থাকুক
    if (m && m.compareDocumentPosition(c) & Node.DOCUMENT_POSITION_FOLLOWING) m.parentNode.insertBefore(c, m);
  }
  function prefetchLib() {
    if (!navigator.onLine) return;
    ["pdf.min.js", "pdf.worker.min.js", "jbig2.wasm", "openjpeg.wasm", "qcms_bg.wasm"].forEach(function (f) {
      fetch(BASE + f).catch(function () {});
    });
  }
  function watch() {
    var app = document.getElementById("app");
    mountCard();
    if (app && window.MutationObserver) new MutationObserver(function () { mountCard(); }).observe(app, { childList: true });
  }
  function mount() { document.body.appendChild(ov); watch(); }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);

  window.__tlw = { go: go, S: S, open: openIt, flip: flip };
})();
