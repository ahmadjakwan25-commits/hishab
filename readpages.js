/* আল-মিফতাহ: মাসায়েল ও প্রবন্ধের পাতা
   ১) আলাদা নকশা ও রং (মাসায়েল: বেগুনি-জাফরান, প্রবন্ধ: টেরাকোটা-নীলচে সবুজ)
   ২) বাংলা লেখা বাম দিক থেকে, আরবি লেখা ডান দিক থেকে
   ৩) 👁 কতজন দেখেছেন, শুধু পরিচালক (এডমিন) হিসেবে ঢুকলে দেখা যায়। প্রতি ফোন থেকে প্রতিটি লেখায় একবার গোনা হয়। */
(function () {
  "use strict";

  var APP = document.getElementById("app");
  if (!APP) return;

  var NVU = "https://abacus.jasoncameron.dev", NVS = "almiftah-read-v1";
  var AR_LETTER = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/g;
  var BN_LETTER = /[\u0980-\u09FFA-Za-z0-9]/g;
  var AR_RUN = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF][\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF\s\u200c\u200d\u060C\u061B\u061F.,:;!()«»"'\-–—]*/g;

  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function bn(n) { return String(n).replace(/\d/g, function (d) { return "০১২৩৪৫৬৭৮৯".charAt(d); }); }
  function isAdmin() { try { return !!(window.ghTok ? window.ghTok() : lsGet("mf-gh")); } catch (e) { return !!lsGet("mf-gh"); } }

  /* ---------- নকশা ---------- */
  var st = document.createElement("style");
  st.textContent =
    /* ====== মাসায়েল: গভীর রাতের বেগুনি + জাফরান ====== */
    "#app.pm-mas{--pm1:#2a1750;--pm2:#4b2a86;--pm3:#7d3c98;--pm4:#ffb703;--pm5:#fff6e0;--pm6:#3a2368}" +
    "#app.pm-mas .top{position:relative;display:block;margin:6px -2px 14px;padding:20px 16px 26px;border-radius:26px 26px 60px 26px;color:#fff;overflow:hidden;" +
    "background:radial-gradient(circle at 88% 18%,rgba(255,183,3,.35),transparent 42%),radial-gradient(circle at 8% 90%,rgba(125,60,152,.55),transparent 45%),linear-gradient(140deg,var(--pm1),var(--pm2) 60%,var(--pm3));box-shadow:0 10px 24px rgba(42,23,80,.38)}" +
    "#app.pm-mas .top:before{content:'مسائل';position:absolute;right:12px;bottom:-34px;font:700 92px/1 'Amiri','Noto Naskh Arabic',serif;color:rgba(255,255,255,.09);pointer-events:none}" +
    "#app.pm-mas .top:after{content:'';position:absolute;left:16px;bottom:12px;width:74px;height:5px;border-radius:4px;background:linear-gradient(90deg,var(--pm4),transparent)}" +
    "#app.pm-mas .top h2{position:relative;margin:12px 0 0;font-size:27px;letter-spacing:.3px;color:#fff;text-shadow:0 2px 10px rgba(0,0,0,.35)}" +
    "#app.pm-mas .top h2:before{content:'❓ ';font-size:.8em}" +
    "#app.pm-mas .back{background:rgba(255,255,255,.16);color:#fff;border:1px solid rgba(255,255,255,.35);backdrop-filter:blur(2px)}" +
    "#app.pm-mas .panel{background:#fffaf0;border:1px solid #ecd9a6;border-radius:20px 20px 20px 6px;box-shadow:0 6px 16px rgba(75,42,134,.10)}" +
    "#app.pm-mas input[data-fl]{border:2px solid #d9c6f0;border-radius:30px;background:#fff;color:#2a1750;padding:11px 16px}" +
    "#app.pm-mas input[data-fl]:focus{outline:none;border-color:var(--pm4);box-shadow:0 0 0 3px rgba(255,183,3,.25)}" +
    "#app.pm-mas .srb{margin:0 0 9px;padding:11px 12px;border:0;border-radius:16px 16px 16px 4px;background:linear-gradient(120deg,#fff,#f5ecff);box-shadow:0 3px 10px rgba(75,42,134,.14);color:#2a1750;font-weight:600;position:relative;overflow:hidden}" +
    "#app.pm-mas .srb:before{content:'';position:absolute;left:0;top:0;bottom:0;width:5px;background:linear-gradient(var(--pm4),var(--pm3))}" +
    "#app.pm-mas .srb:last-child{border:0}" +
    "#app.pm-mas .sno{width:38px;height:38px;border-radius:0;clip-path:polygon(30% 0,70% 0,100% 30%,100% 70%,70% 100%,30% 100%,0 70%,0 30%);background:linear-gradient(135deg,var(--pm4),#ff8a00);color:#2a1750;font-weight:800}" +
    "#app.pm-mas .srb span:last-child{color:var(--pm3)!important;font-size:20px}" +
    "#app.pm-mas details.fi{margin:0 0 12px;padding:0;border:0;border-radius:18px 18px 18px 5px;background:#fffaf0;box-shadow:0 6px 16px rgba(75,42,134,.13);overflow:hidden;border-left:6px solid var(--pm4)}" +
    "#app.pm-mas details.fi>summary{padding:14px 14px 14px 12px;font-weight:700;color:#2a1750;line-height:1.55;list-style:none;position:relative;padding-right:40px}" +
    "#app.pm-mas details.fi>summary::-webkit-details-marker{display:none}" +
    "#app.pm-mas details.fi>summary:after{content:'⌄';position:absolute;right:14px;top:10px;font-size:22px;color:var(--pm3);transition:transform .2s}" +
    "#app.pm-mas details.fi[open]>summary{background:linear-gradient(100deg,#f2e8ff,#fff6dc);border-bottom:1px dashed #dcc7f2}" +
    "#app.pm-mas details.fi[open]>summary:after{transform:rotate(180deg)}" +
    "#app.pm-mas details.fi .bi{padding:6px 14px 4px}" +
    "#app.pm-mas details.fi>small{display:block;padding:0 14px 12px;color:#7d3c98!important}" +
    /* ====== প্রবন্ধ: টেরাকোটা + গভীর সবুজ-নীল ====== */
    "#app.pm-ess{--pe1:#6e2a22;--pe2:#b4532a;--pe3:#e59a52;--pe4:#0f5257;--pe5:#fff8ee}" +
    "#app.pm-ess .top{position:relative;display:block;margin:6px -2px 14px;padding:20px 16px 26px;border-radius:60px 26px 26px 26px;color:#fff;overflow:hidden;" +
    "background:radial-gradient(circle at 12% 15%,rgba(255,226,170,.38),transparent 40%),radial-gradient(circle at 92% 92%,rgba(15,82,87,.6),transparent 46%),linear-gradient(135deg,var(--pe1),var(--pe2) 58%,var(--pe3));box-shadow:0 10px 24px rgba(110,42,34,.35)}" +
    "#app.pm-ess .top:before{content:'مقالات';position:absolute;left:10px;bottom:-32px;font:700 88px/1 'Amiri','Noto Naskh Arabic',serif;color:rgba(255,255,255,.10);pointer-events:none}" +
    "#app.pm-ess .top:after{content:'';position:absolute;right:16px;bottom:12px;width:74px;height:5px;border-radius:4px;background:linear-gradient(270deg,#ffe3b0,transparent)}" +
    "#app.pm-ess .top h2{position:relative;margin:12px 0 0;font-size:27px;color:#fff;text-shadow:0 2px 10px rgba(0,0,0,.35);font-family:'Noto Serif Bengali','Kalpurush','SolaimanLipi',serif}" +
    "#app.pm-ess .top h2:before{content:'✍️ ';font-size:.8em}" +
    "#app.pm-ess .back{background:rgba(255,255,255,.18);color:#fff;border:1px solid rgba(255,255,255,.4)}" +
    "#app.pm-ess .panel{background:var(--pe5);border:1px solid #f0d3b0;border-radius:6px 22px 22px 22px;box-shadow:0 6px 16px rgba(110,42,34,.10)}" +
    "#app.pm-ess input[data-fl]{border:2px solid #f0cfaa;border-radius:12px 30px 30px 12px;background:#fff;color:#3b1d17;padding:11px 16px}" +
    "#app.pm-ess input[data-fl]:focus{outline:none;border-color:var(--pe4);box-shadow:0 0 0 3px rgba(15,82,87,.2)}" +
    "#app.pm-ess .srb{margin:0 0 10px;padding:12px 12px 12px 18px;border:0;border-radius:4px 16px 16px 4px;background:linear-gradient(90deg,#fff,#fff1e0);box-shadow:0 3px 10px rgba(110,42,34,.14);color:#3b1d17;font-weight:600;position:relative;border-right:7px solid var(--pe4)}" +
    "#app.pm-ess .srb:last-child{border-bottom:0}" +
    "#app.pm-ess .sno{width:36px;height:36px;border-radius:50% 50% 50% 8px;background:linear-gradient(135deg,var(--pe4),#188a91);color:#fff;font-weight:800}" +
    "#app.pm-ess .srb span:last-child{color:var(--pe2)!important;font-size:20px}" +
    "#app.pm-ess details.fi{margin:0 0 14px;padding:0;border:0;border-radius:6px 22px 22px 22px;background:#fffdf8;box-shadow:0 6px 18px rgba(110,42,34,.14);overflow:hidden;border-top:6px solid var(--pe2)}" +
    "#app.pm-ess details.fi>summary{padding:15px 42px 15px 14px;font-weight:700;color:#3b1d17;line-height:1.55;list-style:none;position:relative;font-family:'Noto Serif Bengali','Kalpurush','SolaimanLipi',serif}" +
    "#app.pm-ess details.fi>summary::-webkit-details-marker{display:none}" +
    "#app.pm-ess details.fi>summary:after{content:'❯';position:absolute;right:16px;top:14px;color:var(--pe4);font-size:18px;transition:transform .2s}" +
    "#app.pm-ess details.fi[open]>summary{background:linear-gradient(100deg,#fff0dc,#e6f4f3)}" +
    "#app.pm-ess details.fi[open]>summary:after{transform:rotate(90deg)}" +
    "#app.pm-ess details.fi .bi{padding:8px 16px 10px;font-size:16.5px;line-height:1.95}" +
    "#app.pm-ess details.fi .bi p.bnp:first-child:first-letter{float:left;font-size:3.1em;line-height:.9;padding:4px 8px 0 0;color:var(--pe4);font-weight:800;font-family:'Noto Serif Bengali','Kalpurush',serif}" +
    "#app.pm-ess details.fi .rt{display:inline-block;margin:0 14px 6px;padding:2px 10px;border-radius:20px;background:#e6f4f3;color:var(--pe4);font-size:12px;font-weight:600}" +
    "#app.pm-ess details.fi>a.chip{margin:0 14px 12px;border-color:var(--pe4)!important;color:var(--pe4)!important;font-weight:600}" +
    /* ====== দুই পাতার সাধারণ: বাংলা বাম, আরবি ডান ====== */
    "#app .bi{white-space:normal}" +
    "#app .bi p{margin:0 0 10px;word-break:break-word}" +
    "#app .bi p.bnp{direction:ltr;text-align:left;unicode-bidi:plaintext}" +
    "#app .bi p.arp{direction:rtl;text-align:right;font-family:'Amiri','Noto Naskh Arabic','Scheherazade New',serif;font-size:1.45em;line-height:2.15;color:#12332c}" +
    "#app .bi .ari{direction:rtl;unicode-bidi:isolate;font-family:'Amiri','Noto Naskh Arabic','Scheherazade New',serif;font-size:1.25em;line-height:1.9;color:#0f5257;white-space:normal}" +
    "#app.pm-mas .bi .ari{color:#5a2d82}" +
    /* ====== 👁 গণনা (শুধু পরিচালক) ====== */
    ".pmeye{display:inline-flex;align-items:center;gap:6px;margin:2px 14px 8px;padding:3px 11px;border-radius:20px;background:linear-gradient(90deg,#ffefc2,#fff);border:1px solid #f0cf7a;color:#7a4b00;font-size:12.5px;font-weight:700}" +
    ".pmeye b{font-size:15px}";
  document.head.appendChild(st);

  /* ---------- কোন পাতা খোলা ---------- */
  function pageKind() {
    var back = APP.querySelector(".top .back[data-v]");
    var h2 = APP.querySelector(".top h2");
    var t = h2 ? h2.textContent : "";
    var bv = back ? back.getAttribute("data-v") : "";
    if (bv === "masail" || /^[\s\u2753\uFE0F]*মাসায়েল/.test(t)) return "masail";
    if (bv === "essay" || /^[\s\u270D\uFE0F]*প্রবন্ধ/.test(t)) return "essays";
    return "";
  }

  /* ---------- বাংলা বাম, আরবি ডান ---------- */
  function paragraph(line) {
    var ar = (line.match(AR_LETTER) || []).length, bnl = (line.match(BN_LETTER) || []).length;
    var p = document.createElement("p");
    if (ar > 0 && ar >= bnl) {                                   // আরবিপ্রধান অনুচ্ছেদ: ডান থেকে
      p.className = "arp";
      p.textContent = line;
    } else {                                                      // বাংলা অনুচ্ছেদ: বাম থেকে, ভেতরের আরবি অংশ ডান-থেকে-বামে
      p.className = "bnp";
      var html = "", last = 0, m;
      AR_RUN.lastIndex = 0;
      while ((m = AR_RUN.exec(line))) {
        html += esc(line.slice(last, m.index));
        html += '<span class="ari" dir="rtl">' + esc(m[0].replace(/\s+$/, "")) + "</span>" + (/\s$/.test(m[0]) ? " " : "");
        last = m.index + m[0].length;
      }
      html += esc(line.slice(last));
      p.innerHTML = html;
    }
    return p;
  }
  function biNote(n) {
    if (n.getAttribute("data-bi")) return;
    n.setAttribute("data-bi", "1");
    var txt = n.textContent || "";
    var box = document.createElement("div");
    box.className = "bi";
    txt.split(/\n+/).forEach(function (l) { l = l.trim(); if (l) box.appendChild(paragraph(l)); });
    n.parentNode.replaceChild(box, n);
    return box;
  }

  /* ---------- 👁 গণনা ---------- */
  function key(kind, title, i) {
    var s = kind + "|" + (title || "") + "|" + i, h = 5381;
    for (var k = 0; k < s.length; k++) h = ((h << 5) + h + s.charCodeAt(k)) >>> 0;
    return (kind === "masail" ? "m" : "e") + h.toString(36);
  }
  function countHit(k) {
    if (lsGet("mf-rd" + k)) return;
    fetch(NVU + "/hit/" + NVS + "/" + k).then(function (r) { if (r.ok) lsSet("mf-rd" + k, "1"); }).catch(function () {});
  }
  function showCount(el, k) {
    fetch(NVU + "/get/" + NVS + "/" + k).then(function (r) { return r.ok ? r.json() : { value: 0 }; })
      .then(function (j) { el.innerHTML = "👁 <b>" + bn(j.value || 0) + "</b> জন দেখেছেন"; })
      .catch(function () { el.textContent = "👁 সংখ্যা আনা যায়নি"; });
  }
  function decorateItem(d, kind, idx) {
    if (d.getAttribute("data-pm")) return;
    d.setAttribute("data-pm", "1");
    var sum = d.querySelector("summary"), title = sum ? sum.childNodes[0] && sum.childNodes[0].textContent : "";
    var k = key(kind, (title || "").trim(), idx);
    var note = d.querySelector(".note"), box = note ? biNote(note) : null;
    // পড়ার সময় (শুধু প্রবন্ধে)
    if (kind === "essays" && box) {
      var words = (box.textContent || "").trim().split(/\s+/).length, mins = Math.max(1, Math.round(words / 160));
      var rt = document.createElement("span");
      rt.className = "rt"; rt.textContent = "⏱ প্রায় " + bn(mins) + " মিনিট";
      d.insertBefore(rt, box);
    }
    if (isAdmin()) {
      var eye = document.createElement("div");
      eye.className = "pmeye"; eye.textContent = "👁 গণনা হচ্ছে…";
      d.insertBefore(eye, d.querySelector(".rt, .bi") || sum.nextSibling);
      showCount(eye, k);
    }
    d.addEventListener("toggle", function () { if (d.open) countHit(k); });
  }

  /* ---------- বদল লক্ষ করে প্রয়োগ ---------- */
  var busy = false;
  function apply() {
    if (busy) return;
    busy = true;
    try {
      var kind = pageKind();
      APP.classList.toggle("pm-mas", kind === "masail");
      APP.classList.toggle("pm-ess", kind === "essays");
      if (kind) {
        var items = APP.querySelectorAll("#tpi details.fi");
        for (var i = 0; i < items.length; i++) decorateItem(items[i], kind, i);
      }
    } finally { busy = false; }
  }
  new MutationObserver(function () { apply(); }).observe(APP, { childList: true, subtree: true });
  apply();

  window.__pm = { apply: apply, key: key };
})();
