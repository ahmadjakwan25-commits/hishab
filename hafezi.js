/* আল-মিফতাহ: ১৫ লাইনের কুরআন (হাফেজী ধাঁচ)
   প্রতি পাতা ১৫ লাইন, আয়াতের শুরু থেকে শুরু ও শেষে শেষ, প্রতি পারা নতুন পাতায়।
   পৃষ্ঠা নম্বর ও সূরা/পারার শুরুর পৃষ্ঠা নূরানী হাফেজী কুরআন (৬১৪ পৃষ্ঠার PDF)-এর সাথে মেলানো।
   লেখা: api.alquran.cloud (উসমানি লিপি) · ফন্ট: Amiri Quran (OFL) */
(function () {
  "use strict";
  var API = "https://api.alquran.cloud/v1/";
  var LPP = 15, LH = 2.05, VER = 2;
  var PN = ["আলিফ লাম মীম", "সাইয়াকূল", "তিলকার রুসুল", "লান তানালূ", "ওয়াল মুহসানাত", "লা ইউহিব্বুল্লাহ", "ওয়া ইযা সামিঊ", "ওয়া লাও আন্নানা", "কালাল মালাউ", "ওয়া'লামূ", "ইয়াতাযিরূন", "ওয়ামা মিন দাব্বাহ", "ওয়ামা উবাররিউ", "রুবামা", "সুবহানাল্লাযী", "কালা আলাম", "ইকতারাবা", "কাদ আফলাহা", "ওয়া কালাল্লাযীনা", "আম্মান খালাক্বা", "উতলু মা উহিয়া", "ওয়া মান ইয়াকনুত", "ওয়া মা লিয়া", "ফামান আযলামু", "ইলাইহি ইউরাদ্দু", "হা-মীম", "কালা ফামা খাতবুকুম", "কাদ সামিআল্লাহু", "তাবারাকাল্লাযী", "আম্মা"];
  var SB = ["আল-ফাতিহা", "আল-বাকারা", "আলে ইমরান", "আন-নিসা", "আল-মায়িদা", "আল-আনআম", "আল-আ'রাফ", "আল-আনফাল", "আত-তাওবা", "ইউনুস", "হূদ", "ইউসুফ", "আর-রা'দ", "ইবরাহীম", "আল-হিজর", "আন-নাহল", "বনী ইসরাঈল", "আল-কাহফ", "মারইয়াম", "ত্বা-হা", "আল-আম্বিয়া", "আল-হাজ্জ", "আল-মুমিনূন", "আন-নূর", "আল-ফুরকান", "আশ-শু'আরা", "আন-নামল", "আল-কাসাস", "আল-আনকাবূত", "আর-রূম", "লুকমান", "আস-সাজদা", "আল-আহযাব", "সাবা", "ফাতির", "ইয়া-সীন", "আস-সাফফাত", "ছোয়াদ", "আয-যুমার", "আল-মুমিন (গাফির)", "হা-মীম আস-সাজদা", "আশ-শূরা", "আয-যুখরুফ", "আদ-দুখান", "আল-জাসিয়া", "আল-আহকাফ", "মুহাম্মাদ", "আল-ফাতহ", "আল-হুজুরাত", "ক্বাফ", "আয-যারিয়াত", "আত-তূর", "আন-নাজম", "আল-ক্বামার", "আর-রহমান", "আল-ওয়াক্বিয়া", "আল-হাদীদ", "আল-মুজাদালা", "আল-হাশর", "আল-মুমতাহিনা", "আস-সাফ", "আল-জুমু'আ", "আল-মুনাফিকূন", "আত-তাগাবুন", "আত-তালাক্ব", "আত-তাহরীম", "আল-মুলক", "আল-ক্বালাম", "আল-হাক্কাহ", "আল-মা'আরিজ", "নূহ", "আল-জিন", "আল-মুযযাম্মিল", "আল-মুদ্দাসসির", "আল-ক্বিয়ামাহ", "আদ-দাহর", "আল-মুরসালাত", "আন-নাবা", "আন-নাযি'আত", "আবাসা", "আত-তাকবীর", "আল-ইনফিতার", "আল-মুতাফফিফীন", "আল-ইনশিক্বাক", "আল-বুরূজ", "আত-তারিক্ব", "আল-আ'লা", "আল-গাশিয়াহ", "আল-ফাজর", "আল-বালাদ", "আশ-শামস", "আল-লাইল", "আয-যোহা", "আল-ইনশিরাহ", "আত-তীন", "আল-আলাক্ব", "আল-ক্বদর", "আল-বাইয়্যিনাহ", "আয-যিলযাল", "আল-আদিয়াত", "আল-ক্বারি'আহ", "আত-তাকাসুর", "আল-আসর", "আল-হুমাযাহ", "আল-ফীল", "কুরাইশ", "আল-মা'ঊন", "আল-কাউসার", "আল-কাফিরূন", "আন-নাসর", "আল-মাসাদ", "আল-ইখলাস", "আল-ফালাক্ব", "আন-নাস"];
  var SE = ["Al-Fatihah", "Al-Baqarah", "Ali Imran", "An-Nisa", "Al-Maidah", "Al-Anam", "Al-Araf", "Al-Anfal", "At-Tawbah", "Yunus", "Hud", "Yusuf", "Ar-Rad", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra Bani Israil", "Al-Kahf", "Maryam", "Ta-Ha", "Al-Anbiya", "Al-Hajj", "Al-Muminun", "An-Nur", "Al-Furqan", "Ash-Shuara", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum", "Luqman", "As-Sajdah", "Al-Ahzab", "Saba", "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir Al-Mumin", "Fussilat Ha-Mim Sajdah", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf", "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqiah", "Al-Hadid", "Al-Mujadilah", "Al-Hashr", "Al-Mumtahanah", "As-Saff", "Al-Jumuah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Maarij", "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir", "Al-Qiyamah", "Al-Insan Ad-Dahr", "Al-Mursalat", "An-Naba", "An-Naziat", "Abasa", "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-Ala", "Al-Ghashiyah", "Al-Fajr", "Al-Balad", "Ash-Shams", "Al-Layl", "Ad-Duha", "Ash-Sharh Al-Inshirah", "At-Tin", "Al-Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-Adiyat", "Al-Qariah", "At-Takathur", "Al-Asr", "Al-Humazah", "Al-Fil", "Quraysh", "Al-Maun", "Al-Kawthar", "Al-Kafirun", "An-Nasr", "Al-Masad Lahab", "Al-Ikhlas", "Al-Falaq", "An-Nas"];
  // PDF-এর যে পৃষ্ঠায় প্রতিটি সূরা শুরু (১ম থেকে ১১৪তম) এবং প্রতিটি পারা শুরু
  var SPD = [2, 3, 51, 78, 107, 129, 152, 178, 188, 209, 222, 236, 250, 256, 262, 268, 283, 294, 306, 313, 323, 332, 343, 351, 360, 367, 377, 386, 397, 405, 412, 416, 419, 429, 435, 441, 446, 453, 459, 468, 478, 484, 490, 496, 499, 503, 507, 512, 516, 519, 521, 524, 527, 529, 532, 535, 538, 543, 546, 550, 552, 554, 555, 557, 559, 561, 563, 565, 568, 570, 572, 574, 577, 579, 581, 583, 585, 587, 588, 590, 591, 592, 593, 595, 596, 597, 598, 598, 599, 601, 601, 602, 603, 603, 604, 604, 605, 605, 606, 606, 607, 607, 608, 608, 608, 609, 609, 609, 609, 610, 610, 610, 611, 611];
  var PSD = [2, 23, 43, 63, 83, 103, 123, 143, 163, 183, 203, 223, 243, 263, 283, 303, 323, 343, 363, 383, 403, 423, 443, 463, 483, 503, 523, 543, 563, 587];
  var LASTP = 611;
  var BASM = "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ";

  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; }
  function bd(n) { return String(n).replace(/\d/g, function (d) { return "০১২৩৪৫৬৭৮৯".charAt(d); }); }
  function ad(n) { return String(n).replace(/\d/g, function (d) { return "٠١٢٣٤٥٦٧٨٩".charAt(d); }); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function norm(s) {
    return String(s).toLowerCase().replace(/[০-৯]/g, function (d) { return "০১২৩৪৫৬৭৮৯".indexOf(d); }).replace(/[-'’‘`\s.]/g, "");
  }
  function dp(i) { return i + 1; }          // ভেতরের পাতা → PDF-এর ছাপা পৃষ্ঠা নম্বর (ফাতিহা = ২)
  function ix(d) { return d - 1; }

  /* ---------- IndexedDB (লেখা ফোনেই জমা) ---------- */
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
  var AY = null, AN = null, PAGES = null, SPG = null, PPG = null;
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

  /* ---------- পাতা ভাগ: PDF-এর প্রতিটি পাতার শেষ আয়াত হুবহু ---------- */
  // LA[k] = PDF-এর (k+২) নম্বর পৃষ্ঠার শেষ আয়াতের নম্বর। প্রতিটি পৃষ্ঠার ১৫ লাইনের শেষ আয়াত পড়ে নেওয়া।
  var LA = [7, 4, 15, 23, 29, 37, 48, 57, 61, 69, 76, 83, 88, 93, 101, 105, 112, 119, 126, 134, 141, 149, 156, 164, 172, 179, 184, 187, 193, 197, 203, 211, 215, 219, 224, 229, 232, 235, 242, 247, 252, 256, 259, 264, 269, 274, 281, 282, 286, 8, 15, 22, 29, 37, 45, 53, 62, 70, 77, 83, 91, 100, 108, 115, 121, 132, 140, 147, 153, 157, 165, 173, 180, 186, 193, 200, 5, 10, 12, 18, 23, 28, 34, 41, 46, 54, 60, 68, 75, 80, 87, 91, 95, 101, 105, 113, 121, 127, 134, 140, 147, 154, 162, 170, 175, 2, 5, 9, 13, 17, 23, 31, 36, 41, 45, 50, 56, 63, 68, 75, 82, 89, 95, 103, 108, 113, 120, 8, 18, 26, 34, 43, 51, 58, 67, 73, 81, 90, 94, 101, 110, 118, 123, 130, 137, 142, 146, 151, 157, 165, 11, 22, 30, 37, 43, 51, 57, 67, 73, 81, 87, 95, 104, 121, 130, 137, 143, 149, 155, 159, 163, 170, 178, 187, 195, 206, 8, 16, 25, 33, 40, 45, 52, 61, 69, 75, 6, 13, 20, 26, 31, 36, 41, 47, 54, 61, 68, 72, 79, 86, 93, 99, 106, 111, 117, 122, 129, 6, 14, 20, 25, 33, 41, 52, 61, 70, 78, 88, 97, 106, 5, 12, 19, 28, 37, 45, 53, 62, 72, 81, 88, 97, 108, 117, 4, 14, 22, 30, 37, 43, 52, 63, 69, 78, 86, 95, 102, 111, 5, 13, 17, 26, 33, 41, 5, 10, 20, 26, 35, 43, 1, 18, 33, 52, 72, 90, 6, 14, 26, 34, 42, 54, 64, 72, 79, 86, 93, 102, 111, 118, 128, 7, 17, 29, 40, 51, 60, 69, 80, 92, 100, 111, 11, 18, 22, 29, 38, 47, 54, 62, 74, 83, 96, 109, 11, 25, 38, 51, 63, 75, 95, 12, 38, 51, 65, 76, 86, 97, 113, 126, 135, 11, 24, 35, 45, 57, 75, 81, 90, 102, 1, 6, 15, 23, 30, 37, 46, 55, 64, 72, 78, 17, 27, 42, 58, 66, 89, 104, 118, 7, 18, 26, 31, 36, 43, 53, 58, 61, 2, 11, 20, 32, 44, 57, 68, 4, 23, 43, 64, 90, 117, 142, 166, 189, 215, 5, 16, 26, 39, 46, 59, 66, 79, 88, 5, 13, 20, 28, 35, 43, 50, 59, 70, 77, 84, 5, 13, 21, 28, 36, 44, 52, 63, 5, 15, 24, 32, 41, 49, 58, 10, 18, 27, 34, 10, 20, 30, 6, 15, 22, 30, 35, 43, 50, 54, 62, 73, 7, 14, 22, 32, 40, 48, 3, 11, 18, 29, 37, 43, 9, 21, 37, 52, 70, 3, 29, 56, 82, 107, 133, 160, 3, 18, 27, 43, 62, 82, 5, 10, 21, 31, 40, 47, 56, 67, 74, 7, 16, 25, 32, 40, 49, 61, 66, 77, 85, 11, 20, 28, 38, 46, 54, 10, 15, 22, 31, 43, 51, 11, 23, 35, 49, 63, 79, 4, 26, 48, 6, 17, 26, 37, 8, 15, 22, 29, 1, 11, 18, 29, 38, 9, 15, 23, 28, 4, 11, 18, 15, 34, 6, 30, 50, 14, 31, 49, 25, 39, 3, 24, 44, 13, 38, 66, 16, 51, 76, 3, 10, 17, 24, 29, 6, 11, 20, 3, 9, 16, 24, 4, 10, 4, 13, 6, 3, 11, 8, 18, 5, 12, 6, 12, 10, 22, 6, 31, 48, 12, 34, 4, 31, 2, 18, 1, 14, 27, 15, 20, 30, 49, 14, 40, 14, 30, 25, 50, 27, 8, 38, 20, 7, 5, 10, 33, 21, 13, 17, 7, 9, 30, 5, 18, 8, 17, 6, 8, 8, 5, 2, 4, 6];
  function surahOfPage(p) {                     // PDF-এর পৃষ্ঠায় সবচেয়ে শেষের সূরা
    var s = 1;
    for (var i = 0; i < SPD.length; i++) if (SPD[i] <= p) s = i + 1;
    return s;
  }
  function paginate() {
    var n = AY.length, key = {}, x, p, pages = [], start = 0;
    for (x = 0; x < n; x++) key[AY[x][1] * 1000 + AY[x][2]] = x;
    for (p = 2; p <= LASTP; p++) {
      var s = p === 2 ? 1 : surahOfPage(p), e = key[s * 1000 + LA[p - 2]];
      if (e === undefined || e < start) e = Math.min(n - 1, start);
      if (p === LASTP) e = n - 1;
      pages.push([start, e + 1]);
      start = e + 1;
    }
    PAGES = pages; SPG = []; PPG = [];
    var seenS = {}, pageOf = new Array(n);
    for (p = 0; p < pages.length; p++) for (x = pages[p][0]; x < pages[p][1]; x++) pageOf[x] = p + 1;
    for (x = 0; x < n; x++) if (AY[x][2] === 1 && !seenS[AY[x][1]]) { seenS[AY[x][1]] = 1; SPG[AY[x][1] - 1] = pageOf[x]; }
    for (var k = 0; k < PSD.length; k++) PPG[k] = PSD[k] - 1;     // পারার শুরু = PDF-এর পারার পৃষ্ঠা
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

  /* ---------- ডিজাইন: মসজিদের গম্বুজের নীলচে-সবুজ (teal) রং ---------- */
  var st = document.createElement("style");
  st.textContent =
    "#hzw{position:fixed;inset:0;z-index:10002;display:none;flex-direction:column;background:#cfe3e0;color:#1b2a2c;font-family:inherit}" +
    "#hzw *{box-sizing:border-box}" +
    "#hzw button{font:inherit}" +
    "#hzw .tb{display:flex;gap:6px;align-items:center;padding:8px 10px;padding-top:max(8px,env(safe-area-inset-top,0px));background:linear-gradient(#27a3b1,#136573);color:#fff;box-shadow:0 2px 6px rgba(0,0,0,.3);z-index:3}" +
    "#hzw .tb button{border:0;border-radius:10px;padding:8px 12px;background:rgba(255,255,255,.2);color:#fff;font-size:16px}" +
    "#hzw .tb input{width:70px;padding:8px 4px;text-align:center;border:0;border-radius:10px;background:rgba(255,255,255,.2);color:#fff;font:inherit;font-weight:700;margin:0}" +
    "#hzw .tb .of{font-size:12px;opacity:.95;white-space:nowrap}" +
    "#hzw .tb .lb{flex:1;min-width:0;text-align:center;font-size:13px;line-height:1.25;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}" +
    "#hzw .stg{position:relative;flex:1;overflow:hidden;touch-action:pan-y;background:radial-gradient(circle at 50% 20%,#eef8f6,#c4dcd8)}" +
    "#hzw .pw{position:absolute;inset:0;overflow:auto;padding:12px 8px 18px;transition:transform .26s ease;-webkit-overflow-scrolling:touch}" +
    "#hzw .pf{position:relative;margin:0 auto;background:linear-gradient(#fffdf6,#f7f0dc);border:3px solid #2a9aa5;border-radius:12px;padding:8px 10px 10px;box-shadow:0 4px 14px rgba(8,70,82,.3)}" +
    "#hzw .pf:before{content:'';position:absolute;inset:5px;border:1.5px solid #8fd0d6;border-radius:8px;pointer-events:none}" +
    "#hzw .hzp{display:flex;justify-content:space-between;align-items:center;direction:rtl;padding:3px 6px 5px;margin-bottom:4px;border-bottom:1.5px solid #8fd0d6;color:#136573;font-size:13px;font-family:'Amiri Quran','Noto Naskh Arabic',serif}" +
    "#hzw .hbx{position:relative;height:calc(" + LPP + " * " + LH + "em);overflow:hidden;font-family:'Amiri Quran','Scheherazade New','Noto Naskh Arabic','Traditional Arabic',serif;line-height:" + LH + ";color:#12262a}" +
    "#hzw .htx{direction:rtl;text-align:justify;text-align-last:right}" +
    "#hzw .hno{display:inline-block;min-width:1.55em;height:1.55em;line-height:1.4em;margin:0 2px;text-align:center;border:1.2px solid #2a9aa5;border-radius:50%;color:#136573;font-size:.55em;vertical-align:middle;background:#e6f6f7}" +
    "#hzw .hsh{height:calc(" + (2 * LH) + "em);display:flex;align-items:center;justify-content:center;direction:rtl;border-radius:8px;background:linear-gradient(90deg,#a9dde2,#e6f6f7 50%,#a9dde2);border:2px solid #2a9aa5;color:#0f5560;font-size:1em;line-height:1}" +
    "#hzw .hsh:before,#hzw .hsh:after{content:'❖';color:#d9a93a;font-size:.7em;margin:0 10px}" +
    "#hzw .hzb{height:calc(" + LH + "em);display:flex;align-items:center;justify-content:center;direction:rtl}" +
    "#hzw .pn{text-align:center;margin-top:6px}" +
    "#hzw .pn span{display:inline-block;min-width:42px;padding:2px 14px;border:2px solid #2a9aa5;border-radius:20px;background:#e6f6f7;color:#136573;font-weight:700;font-size:13px}" +
    "#hzw .msg{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:24px;text-align:center;line-height:1.6;color:#2b4448}" +
    "#hzw .msg .big{font-size:44px}" +
    "#hzw .msg button{padding:10px 20px;border:0;border-radius:12px;background:#1f8a98;color:#fff}" +
    "#hzw .sl{display:flex;gap:8px;align-items:center;padding:8px 12px;padding-bottom:max(8px,env(safe-area-inset-bottom,0px));background:linear-gradient(#27a3b1,#136573)}" +
    "#hzw .sl button{border:0;border-radius:12px;padding:8px 14px;background:rgba(255,255,255,.22);color:#fff;font-size:16px}" +
    "#hzw .sl input{flex:1;min-width:0;width:auto;margin:0;padding:0;accent-color:#ffd978}" +
    "#hzw .bk{position:absolute;inset:0;background:rgba(0,0,0,.45);opacity:0;pointer-events:none;transition:opacity .2s;z-index:4}" +
    "#hzw .mn{position:absolute;top:0;bottom:0;left:0;width:min(88%,380px);background:#f6fbfa;z-index:5;transform:translateX(-102%);transition:transform .24s ease;display:flex;flex-direction:column;box-shadow:4px 0 18px rgba(0,0,0,.35)}" +
    "#hzw.mo .bk{opacity:1;pointer-events:auto}#hzw.mo .mn{transform:none}" +
    "#hzw .mh{display:flex;align-items:center;gap:8px;padding:12px;padding-top:max(12px,env(safe-area-inset-top,0px));background:linear-gradient(#27a3b1,#136573);color:#fff}" +
    "#hzw .mh b{flex:1;font-size:17px}" +
    "#hzw .mh button{border:0;border-radius:10px;padding:6px 12px;background:rgba(255,255,255,.22);color:#fff}" +
    "#hzw .sr{padding:10px 12px 6px}" +
    "#hzw .sr input{width:100%;margin:0;padding:10px 12px;border:1.5px solid #9fd3d8;border-radius:10px;font:inherit;background:#fff;color:#12262a}" +
    "#hzw .tabs{display:flex;gap:8px;padding:4px 12px 8px}" +
    "#hzw .tabs button{flex:1;padding:9px;border:1.5px solid #9fd3d8;border-radius:10px;background:#e6f6f7;color:#17484f}" +
    "#hzw .tabs button.on{background:#1f8a98;border-color:#1f8a98;color:#fff}" +
    "#hzw .ls{flex:1;overflow:auto;padding:0 8px 12px;-webkit-overflow-scrolling:touch}" +
    "#hzw .it{display:flex;align-items:center;gap:10px;width:100%;text-align:left;padding:10px;margin:0 0 6px;border:1px solid #d3e8ea;border-radius:10px;background:#fff;color:#12262a}" +
    "#hzw .it.on{background:#dff3f4;border-color:#1f8a98}" +
    "#hzw .it .n{min-width:34px;height:34px;line-height:34px;text-align:center;border-radius:50%;background:#e6f6f7;border:1.5px solid #2a9aa5;color:#136573;font-size:13px;font-weight:700}" +
    "#hzw .it .t{flex:1;min-width:0}#hzw .it .t small{display:block;color:#5f7b7f;font-size:12px}" +
    "#hzw .it .pg{font-size:12px;color:#136573;white-space:nowrap}" +
    "#hzw .em{padding:18px 8px;text-align:center;color:#5f7b7f}" +
    "#hzw .ft{display:flex;flex-wrap:wrap;gap:6px;padding:8px 12px;padding-bottom:max(8px,env(safe-area-inset-bottom,0px));border-top:1px solid #d3e8ea;background:#e6f6f7}" +
    "#hzw .ft button{flex:1;min-width:110px;padding:8px;border:1px solid #9fd3d8;border-radius:10px;background:#fff;font-size:13px;color:#17484f}";
  document.head.appendChild(st);
  var fl = document.createElement("link");
  fl.rel = "stylesheet"; fl.href = "https://fonts.googleapis.com/css2?family=Amiri+Quran&display=swap";
  document.head.appendChild(fl);

  var ov = document.createElement("div");
  ov.id = "hzw";
  ov.innerHTML =
    '<div class="tb"><button id="hz-m" aria-label="সূচি">☰</button>' +
    '<input id="hz-p" type="number" min="2" inputmode="numeric" aria-label="পৃষ্ঠা নম্বর"><span class="of" id="hz-of"></span>' +
    '<div class="lb" id="hz-lb"></div>' +
    '<button id="hz-zm" aria-label="ছোট">A−</button><button id="hz-zp" aria-label="বড়">A+</button>' +
    '<button id="hz-x" aria-label="বন্ধ">✕</button></div>' +
    '<div class="stg" id="hz-s"></div>' +
    '<div class="sl"><button id="hz-nx" aria-label="পরের পাতা">❮</button><input id="hz-r" type="range" min="1" max="1" value="1" aria-label="পাতা সরান"><button id="hz-pv" aria-label="আগের পাতা">❯</button></div>' +
    '<div class="bk" id="hz-bk"></div>' +
    '<div class="mn"><div class="mh"><b>সূচি</b><button id="hz-mx">✕ বন্ধ</button></div>' +
    '<div class="sr"><input id="hz-q" type="search" placeholder="সূরা, পারা বা পৃষ্ঠা নম্বর লিখুন…" autocomplete="off"></div>' +
    '<div class="tabs"><button id="hz-ts" class="on">সূরা (১১৪)</button><button id="hz-tp">পারা (৩০)</button></div>' +
    '<div class="ls" id="hz-l"></div>' +
    '<div class="ft"><button id="hz-dir"></button><button id="hz-rl">🔄 লেখা আবার নামান</button></div></div>';
  function $(id) { return ov.querySelector("#hz-" + id); }

  /* ---------- অবস্থা ---------- */
  var S = { page: parseInt(ls("hfz15-page"), 10) || 1, rtl: ls("hfz-dir") !== "ltr", zi: parseInt(ls("hfz-z"), 10) || 0, tab: "s" };
  var ZS = [1, 1.25, 1.5, 1.8];
  var token = 0;

  /* ---------- পাতা আঁকা ---------- */
  function pageHtml(pi) {
    var pr = PAGES[pi - 1], a = pr[0], b = pr[1], h = '<div class="hbx">', tx = false, x;
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
      h += "<span>" + esc(A[4]) + ' <span class="hno">' + ad(A[2]) + "</span></span> ";
    }
    closeTx();
    h += "</div>";
    var first = AY[a];
    return '<div class="pf"><div class="hzp"><b>' + esc(AN[first[1]] || "") + "</b><span>الجزء " + ad(curParaIdx(pi) + 1) + "</span></div>" + h +
      '<div class="pn"><span>' + bd(dp(pi)) + "</span></div></div>";
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
    if (box.scrollHeight > box.clientHeight + 1) { box.style.height = "auto"; box.style.overflow = "visible"; }  // অস্বাভাবিক ভারী পাতায় লেখা কাটা পড়বে না
    return lo;
  }
  function buildPage(pi) {
    var sg = $("s"), wrap = document.createElement("div");
    wrap.className = "pw";
    wrap.innerHTML = pageHtml(pi);
    var pf = wrap.firstChild, z = ZS[S.zi] || 1;
    pf.style.width = Math.round(Math.min(sg.clientWidth - 16, 560) * z) + "px";
    sg.appendChild(wrap);
    fitBox(wrap.querySelector(".hbx"), pi === 1 ? 30 : 28);
    wrap.parentNode.removeChild(wrap);
    return wrap;
  }
  function place(wrap, exitDir) {
    var sg = $("s"), old = sg.querySelector(".pw");
    var msg = sg.querySelector(".msg"); if (msg) sg.removeChild(msg);
    if (!old || !exitDir) {
      while (sg.firstChild) sg.removeChild(sg.firstChild);
      sg.appendChild(wrap);
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
    setTimeout(function () { if (old.parentNode === sg) sg.removeChild(old); }, 320);
    var all = sg.querySelectorAll(".pw");
    for (var i = 0; i < all.length; i++) if (all[i] !== wrap && all[i] !== old) sg.removeChild(all[i]);
  }
  function labels() {
    var p = S.page, s = curSurahIdx(p), k = curParaIdx(p);
    $("p").value = dp(p);
    $("r").value = p;
    $("lb").textContent = "পারা " + bd(k + 1) + " · " + SB[s];
    if (ov.classList.contains("mo")) drawList();
  }
  function go(n, exitDir) {
    n = parseInt(n, 10);
    if (!(n >= 1)) n = 1;
    if (n > PAGES.length) n = PAGES.length;
    S.page = n; ls("hfz15-page", n);
    labels();
    var my = ++token;
    var wrap = buildPage(n);
    if (my !== token) return;
    place(wrap, exitDir || 0);
    wrap.scrollTop = 0;
  }
  function flip(delta) {
    var n = S.page + delta;
    if (n < 1 || n > PAGES.length) return;
    go(n, (delta > 0) === S.rtl ? 1 : -1);
  }

  /* ---------- সূচি-মেনু (সূরা, পারা, পৃষ্ঠা নম্বর) ---------- */
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
      h += '<button class="it' + (x.n === cur ? " on" : "") + '" data-p="' + x.p + '"><span class="n">' + bd(x.n) + '</span><span class="t">' + esc(x.t) + "<small>" + esc(x.sm) + '</small></span><span class="pg">পৃষ্ঠা ' + bd(dp(x.p)) + "</span></button>";
    });
    var pn = r.numQ ? +r.numQ : 0;
    if (pn >= 2 && pn <= PAGES.length + 1) {
      h = '<button class="it" data-p="' + ix(pn) + '"><span class="n">↪</span><span class="t">পৃষ্ঠা ' + bd(pn) + "-এ যান</span></button>" + h;
    }
    $("l").innerHTML = h || '<div class="em">কিছু পাওয়া যায়নি</div>';
  }
  function openMenu() { ov.classList.add("mo"); drawList(); var a = $("l").querySelector(".it.on"); if (a && a.scrollIntoView) a.scrollIntoView({ block: "center" }); }
  function closeMenu() { ov.classList.remove("mo"); }
  function dirLabel() { $("dir").textContent = S.rtl ? "↔ ডানে টানলে পরের পাতা" : "↔ বামে টানলে পরের পাতা"; $("r").style.direction = S.rtl ? "rtl" : "ltr"; }

  /* ---------- চালু করা ---------- */
  function info(icon, html, btn) {
    var sg = $("s");
    sg.innerHTML = '<div class="msg"><div class="big">' + icon + "</div><div>" + html + "</div>" + (btn ? '<button id="hz-retry">আবার চেষ্টা করুন</button>' : "") + "</div>";
    var b = sg.querySelector("#hz-retry"); if (b) b.onclick = function () { loadData(true); };
  }
  function ready() {
    paginate();
    $("of").textContent = "/ " + bd(PAGES.length + 1);
    $("p").max = PAGES.length + 1;
    $("r").max = PAGES.length;
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
  function closeIt() { if (!opened) return; opened = false; closeMenu(); ov.style.display = "none"; }

  /* ---------- ইভেন্ট ---------- */
  $("x").onclick = function () { var had = false; try { had = history.state && history.state.hz; } catch (e) {} if (had) history.back(); else closeIt(); };
  window.addEventListener("popstate", function () { if (opened) closeIt(); });
  $("m").onclick = function () { if (PAGES) openMenu(); };
  $("mx").onclick = closeMenu; $("bk").onclick = closeMenu;
  $("p").onchange = function () { if (PAGES) { var n = ix(parseInt(this.value, 10)); if (n !== S.page) go(n); else labels(); } };
  $("p").onkeydown = function (e) { if (e.key === "Enter") this.blur(); };
  $("r").oninput = function () { $("p").value = dp(parseInt(this.value, 10)); };
  $("r").onchange = function () { if (PAGES) go(this.value); };
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
  $("zm").onclick = function () { if (PAGES && S.zi > 0) { S.zi--; ls("hfz-z", S.zi); go(S.page); } };
  $("zp").onclick = function () { if (PAGES && S.zi < ZS.length - 1) { S.zi++; ls("hfz-z", S.zi); go(S.page); } };
  dirLabel();

  // আঙুলে পাতা উল্টানো
  var sg0 = $("s"), px = 0, py = 0, pid = null;
  sg0.addEventListener("pointerdown", function (e) { if (S.zi > 0) return; px = e.clientX; py = e.clientY; pid = e.pointerId; });
  sg0.addEventListener("pointercancel", function () { pid = null; });
  sg0.addEventListener("pointerup", function (e) {
    if (!PAGES || pid !== e.pointerId) return;
    pid = null;
    var dx = e.clientX - px, dy = e.clientY - py;
    if (Math.abs(dx) > 50 && Math.abs(dx) > 1.4 * Math.abs(dy)) flip((dx > 0) === S.rtl ? 1 : -1);
  });
  document.addEventListener("keydown", function (e) {
    if (!opened || !PAGES || ov.classList.contains("mo")) return;
    if (e.target && e.target.tagName === "INPUT") return;
    if (e.key === "ArrowLeft") flip(S.rtl ? 1 : -1); else if (e.key === "ArrowRight") flip(S.rtl ? -1 : 1);
  });
  window.addEventListener("resize", function () { if (opened && PAGES) go(S.page); });

  /* ---------- মূল পাতায়, "তেলাওয়াত" ঘরের পাশে "১৫ লাইনের কুরআন" ঘর ---------- */
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
      t.innerHTML = "<span>🕌</span><b>১৫ লাইনের কুরআন</b>";
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
