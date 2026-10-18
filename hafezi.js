/* আল-মিফতাহ: তেলাওয়াত (হাফেজী ধাঁচের ১৪ লাইনের কুরআন)
   নিজস্ব সাজানো: প্রতি পাতা ১৪ লাইন, আয়াতের শুরু থেকে শুরু ও শেষে শেষ, প্রতি পারা নতুন পাতায়।
   লেখা: api.alquran.cloud (উসমানি লিপি) · ফন্ট: Amiri Quran (OFL) */
(function () {
  "use strict";
  var API = "https://api.alquran.cloud/v1/";
  var LPP = 14, WPL = 8, LH = 2.1, VER = 1;
  var PN = ["আলিফ লাম মীম", "সাইয়াকূল", "তিলকার রুসুল", "লান তানালূ", "ওয়াল মুহসানাত", "লা ইউহিব্বুল্লাহ", "ওয়া ইযা সামিঊ", "ওয়া লাও আন্নানা", "কালাল মালাউ", "ওয়া'লামূ", "ইয়াতাযিরূন", "ওয়ামা মিন দাব্বাহ", "ওয়ামা উবাররিউ", "রুবামা", "সুবহানাল্লাযী", "কালা আলাম", "ইকতারাবা", "কাদ আফলাহা", "ওয়া কালাল্লাযীনা", "আম্মান খালাক্বা", "উতলু মা উহিয়া", "ওয়া মান ইয়াকনুত", "ওয়া মা লিয়া", "ফামান আযলামু", "ইলাইহি ইউরাদ্দু", "হা-মীম", "কালা ফামা খাতবুকুম", "কাদ সামিআল্লাহু", "তাবারাকাল্লাযী", "আম্মা"];
  var SB = ["আল-ফাতিহা", "আল-বাকারা", "আলে ইমরান", "আন-নিসা", "আল-মায়িদা", "আল-আনআম", "আল-আ'রাফ", "আল-আনফাল", "আত-তাওবা", "ইউনুস", "হূদ", "ইউসুফ", "আর-রা'দ", "ইবরাহীম", "আল-হিজর", "আন-নাহল", "বনী ইসরাঈল", "আল-কাহফ", "মারইয়াম", "ত্বা-হা", "আল-আম্বিয়া", "আল-হাজ্জ", "আল-মুমিনূন", "আন-নূর", "আল-ফুরকান", "আশ-শু'আরা", "আন-নামল", "আল-কাসাস", "আল-আনকাবূত", "আর-রূম", "লুকমান", "আস-সাজদা", "আল-আহযাব", "সাবা", "ফাতির", "ইয়া-সীন", "আস-সাফফাত", "ছোয়াদ", "আয-যুমার", "আল-মুমিন (গাফির)", "হা-মীম আস-সাজদা", "আশ-শূরা", "আয-যুখরুফ", "আদ-দুখান", "আল-জাসিয়া", "আল-আহকাফ", "মুহাম্মাদ", "আল-ফাতহ", "আল-হুজুরাত", "ক্বাফ", "আয-যারিয়াত", "আত-তূর", "আন-নাজম", "আল-ক্বামার", "আর-রহমান", "আল-ওয়াক্বিয়া", "আল-হাদীদ", "আল-মুজাদালা", "আল-হাশর", "আল-মুমতাহিনা", "আস-সাফ", "আল-জুমু'আ", "আল-মুনাফিকূন", "আত-তাগাবুন", "আত-তালাক্ব", "আত-তাহরীম", "আল-মুলক", "আল-ক্বালাম", "আল-হাক্কাহ", "আল-মা'আরিজ", "নূহ", "আল-জিন", "আল-মুযযাম্মিল", "আল-মুদ্দাসসির", "আল-ক্বিয়ামাহ", "আদ-দাহর", "আল-মুরসালাত", "আন-নাবা", "আন-নাযি'আত", "আবাসা", "আত-তাকবীর", "আল-ইনফিতার", "আল-মুতাফফিফীন", "আল-ইনশিক্বাক", "আল-বুরূজ", "আত-তারিক্ব", "আল-আ'লা", "আল-গাশিয়াহ", "আল-ফাজর", "আল-বালাদ", "আশ-শামস", "আল-লাইল", "আয-যোহা", "আল-ইনশিরাহ", "আত-তীন", "আল-আলাক্ব", "আল-ক্বদর", "আল-বাইয়্যিনাহ", "আয-যিলযাল", "আল-আদিয়াত", "আল-ক্বারি'আহ", "আত-তাকাসুর", "আল-আসর", "আল-হুমাযাহ", "আল-ফীল", "কুরাইশ", "আল-মা'ঊন", "আল-কাউসার", "আল-কাফিরূন", "আন-নাসর", "আল-মাসাদ", "আল-ইখলাস", "আল-ফালাক্ব", "আন-নাস"];
  var SE = ["Al-Fatihah", "Al-Baqarah", "Ali Imran", "An-Nisa", "Al-Maidah", "Al-Anam", "Al-Araf", "Al-Anfal", "At-Tawbah", "Yunus", "Hud", "Yusuf", "Ar-Rad", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra Bani Israil", "Al-Kahf", "Maryam", "Ta-Ha", "Al-Anbiya", "Al-Hajj", "Al-Muminun", "An-Nur", "Al-Furqan", "Ash-Shuara", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum", "Luqman", "As-Sajdah", "Al-Ahzab", "Saba", "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir Al-Mumin", "Fussilat Ha-Mim Sajdah", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf", "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqiah", "Al-Hadid", "Al-Mujadilah", "Al-Hashr", "Al-Mumtahanah", "As-Saff", "Al-Jumuah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Maarij", "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir", "Al-Qiyamah", "Al-Insan Ad-Dahr", "Al-Mursalat", "An-Naba", "An-Naziat", "Abasa", "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-Ala", "Al-Ghashiyah", "Al-Fajr", "Al-Balad", "Ash-Shams", "Al-Layl", "Ad-Duha", "Ash-Sharh Al-Inshirah", "At-Tin", "Al-Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-Adiyat", "Al-Qariah", "At-Takathur", "Al-Asr", "Al-Humazah", "Al-Fil", "Quraysh", "Al-Maun", "Al-Kawthar", "Al-Kafirun", "An-Nasr", "Al-Masad Lahab", "Al-Ikhlas", "Al-Falaq", "An-Nas"];
  var KNOWN = {
    "ar.alafasy": "মিশারি আল-আফাসী", "ar.abdulbasitmurattal": "আব্দুল বাসিত (মুরাত্তাল)",
    "ar.husary": "খলিল আল-হুসারী", "ar.minshawi": "মুহাম্মদ আল-মিনশাবি",
    "ar.shaatree": "আবু বকর আশ-শাতরী", "ar.mahermuaiqly": "মাহের আল-মুয়াইকিলি",
    "ar.abdurrahmaansudais": "আবদুর রহমান আস-সুদাইস", "ar.saoodshuraym": "সউদ আশ-শুরাইম",
    "ar.hudhaify": "আলী আল-হুযাইফী", "ar.muhammadayyoub": "মুহাম্মদ আইয়ুব", "ar.ahmedajamy": "আহমদ আল-আজমী"
  };
  var BASM = "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ";

  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; }
  function bd(n) { return String(n).replace(/\d/g, function (d) { return "০১২৩৪৫৬৭৮৯".charAt(d); }); }
  function ad(n) { return String(n).replace(/\d/g, function (d) { return "٠١٢٣٤٥٦٧٨٩".charAt(d); }); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function norm(s) {
    return String(s).toLowerCase().replace(/[০-৯]/g, function (d) { return "০১২৩৪৫৬৭৮৯".indexOf(d); }).replace(/[-'’‘`\s.]/g, "");
  }
  function jget(url) {
    return fetch(url).then(function (r) { if (!r.ok) throw new Error("http"); return r.json(); })
      .then(function (j) { if (!j || j.code !== 200 || !j.data) throw new Error("bad"); return j.data; });
  }

  /* ---------- IndexedDB (লেখা ও পাতা-ভাগ ফোনেই জমা) ---------- */
  function idb() {
    return new Promise(function (res, rej) {
      var r = indexedDB.open("almiftah-hfz", 1);
      r.onupgradeneeded = function () { r.result.createObjectStore("f"); };
      r.onsuccess = function () { res(r.result); };
      r.onerror = function () { rej(r.error); };
    });
  }
  function idbGet(k) {
    return idb().then(function (db) { return new Promise(function (res, rej) {
      var q = db.transaction("f", "readonly").objectStore("f").get(k);
      q.onsuccess = function () { res(q.result); }; q.onerror = function () { rej(q.error); };
    }); });
  }
  function idbSet(k, v) {
    return idb().then(function (db) { return new Promise(function (res, rej) {
      var t = db.transaction("f", "readwrite"); t.objectStore("f").put(v, k);
      t.oncomplete = function () { res(); }; t.onerror = function () { rej(t.error); };
    }); });
  }

  /* ---------- লেখা আনা ---------- */
  var AY = null, AN = null, PAGES = null, SPG = null, PPG = null; // আয়াত, সূরার আরবি নাম, পাতা, সূরা/পারার শুরুর পাতা
  var LETTER = /[\u0621-\u064A\u0671-\u06D3]/;
  function words(t) {
    var c = 0, tk = t.split(" ");
    for (var i = 0; i < tk.length; i++) if (LETTER.test(tk[i])) c++;
    return c;
  }
  function strip(a, s) {
    var t = a.text;
    if (a.numberInSurah === 1 && s !== 1 && s !== 9) {
      var tk = t.split(" ");
      var base = (tk[0] || "").replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "");
      if (base === "بسم" && tk.length > 4) t = tk.slice(4).join(" ");
    }
    return t;
  }
  function fetchAll() {
    return fetch(API + "quran/quran-uthmani").then(function (r) { if (!r.ok) throw new Error("http"); return r.json(); }).then(function (j) {
      if (!j || j.code !== 200 || !j.data || !j.data.surahs) throw new Error("bad");
      var ay = [], an = [];
      j.data.surahs.forEach(function (s) {
        an[s.number] = s.name;
        s.ayahs.forEach(function (a) { ay.push([a.number, s.number, a.numberInSurah, a.juz, strip(a, s.number)]); });
      });
      return { v: VER, ay: ay, an: an };
    });
  }

  /* ---------- পাতা ভাগ (সব ফোনে একই ফল, শুধু লেখার ওপর নির্ভর) ---------- */
  function weightOf(i) {
    var A = AY[i], w = words(A[4]) / WPL;
    if (A[2] === 1) w += (A[1] === 9 ? 2 : (A[1] === 1 ? 2 : 3)); // সূরার ব্যানার ২ লাইন + বিসমিল্লাহ ১ লাইন
    return w;
  }
  function splitRange(st, en, out) {
    var m = en - st, c = [0], i;
    for (i = 0; i < m; i++) c.push(c[i] + weightOf(st + i));
    var L = c[m], k = Math.max(1, Math.round(L / LPP));
    if (k === 1) { out.push([st, en]); return; }
    var T = L / k, cand = [], r, t;
    for (r = 1; r < k; r++) {
      var ideal = r * T, list = [], bestT = 1, bd2 = 1e9;
      for (t = 1; t < m; t++) {
        var d = Math.abs(c[t] - ideal);
        if (d < bd2) { bd2 = d; bestT = t; }
        if (d <= LPP * 0.5) list.push(t);
      }
      if (!list.length) list.push(bestT);
      cand.push(list);
    }
    // গতিশীল হিসাব: প্রতি পাতার ওজন লক্ষ্যের কাছাকাছি রাখা
    var prev = [{ t: 0, cost: 0, from: -1 }], layers = [prev];
    cand.forEach(function (list) {
      var cur = list.map(function (tt) {
        var best = 1e18, bf = -1;
        prev.forEach(function (p, pi) {
          if (p.t < tt) {
            var cost = p.cost + Math.pow(c[tt] - c[p.t] - T, 2);
            if (cost < best) { best = cost; bf = pi; }
          }
        });
        return { t: tt, cost: best, from: bf };
      }).filter(function (x) { return x.from >= 0; });
      if (!cur.length) cur = [{ t: prev[prev.length - 1].t + 1, cost: 1e17, from: prev.length - 1 }];
      layers.push(cur); prev = cur;
    });
    var bi = -1, bc = 1e18;
    prev.forEach(function (p, pi) {
      var cost = p.cost + Math.pow(L - c[p.t] - T, 2);
      if (p.t < m && cost < bc) { bc = cost; bi = pi; }
    });
    if (bi < 0) bi = 0;
    var cuts = [], li = layers.length - 1, idx = bi;
    while (li > 0) { cuts.unshift(layers[li][idx].t); idx = layers[li][idx].from; li--; }
    var s0 = 0;
    cuts.forEach(function (ct) { out.push([st + s0, st + ct]); s0 = ct; });
    out.push([st + s0, en]);
  }
  function paginate() {
    var pages = [], i = 0, n = AY.length;
    while (i < n && AY[i][1] === 1) i++;
    pages.push([0, i]);                            // ১ম পাতা: সূরা ফাতিহা
    for (var j = 1; j <= 30; j++) {
      var st = i;
      while (i < n && AY[i][3] === j) i++;
      if (i > st) splitRange(st, i, pages);
    }
    PAGES = pages;
    SPG = []; PPG = [];
    var seenS = {}, pageOfAyah = new Array(n), p, x;
    for (p = 0; p < pages.length; p++) for (x = pages[p][0]; x < pages[p][1]; x++) pageOfAyah[x] = p + 1;
    for (x = 0; x < n; x++) {
      if (AY[x][2] === 1 && !seenS[AY[x][1]]) { seenS[AY[x][1]] = 1; SPG[AY[x][1] - 1] = pageOfAyah[x]; }
      if (PPG[AY[x][3] - 1] === undefined) PPG[AY[x][3] - 1] = pageOfAyah[x];
    }
  }
  function curSurahIdx(p) {
    var best = 0, bp = -1;
    for (var i = 0; i < SPG.length; i++) if (SPG[i] <= p && SPG[i] > bp) { bp = SPG[i]; best = i; }
    return best;
  }
  function curParaIdx(p) {
    var b = 0;
    for (var i = 0; i < PPG.length; i++) if (PPG[i] <= p) b = i;
    return b;
  }

  /* ---------- ডিজাইন ---------- */
  var st = document.createElement("style");
  st.textContent =
    "#hzw{position:fixed;inset:0;z-index:10002;display:none;flex-direction:column;background:#ddd5b8;color:#1c1a14;font-family:inherit}" +
    "#hzw *{box-sizing:border-box}" +
    "#hzw button{font:inherit}" +
    "#hzw .tb{display:flex;gap:6px;align-items:center;padding:8px 10px;padding-top:max(8px,env(safe-area-inset-top,0px));background:linear-gradient(#1b6e45,#145132);color:#fff;box-shadow:0 2px 6px rgba(0,0,0,.3);z-index:3}" +
    "#hzw .tb button{border:0;border-radius:10px;padding:8px 12px;background:rgba(255,255,255,.18);color:#fff;font-size:16px}" +
    "#hzw .tb input{width:70px;padding:8px 4px;text-align:center;border:0;border-radius:10px;background:rgba(255,255,255,.18);color:#fff;font:inherit;font-weight:700}" +
    "#hzw .tb .of{font-size:12px;opacity:.9}" +
    "#hzw .tb .lb{flex:1;min-width:0;text-align:center;font-size:13px;line-height:1.25;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}" +
    "#hzw .stg{position:relative;flex:1;overflow:hidden;touch-action:pan-y;background:radial-gradient(circle at 50% 20%,#efe8cf,#d6cdb0)}" +
    "#hzw .pw{position:absolute;inset:0;overflow:auto;padding:12px 8px 18px;transition:transform .26s ease;-webkit-overflow-scrolling:touch}" +
    "#hzw .pf{position:relative;margin:0 auto;background:linear-gradient(#fffaf0,#fbf3dc);border:3px solid #b8932f;border-radius:12px;padding:8px 10px 10px;box-shadow:0 4px 14px rgba(60,40,0,.3)}" +
    "#hzw .pf:before{content:'';position:absolute;inset:5px;border:1.5px solid #d5b85c;border-radius:8px;pointer-events:none}" +
    "#hzw .hzp{display:flex;justify-content:space-between;align-items:center;direction:rtl;padding:3px 6px 5px;margin-bottom:4px;border-bottom:1.5px solid #d5b85c;color:#7a5f10;font-size:13px;font-family:'Amiri Quran','Noto Naskh Arabic',serif}" +
    "#hzw .hbx{position:relative;height:calc(" + LPP + " * " + LH + "em);overflow:hidden;font-family:'Amiri Quran','Scheherazade New','Noto Naskh Arabic','Traditional Arabic',serif;line-height:" + LH + ";color:#1c1a14}" +
    "#hzw .htx{direction:rtl;text-align:justify;text-align-last:right}" +
    "#hzw .hay{cursor:pointer;border-radius:5px;transition:background .2s}" +
    "#hzw .hay.on{background:rgba(23,96,60,.24)}" +
    "#hzw .hno{display:inline-block;min-width:1.55em;height:1.55em;line-height:1.4em;margin:0 2px;text-align:center;border:1.2px solid #b8932f;border-radius:50%;color:#8a6a0c;font-size:.55em;vertical-align:middle;background:#fff8df}" +
    "#hzw .hsh{height:calc(" + (2 * LH) + "em);display:flex;align-items:center;justify-content:center;direction:rtl;border-radius:8px;background:linear-gradient(90deg,#e8d58f,#f7ecc0 50%,#e8d58f);border:2px solid #b8932f;color:#5a430a;font-size:1em;line-height:1}" +
    "#hzw .hsh:before,#hzw .hsh:after{content:'❖';color:#b8932f;font-size:.7em;margin:0 10px}" +
    "#hzw .hzb{height:calc(" + LH + "em);display:flex;align-items:center;justify-content:center;direction:rtl}" +
    "#hzw .pn{text-align:center;margin-top:6px}" +
    "#hzw .pn span{display:inline-block;min-width:42px;padding:2px 14px;border:2px solid #b8932f;border-radius:20px;background:#fff8df;color:#7a5f10;font-weight:700;font-size:13px}" +
    "#hzw .msg{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:24px;text-align:center;line-height:1.6;color:#3a3420}" +
    "#hzw .msg .big{font-size:44px}" +
    "#hzw .msg button{padding:10px 20px;border:0;border-radius:12px;background:#17603c;color:#fff}" +
    "#hzw .st{padding:3px 10px;font-size:12px;color:#6b6448;text-align:center;min-height:20px;background:#d6cdb0}" +
    "#hzw .pl{display:flex;gap:6px;align-items:center;padding:8px 10px;padding-bottom:max(8px,env(safe-area-inset-bottom,0px));background:linear-gradient(#1b6e45,#145132);color:#fff}" +
    "#hzw .pl button,#hzw .pl select{border:0;border-radius:12px;padding:10px 12px;background:rgba(255,255,255,.2);color:#fff}" +
    "#hzw .pl #hz-pp{background:#f4c542;color:#1c1a14;font-size:18px;min-width:50px}" +
    "#hzw .pl select{flex:1;min-width:0;width:auto}" +
    "#hzw .pl button.on{background:#f4c542;color:#1c1a14}" +
    "#hzw select option{color:#000}" +
    "#hzw .bk{position:absolute;inset:0;background:rgba(0,0,0,.45);opacity:0;pointer-events:none;transition:opacity .2s;z-index:4}" +
    "#hzw .mn{position:absolute;top:0;bottom:0;left:0;width:min(88%,380px);background:#fbf6e6;z-index:5;transform:translateX(-102%);transition:transform .24s ease;display:flex;flex-direction:column;box-shadow:4px 0 18px rgba(0,0,0,.35)}" +
    "#hzw.mo .bk{opacity:1;pointer-events:auto}#hzw.mo .mn{transform:none}" +
    "#hzw .mh{display:flex;align-items:center;gap:8px;padding:12px;padding-top:max(12px,env(safe-area-inset-top,0px));background:linear-gradient(#1b6e45,#145132);color:#fff}" +
    "#hzw .mh b{flex:1;font-size:17px}" +
    "#hzw .mh button{border:0;border-radius:10px;padding:6px 12px;background:rgba(255,255,255,.2);color:#fff}" +
    "#hzw .sr{padding:10px 12px 6px}" +
    "#hzw .sr input{width:100%;padding:10px 12px;border:1.5px solid #c9bd8f;border-radius:10px;font:inherit;background:#fff;color:#1c1a14}" +
    "#hzw .tabs{display:flex;gap:8px;padding:4px 12px 8px}" +
    "#hzw .tabs button{flex:1;padding:9px;border:1.5px solid #c9bd8f;border-radius:10px;background:#f4edd2;color:#3a3420}" +
    "#hzw .tabs button.on{background:#17603c;border-color:#17603c;color:#fff}" +
    "#hzw .ls{flex:1;overflow:auto;padding:0 8px 12px;-webkit-overflow-scrolling:touch}" +
    "#hzw .it{display:flex;align-items:center;gap:10px;width:100%;text-align:left;padding:10px;margin:0 0 6px;border:1px solid #e0d6b0;border-radius:10px;background:#fff;color:#1c1a14}" +
    "#hzw .it.on{background:#e3f1e8;border-color:#17603c}" +
    "#hzw .it .n{min-width:34px;height:34px;line-height:34px;text-align:center;border-radius:50%;background:#f1e7c2;border:1.5px solid #b8932f;color:#6b4f08;font-size:13px;font-weight:700}" +
    "#hzw .it .t{flex:1;min-width:0}#hzw .it .t small{display:block;color:#7a735a;font-size:12px}" +
    "#hzw .it .pg{font-size:12px;color:#17603c;white-space:nowrap}" +
    "#hzw .em{padding:18px 8px;text-align:center;color:#7a735a}" +
    "#hzw .ft{display:flex;flex-wrap:wrap;gap:6px;padding:8px 12px;padding-bottom:max(8px,env(safe-area-inset-bottom,0px));border-top:1px solid #e0d6b0;background:#f4edd2}" +
    "#hzw .ft button{flex:1;min-width:110px;padding:8px;border:1px solid #c9bd8f;border-radius:10px;background:#fff;font-size:13px;color:#3a3420}" +
    "#hz-card{display:flex;align-items:center;gap:12px;width:100%;margin:12px 0;padding:14px 16px;border:2px solid #d8b64a;border-radius:16px;background:linear-gradient(135deg,#5b3a12,#8a5a1a 60%,#a8741f);color:#fff;text-align:left;font:inherit;cursor:pointer;box-shadow:0 4px 12px rgba(91,58,18,.35)}" +
    "#hz-card .ci{font-size:38px;line-height:1}#hz-card .ct{flex:1;min-width:0}" +
    "#hz-card b{display:block;font-size:18px;color:#fff1b8}#hz-card small{display:block;margin-top:2px;font-size:13px;opacity:.95}" +
    "#hz-card .cg{font-size:22px;color:#f4c542}";
  document.head.appendChild(st);
  var fl = document.createElement("link");
  fl.rel = "stylesheet"; fl.href = "https://fonts.googleapis.com/css2?family=Amiri+Quran&display=swap";
  document.head.appendChild(fl);

  var ov = document.createElement("div");
  ov.id = "hzw";
  ov.innerHTML =
    '<div class="tb"><button id="hz-m" aria-label="সূচি">☰</button>' +
    '<input id="hz-p" type="number" min="1" inputmode="numeric" aria-label="পৃষ্ঠা নম্বর"><span class="of" id="hz-of"></span>' +
    '<div class="lb" id="hz-lb"></div>' +
    '<button id="hz-zm" aria-label="ছোট">A−</button><button id="hz-zp" aria-label="বড়">A+</button>' +
    '<button id="hz-x" aria-label="বন্ধ">✕</button></div>' +
    '<div class="stg" id="hz-s"></div>' +
    '<div class="st" id="hz-st"></div>' +
    '<div class="pl"><button id="hz-nx" aria-label="পরের পাতা">❮</button><button id="hz-pp" aria-label="চালান">▶</button>' +
    '<select id="hz-rec" aria-label="কারী"></select>' +
    '<button id="hz-auto" aria-label="পরের পাতায় নিজে যাও">⏭</button><button id="hz-pv" aria-label="আগের পাতা">❯</button></div>' +
    '<div class="bk" id="hz-bk"></div>' +
    '<div class="mn"><div class="mh"><b>সূচি</b><button id="hz-mx">✕ বন্ধ</button></div>' +
    '<div class="sr"><input id="hz-q" type="search" placeholder="সূরা বা পারার নাম/নম্বর লিখুন…" autocomplete="off"></div>' +
    '<div class="tabs"><button id="hz-ts" class="on">সূরা (১১৪)</button><button id="hz-tp">পারা (৩০)</button></div>' +
    '<div class="ls" id="hz-l"></div>' +
    '<div class="ft"><button id="hz-dir"></button><button id="hz-rl">🔄 লেখা আবার নামান</button></div></div>';
  function $(id) { return ov.querySelector("#hz-" + id); }
  function say(t) { $("st").textContent = t || ""; }

  /* ---------- অবস্থা ---------- */
  var S = { page: parseInt(ls("hfz-page"), 10) || 1, rec: ls("hfz-rec") || "ar.alafasy", rtl: ls("hfz-dir") !== "ltr", nxt: ls("hfz-auto") !== "0", zi: parseInt(ls("hfz-z"), 10) || 0, tab: "s" };
  var ZS = [1, 1.25, 1.5, 1.8];
  var token = 0, curEl = null;

  /* ---------- পাতা আঁকা ---------- */
  function pageHtml(pi) {
    var pr = PAGES[pi - 1], a = pr[0], b = pr[1], h = '<div class="hbx" id="hz-box">', tx = false, x;
    function openTx() { if (!tx) { h += '<div class="htx">'; tx = true; } }
    function closeTx() { if (tx) { h += "</div>"; tx = false; } }
    for (x = a; x < b; x++) {
      var A = AY[x];
      if (A[2] === 1) {
        closeTx();
        h += '<div class="hsh">' + esc(AN[A[1]] || "") + "</div>";
        if (A[1] !== 1 && A[1] !== 9) h += '<div class="hzb">' + BASM + "</div>";
      }
      openTx();
      h += '<span class="hay" data-x="' + x + '">' + esc(A[4]) + ' <span class="hno">' + ad(A[2]) + "</span></span> ";
    }
    closeTx();
    h += "</div>";
    var first = AY[a];
    return '<div class="pf"><div class="hzp"><b>' + esc(AN[first[1]] || "") + "</b><span>الجزء " + ad(first[3]) + "</span></div>" + h +
      '<div class="pn"><span>' + bd(pi) + "</span></div></div>";
  }
  function fitBox(box, maxF) {
    var lo = 8, hi = maxF;
    box.style.fontSize = hi + "px";
    if (box.scrollHeight <= box.clientHeight + 1) return hi;
    for (var i = 0; i < 9; i++) {
      var mid = (lo + hi) / 2;
      box.style.fontSize = mid + "px";
      if (box.scrollHeight <= box.clientHeight + 1) lo = mid; else hi = mid;
    }
    box.style.fontSize = lo + "px";
    return lo;
  }
  function buildPage(pi) {
    var sg = $("s"), wrap = document.createElement("div");
    wrap.className = "pw";
    wrap.innerHTML = pageHtml(pi);
    var pf = wrap.firstChild, z = ZS[S.zi] || 1;
    var wBase = Math.min(sg.clientWidth - 16, 560);
    pf.style.width = Math.round(wBase * z) + "px";
    sg.appendChild(wrap);
    var box = wrap.querySelector(".hbx");
    fitBox(box, pi === 1 ? 30 : 28);
    wrap.parentNode.removeChild(wrap);
    return wrap;
  }
  function place(wrap, exitDir) {
    var sg = $("s"), old = sg.querySelector(".pw");
    var msg = sg.querySelector(".msg"); if (msg) sg.removeChild(msg);
    if (!old || !exitDir) {
      while (sg.firstChild) sg.removeChild(sg.firstChild);
      sg.appendChild(wrap); curEl = wrap;
      return;
    }
    var W = sg.clientWidth;
    wrap.style.transition = "none";
    wrap.style.transform = "translateX(" + (-exitDir * W) + "px)";
    sg.appendChild(wrap);
    void wrap.offsetWidth;
    wrap.style.transition = "";
    wrap.style.transform = "none";
    old.style.transform = "translateX(" + (exitDir * W) + "px)";
    curEl = wrap;
    setTimeout(function () { if (old.parentNode === sg) sg.removeChild(old); }, 320);
    var all = sg.querySelectorAll(".pw");
    for (var i = 0; i < all.length; i++) if (all[i] !== wrap && all[i] !== old) sg.removeChild(all[i]);
  }
  function labels() {
    var p = S.page, s = curSurahIdx(p), k = curParaIdx(p);
    $("p").value = p;
    $("lb").textContent = "পারা " + bd(k + 1) + " · " + SB[s];
    if (ov.classList.contains("mo")) drawList();
  }
  function go(n, exitDir, autoplay) {
    n = parseInt(n, 10);
    if (!(n >= 1)) n = 1;
    if (n > PAGES.length) n = PAGES.length;
    stopAudio();
    S.page = n; ls("hfz-page", n);
    labels();
    var my = ++token;
    var wrap = buildPage(n);
    if (my !== token) return;
    place(wrap, exitDir || 0);
    wrap.scrollTop = 0;
    if (autoplay) startAt(PAGES[n - 1][0]);
  }
  function flip(delta, autoplay) {
    var n = S.page + delta;
    if (n < 1 || n > PAGES.length) return;
    var finger = (delta > 0) === S.rtl ? 1 : -1;
    go(n, finger, autoplay);
  }

  /* ---------- অডিও ---------- */
  var au = new Audio(), AUDC = {}, q = [], qi = -1, playing = false, paused = false, tokPlay = 0;
  function setPlaying(b) { playing = b; $("pp").textContent = b ? "⏸" : "▶"; }
  function mark(x) {
    var o = ov.querySelector(".hay.on"); if (o) o.classList.remove("on");
    var n = ov.querySelector('.hay[data-x="' + x + '"]');
    if (n) { n.classList.add("on"); try { n.scrollIntoView({ block: "nearest", behavior: "smooth" }); } catch (e) {} }
  }
  function stopAudio() {
    tokPlay++; au.onended = null; au.onerror = null;
    try { au.pause(); } catch (e) {}
    paused = false; qi = -1; setPlaying(false);
    var o = ov.querySelector(".hay.on"); if (o) o.classList.remove("on");
  }
  function loadAudio(pi) {
    var pr = PAGES[pi - 1], need = [], x;
    for (x = pr[0]; x < pr[1]; x++) if (need.indexOf(AY[x][1]) < 0) need.push(AY[x][1]);
    return Promise.all(need.map(function (s) {
      var key = S.rec + ":" + s;
      if (AUDC[key]) return Promise.resolve(AUDC[key]);
      return jget(API + "surah/" + s + "/" + S.rec).then(function (d) {
        var m = {};
        d.ayahs.forEach(function (y) { m[y.numberInSurah] = [y.audio].concat(y.audioSecondary || []).filter(Boolean); });
        AUDC[key] = m; return m;
      });
    })).then(function (maps) {
      var out = [];
      for (var x2 = pr[0]; x2 < pr[1]; x2++) out.push({ x: x2, urls: maps[need.indexOf(AY[x2][1])][AY[x2][2]] || [] });
      return out;
    });
  }
  function startAt(x0) {
    var my = ++tokPlay;
    say("অডিও আনা হচ্ছে…");
    loadAudio(S.page).then(function (list) {
      if (my !== tokPlay) return;
      q = list; paused = false;
      var i0 = 0;
      for (var i = 0; i < q.length; i++) if (q[i].x >= x0) { i0 = i; break; }
      playIdx(i0);
    }).catch(function () {
      if (my !== tokPlay) return;
      say("এই কারীর অডিও আনা যায়নি। ইন্টারনেট দেখুন বা অন্য কারী বেছে নিন।");
      setPlaying(false);
    });
  }
  function playIdx(i) {
    if (i >= q.length) {
      if (S.nxt && S.page < PAGES.length) { flip(1, true); return; }
      stopAudio(); say("তেলাওয়াত শেষ");
      return;
    }
    qi = i; mark(q[i].x); setPlaying(true);
    var urls = q[i].urls, t = 0;
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
    say(""); tryUrl();
  }
  function toggle() {
    if (playing) { au.pause(); paused = true; setPlaying(false); }
    else if (paused && au.getAttribute("src")) { paused = false; setPlaying(true); au.play().catch(function () {}); }
    else startAt(PAGES[S.page - 1][0]);
  }
  function fillRec(list) {
    var sel = $("rec");
    sel.innerHTML = list.map(function (x) { return '<option value="' + esc(x[0]) + '">' + esc(x[1]) + "</option>"; }).join("");
    if (!list.some(function (x) { return x[0] === S.rec; })) S.rec = list[0][0];
    sel.value = S.rec;
  }
  fillRec(Object.keys(KNOWN).map(function (k) { return [k, KNOWN[k]]; }));
  fetch(API + "edition?format=audio&language=ar&type=versebyverse").then(function (r) { return r.json(); }).then(function (j) {
    if (!j || !j.data || !j.data.length) return;
    var have = {}, out = [];
    j.data.forEach(function (e) { have[e.identifier] = e; });
    Object.keys(KNOWN).forEach(function (k) { if (have[k]) out.push([k, KNOWN[k]]); });
    j.data.forEach(function (e) { if (!KNOWN[e.identifier]) out.push([e.identifier, e.englishName || e.name]); });
    if (out.length) fillRec(out);
  }).catch(function () {});

  /* ---------- সূচি-মেনু ---------- */
  function listItems() {
    var qv = norm($("q").value), items = [], i, numQ = /^\d+$/.test(qv) ? qv : null;
    if (S.tab === "s") {
      for (i = 0; i < 114; i++) {
        var ok = !qv || (numQ ? String(i + 1).indexOf(numQ) === 0 : (norm(SB[i]).indexOf(qv) > -1 || norm(SE[i]).indexOf(qv) > -1));
        if (ok) items.push({ n: i + 1, t: SB[i], sm: SE[i], p: SPG[i] });
      }
    } else {
      for (i = 0; i < 30; i++) {
        var ok2 = !qv || (numQ ? String(i + 1).indexOf(numQ) === 0 : norm(PN[i]).indexOf(qv) > -1);
        if (ok2) items.push({ n: i + 1, t: "পারা " + bd(i + 1), sm: PN[i], p: PPG[i] });
      }
    }
    return { items: items, numQ: numQ };
  }
  function drawList() {
    var r = listItems(), h = "", cur = S.tab === "s" ? curSurahIdx(S.page) + 1 : curParaIdx(S.page) + 1;
    r.items.forEach(function (x) {
      h += '<button class="it' + (x.n === cur ? " on" : "") + '" data-p="' + x.p + '"><span class="n">' + bd(x.n) + '</span><span class="t">' + esc(x.t) + "<small>" + esc(x.sm) + '</small></span><span class="pg">পৃষ্ঠা ' + bd(x.p) + "</span></button>";
    });
    if (r.numQ && +r.numQ >= 1 && +r.numQ <= PAGES.length) {
      h = '<button class="it" data-p="' + (+r.numQ) + '"><span class="n">↪</span><span class="t">পৃষ্ঠা ' + bd(+r.numQ) + "-এ যান</span></button>" + h;
    }
    $("l").innerHTML = h || '<div class="em">কিছু পাওয়া যায়নি</div>';
  }
  function openMenu() { ov.classList.add("mo"); drawList(); var a = $("l").querySelector(".it.on"); if (a && a.scrollIntoView) a.scrollIntoView({ block: "center" }); }
  function closeMenu() { ov.classList.remove("mo"); }
  function dirLabel() { $("dir").textContent = S.rtl ? "↔ ডানে টানলে পরের পাতা" : "↔ বামে টানলে পরের পাতা"; }

  /* ---------- চালু করা ---------- */
  function info(icon, html, btn) {
    var sg = $("s");
    stopAudio();
    sg.innerHTML = '<div class="msg"><div class="big">' + icon + "</div><div>" + html + "</div>" + (btn ? '<button id="hz-retry">আবার চেষ্টা করুন</button>' : "") + "</div>";
    var b = sg.querySelector("#hz-retry"); if (b) b.onclick = function () { loadData(true); };
  }
  function ready() {
    paginate();
    $("of").textContent = "/ " + bd(PAGES.length);
    $("p").max = PAGES.length;
    go(Math.min(S.page, PAGES.length));
  }
  function loadData(force) {
    info("⏳", "কুরআনের লেখা আনা হচ্ছে…");
    var p = force ? Promise.resolve(null) : idbGet("q").catch(function () { return null; });
    p.then(function (d) {
      if (d && d.v === VER && d.ay && d.ay.length > 6000) { AY = d.ay; AN = d.an; ready(); return; }
      return fetchAll().then(function (nd) {
        AY = nd.ay; AN = nd.an;
        idbSet("q", nd).catch(function () {});
        ready();
      });
    }).catch(function (err) {
      try { console.error("hafezi:", err && err.stack || err); } catch (e) {}
      info("😔", "লেখা আনা যায়নি।<br><small>প্রথমবার ইন্টারনেট চালু রাখতে হয়। এরপর ফোনে জমা থাকে, তখন ইন্টারনেট ছাড়াই চলবে।</small>", true);
    });
  }
  var opened = false;
  function openIt() {
    if (opened) return;
    opened = true; ov.style.display = "flex";
    try { history.pushState({ hz: 1 }, ""); } catch (e) {}
    if (PAGES) go(S.page); else loadData(false);
  }
  function closeIt() { if (!opened) return; opened = false; closeMenu(); stopAudio(); ov.style.display = "none"; }

  /* ---------- ইভেন্ট ---------- */
  $("x").onclick = function () { var had = false; try { had = history.state && history.state.hz; } catch (e) {} if (had) history.back(); else closeIt(); };
  window.addEventListener("popstate", function () { if (opened) closeIt(); });
  $("m").onclick = function () { if (PAGES) openMenu(); };
  $("mx").onclick = closeMenu; $("bk").onclick = closeMenu;
  $("p").onchange = function () { if (PAGES && parseInt(this.value, 10) !== S.page) go(this.value); };
  $("p").onkeydown = function (e) { if (e.key === "Enter") this.blur(); };
  $("q").oninput = drawList;
  $("ts").onclick = function () { S.tab = "s"; $("ts").className = "on"; $("tp").className = ""; drawList(); };
  $("tp").onclick = function () { S.tab = "p"; $("tp").className = "on"; $("ts").className = ""; drawList(); };
  $("l").onclick = function (e) {
    var b = e.target.closest ? e.target.closest(".it") : null;
    if (!b || !PAGES) return;
    closeMenu(); go(parseInt(b.getAttribute("data-p"), 10));
  };
  $("dir").onclick = function () { S.rtl = !S.rtl; ls("hfz-dir", S.rtl ? "rtl" : "ltr"); dirLabel(); };
  $("rl").onclick = function () { closeMenu(); loadData(true); };
  $("nx").onclick = function () { if (PAGES) flip(1); };
  $("pv").onclick = function () { if (PAGES) flip(-1); };
  $("pp").onclick = function () { if (PAGES) toggle(); };
  $("zm").onclick = function () { if (PAGES && S.zi > 0) { S.zi--; ls("hfz-z", S.zi); go(S.page); } };
  $("zp").onclick = function () { if (PAGES && S.zi < ZS.length - 1) { S.zi++; ls("hfz-z", S.zi); go(S.page); } };
  $("rec").onchange = function () { S.rec = this.value; ls("hfz-rec", S.rec); if (playing) startAt(q[Math.max(qi, 0)] ? q[Math.max(qi, 0)].x : PAGES[S.page - 1][0]); };
  $("auto").className = S.nxt ? "on" : "";
  $("auto").onclick = function () { S.nxt = !S.nxt; ls("hfz-auto", S.nxt ? "1" : "0"); this.className = S.nxt ? "on" : ""; };
  dirLabel();

  // আঙুলে পাতা উল্টানো + আয়াতে ট্যাপে তেলাওয়াত
  var sg0 = $("s"), px = 0, py = 0, pid = null, pt = 0;
  sg0.addEventListener("pointerdown", function (e) { if (S.zi > 0) return; px = e.clientX; py = e.clientY; pid = e.pointerId; pt = Date.now(); });
  sg0.addEventListener("pointercancel", function () { pid = null; });
  sg0.addEventListener("pointerup", function (e) {
    if (!PAGES || pid !== e.pointerId) return;
    pid = null;
    var dx = e.clientX - px, dy = e.clientY - py;
    if (Math.abs(dx) > 50 && Math.abs(dx) > 1.4 * Math.abs(dy)) flip((dx > 0) === S.rtl ? 1 : -1);
  });
  sg0.addEventListener("click", function (e) {
    if (!PAGES) return;
    var a = e.target.closest ? e.target.closest(".hay") : null;
    if (a) startAt(parseInt(a.getAttribute("data-x"), 10));
  });
  document.addEventListener("keydown", function (e) {
    if (!opened || !PAGES || ov.classList.contains("mo")) return;
    if (e.target && e.target.tagName === "INPUT") return;
    if (e.key === "ArrowLeft") flip(S.rtl ? 1 : -1); else if (e.key === "ArrowRight") flip(S.rtl ? -1 : 1);
  });
  window.addEventListener("resize", function () { if (opened && PAGES) go(S.page); });

  /* ---------- মূল পাতায়, "কুরআন" ঘরের ঠিক পাশে "তেলাওয়াত" ঘর ---------- */
  function mountTile() {
    var app = document.getElementById("app");
    if (!app) return;
    var q = app.querySelector('.g3 .tile[data-v="quran"]');
    if (!q) return;
    var t = app.querySelector("#hz-tile");
    if (!t) {
      t = document.createElement("button");
      t.className = "tile";
      t.id = "hz-tile";
      t.innerHTML = "<span>🕌</span><b>১৪ লাইনের কুরআন</b>";
      t.onclick = openIt;
    }
    var anchor = app.querySelector("#mfm-tile") || q;      // "তেলাওয়াত" ঘরের পরেই বসে
    if (anchor.nextSibling !== t) anchor.parentNode.insertBefore(t, anchor.nextSibling);
  }
  function watch() {
    var app = document.getElementById("app");
    mountTile();
    if (app && window.MutationObserver) new MutationObserver(function () { mountTile(); }).observe(app, { childList: true });
  }
  function mount() { document.body.appendChild(ov); watch(); }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);

  window.__hz = { go: go, S: S, open: openIt, flip: flip, pages: function () { return PAGES; }, spg: function () { return SPG; }, ppg: function () { return PPG; } };
})();
