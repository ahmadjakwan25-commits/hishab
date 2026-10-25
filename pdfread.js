/* আল-মিফতাহ: পিডিএফ যোগ করে পড়ুন
   যেকোনো কিতাবের PDF নিজের ফোনে যোগ করে পড়া। ফাইল ফোনেই থাকে, কোথাও আপলোড হয় না।
   আঙুলে ডানে-বামে টানলে পাতা উল্টায়, মেনুতে শুধু পৃষ্ঠা নম্বরে খোঁজা যায়। */
(function () {
  "use strict";

  var BASE = (function () {
    var s = document.currentScript;
    return (s && s.src ? s.src : location.href).replace(/[^\/]*$/, "");
  })();

  /* ---------- ছোট সহায়ক ---------- */
  function ls(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {}
    return null;
  }
  function bd(n) { return String(n).replace(/\d/g, function (d) { return "০১২৩৪৫৬৭৮৯".charAt(d); }); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function ascii(s) { return String(s).replace(/[০-৯]/g, function (d) { return "০১২৩৪৫৬৭৮৯".indexOf(d); }); }
  function sizeTxt(b) {
    if (b < 1048576) return bd(Math.max(1, Math.round(b / 1024))) + " KB";
    var mb = b / 1048576;
    return bd(mb >= 10 ? Math.round(mb) : mb.toFixed(1)) + " MB";
  }

  /* ---------- IndexedDB: কিতাবগুলো ফোনেই জমা ---------- */
  function idb() {
    return new Promise(function (res, rej) {
      var r = indexedDB.open("almiftah-pdfread", 1);
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

  /* ---------- ডিজাইন (সব নামের আগে pr, অ্যাপের নিজের স্টাইলের সাথে গোলমাল এড়াতে) ---------- */
  var st = document.createElement("style");
  st.textContent =
    "#prw{position:fixed;inset:0;z-index:10001;display:none;flex-direction:column;background:#d9d3bf;color:#1c1a14;font-family:inherit;-webkit-user-select:none;user-select:none}" +
    "#prw *{box-sizing:border-box}" +
    "#prw button{font:inherit}" +
    "#prw .prtb{display:flex;gap:6px;align-items:center;padding:8px 10px;padding-top:max(8px,env(safe-area-inset-top,0px));background:linear-gradient(#1b6e45,#145132);color:#fff;box-shadow:0 2px 6px rgba(0,0,0,.3);z-index:3}" +
    "#prw .prtb button{border:0;border-radius:10px;padding:8px 12px;background:rgba(255,255,255,.18);color:#fff;font-size:16px}" +
    "#prw .prtb input{width:70px;padding:8px 4px;text-align:center;border:0;border-radius:10px;background:rgba(255,255,255,.18);color:#fff;font:inherit;font-weight:700;margin:0}" +
    "#prw .prof{font-size:12px;opacity:.9;white-space:nowrap}" +
    "#prw .prlb{flex:1;min-width:0;text-align:center;font-size:14px;line-height:1.25;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}" +
    "#prw .prstg{position:relative;flex:1;overflow:hidden;touch-action:pan-y;background:radial-gradient(circle at 50% 30%,#e8e2cd,#cfc8ae)}" +
    "#prw .prstg canvas{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:#fff;box-shadow:0 3px 14px rgba(0,0,0,.35);transition:transform .24s ease}" +
    "#prw .prstg.z{overflow:auto;touch-action:auto;-webkit-overflow-scrolling:touch}" +
    "#prw .prstg.z canvas{position:relative;left:auto;top:auto;transform:none;margin:0 auto;display:block;transition:none}" +
    "#prw .prmsg{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:24px;text-align:center;line-height:1.6;color:#3a3420}" +
    "#prw .prmsg .big{font-size:44px}" +
    "#prw .prsl{padding:6px 14px;padding-bottom:max(6px,env(safe-area-inset-bottom,0px));background:#145132}" +
    "#prw .prsl input{width:100%;margin:0;padding:0;accent-color:#f4c542}" +
    /* মোড: কিতাবের তালিকা / পড়ার পাতা */
    "#prw.lib .prstg,#prw.lib .prsl,#prw.lib #pr-p,#prw.lib .prof,#prw.lib #pr-m{display:none}" +
    "#prw.rd .prlib{display:none}" +
    "#prw .prlib{flex:1;overflow:auto;padding:14px 12px 24px;-webkit-overflow-scrolling:touch;background:radial-gradient(circle at 50% 0,#efe8cf,#d6cdb0)}" +
    "#prw .pradd{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:16px;border:2px dashed #17603c;border-radius:14px;background:#f4edd2;color:#17603c;font-size:17px;font-weight:700;cursor:pointer;margin-bottom:14px}" +
    "#prw .prhint{padding:10px 6px 16px;text-align:center;color:#6b6448;font-size:13px;line-height:1.7}" +
    "#prw .prbook{display:flex;align-items:center;gap:12px;padding:12px;margin-bottom:10px;border:1px solid #d8cd9f;border-radius:14px;background:#fffaf0;box-shadow:0 2px 6px rgba(60,40,0,.12);cursor:pointer}" +
    "#prw .prbook .pric{font-size:34px;line-height:1}" +
    "#prw .prbook .prin{flex:1;min-width:0}" +
    "#prw .prbook .prin b{display:block;font-size:16px;line-height:1.35;word-break:break-word}" +
    "#prw .prbook .prin small{display:block;margin-top:3px;color:#6b6448;font-size:12px}" +
    "#prw .prbook .prdel{border:0;border-radius:10px;padding:8px 10px;background:#f3e0dc;color:#9a2b1f;font-size:16px}" +
    "#prw .prst{padding:4px 12px;font-size:12px;color:#6b6448;text-align:center;min-height:22px}" +
    /* পাশের মেনু: শুধু পৃষ্ঠা নম্বর খোঁজা */
    "#prw .prbkd{position:absolute;inset:0;background:rgba(0,0,0,.45);opacity:0;pointer-events:none;transition:opacity .2s;z-index:4}" +
    "#prw .prmn{position:absolute;top:0;bottom:0;left:0;width:min(88%,380px);background:#fbf6e6;z-index:5;transform:translateX(-102%);transition:transform .24s ease;display:flex;flex-direction:column;box-shadow:4px 0 18px rgba(0,0,0,.35)}" +
    "#prw.mo .prbkd{opacity:1;pointer-events:auto}#prw.mo .prmn{transform:none}" +
    "#prw .prmh{display:flex;align-items:center;gap:8px;padding:12px;padding-top:max(12px,env(safe-area-inset-top,0px));background:linear-gradient(#1b6e45,#145132);color:#fff}" +
    "#prw .prmh b{flex:1;font-size:17px}" +
    "#prw .prmh button{border:0;border-radius:10px;padding:6px 12px;background:rgba(255,255,255,.2);color:#fff}" +
    "#prw .prsr{padding:12px 12px 6px}" +
    "#prw .prsr input{width:100%;margin:0;padding:12px;border:1.5px solid #c9bd8f;border-radius:10px;font:inherit;font-size:16px;background:#fff;color:#1c1a14}" +
    "#prw .prres{flex:1;overflow:auto;padding:4px 12px}" +
    "#prw .prgo{display:flex;align-items:center;gap:10px;width:100%;text-align:left;padding:12px;border:1px solid #17603c;border-radius:10px;background:#e3f1e8;color:#1c1a14;font-size:16px}" +
    "#prw .prem{padding:14px 6px;text-align:center;color:#7a735a;font-size:14px;line-height:1.6}" +
    "#prw .prft{display:flex;flex-wrap:wrap;gap:6px;padding:8px 12px;padding-bottom:max(8px,env(safe-area-inset-bottom,0px));border-top:1px solid #e0d6b0;background:#f4edd2}" +
    "#prw .prft button{flex:1;min-width:130px;padding:9px;border:1px solid #c9bd8f;border-radius:10px;background:#fff;font-size:13px;color:#3a3420}" +
    "#pr-tile b{line-height:1.25}";
  document.head.appendChild(st);

  var ov = document.createElement("div");
  ov.id = "prw";
  ov.className = "lib";
  ov.innerHTML =
    '<div class="prtb">' +
    '<button id="pr-m" aria-label="মেনু">☰</button>' +
    '<input id="pr-p" type="number" min="1" inputmode="numeric" aria-label="পৃষ্ঠা নম্বর"><span class="prof" id="pr-of"></span>' +
    '<div class="prlb" id="pr-lb">আমার কিতাব</div>' +
    '<button id="pr-x" aria-label="বন্ধ">✕</button></div>' +
    '<div class="prlib" id="pr-lib"></div>' +
    '<div class="prstg" id="pr-s"></div>' +
    '<div class="prsl"><input id="pr-r" type="range" min="1" max="1" value="1" aria-label="পাতা সরান"></div>' +
    '<div class="prbkd" id="pr-bk"></div>' +
    '<div class="prmn"><div class="prmh"><b>পৃষ্ঠা খুঁজুন</b><button id="pr-mx">✕ বন্ধ</button></div>' +
    '<div class="prsr"><input id="pr-q" type="search" inputmode="numeric" placeholder="পৃষ্ঠা নম্বর লিখুন…" autocomplete="off"></div>' +
    '<div class="prres" id="pr-res"></div>' +
    '<div class="prft"><button id="pr-dir"></button><button id="pr-lbk">📚 কিতাবের তালিকা</button></div></div>';
  function $(id) { return ov.querySelector("#pr-" + id); }

  /* ---------- অবস্থা ---------- */
  var S = { view: "lib", page: 1, rtl: ls("pr-dir") !== "ltr", book: null };
  var pdfjs = null, DOC = null, NUM = 0, Z = 1, token = 0, cache = {}, order = [], books = [], opened = false;

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
      return r[0].getDocument({ data: new Uint8Array(r[1]), wasmUrl: BASE, isEvalSupported: false }).promise;
    });
  }
  function prefetchLib() {
    if (!navigator.onLine) return;
    ["pdf.min.js", "pdf.worker.min.js", "jbig2.wasm", "openjpeg.wasm", "qcms_bg.wasm"].forEach(function (f) { fetch(BASE + f).catch(function () {}); });
  }

  /* ---------- কিতাবের তালিকা ---------- */
  function saveBooks() { return idbSet("books", books); }
  function drawLib() {
    var h = '<label class="pradd">➕ PDF যোগ করুন<input type="file" id="pr-f" accept="application/pdf,.pdf" multiple style="display:none"></label>';
    if (!books.length) {
      h += '<div class="prhint">যেকোনো কিতাবের PDF এখানে যোগ করুন।<br>ফাইলটি আপনার ফোনের ভেতরেই থাকবে, কোথাও আপলোড হবে না।<br>একবার যোগ করলে ইন্টারনেট ছাড়াই পড়া যাবে।</div>';
    }
    books.forEach(function (b) {
      var last = parseInt(ls("pr-last-" + b.id), 10);
      h += '<div class="prbook" data-id="' + b.id + '"><span class="pric">📕</span><span class="prin"><b>' + esc(b.name) + "</b><small>" +
        bd(b.pages) + " পৃষ্ঠা · " + sizeTxt(b.size) + (last > 1 ? " · শেষ পড়া: পৃষ্ঠা " + bd(last) : "") +
        '</small></span><button class="prdel" data-del="' + b.id + '" aria-label="মুছুন">🗑</button></div>';
    });
    h += '<div class="prst" id="pr-st"></div>';
    $("lib").innerHTML = h;
    var f = $("f");
    if (f) f.onchange = function () { if (this.files && this.files.length) importFiles(this.files); this.value = ""; };
  }
  function lstat(t) { var e = $("st"); if (e) e.textContent = t || ""; }
  function importFiles(files) {
    var list = [].slice.call(files), i = 0, added = 0;
    try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}
    (function next() {
      if (i >= list.length) { drawLib(); if (added) lstat(bd(added) + "টি কিতাব যোগ হয়েছে ✔"); return; }
      var f = list[i++];
      lstat("খোলা হচ্ছে: " + f.name + " (" + bd(i) + "/" + bd(list.length) + ")");
      openBlob(f).then(function (doc) {
        var meta = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), name: f.name.replace(/\.pdf$/i, ""), pages: doc.numPages, size: f.size, added: Date.now() };
        try { doc.destroy(); } catch (e) {}
        return idbSet("b:" + meta.id, f).then(function () {
          books.push(meta); added++;
          return saveBooks();
        });
      }).catch(function () {
        alert("\"" + f.name + "\" খোলা যায়নি। এটা সঠিক PDF কিনা দেখুন, অথবা ফোনে জায়গা আছে কিনা দেখুন।");
      }).then(next);
    })();
  }
  function showLib() {
    token++;
    if (DOC) { try { DOC.destroy(); } catch (e) {} DOC = null; }
    cache = {}; order = [];
    S.view = "lib"; S.book = null;
    ov.classList.remove("rd", "mo"); ov.classList.add("lib");
    $("lb").textContent = "আমার কিতাব";
    $("s").innerHTML = "";
    drawLib();
  }
  function loadBooks() {
    return idbGet("books").then(function (b) { books = b || []; }).catch(function () { books = []; });
  }

  /* ---------- পাতা আঁকা ---------- */
  function render(n) {
    var sg = $("s"), W = sg.clientWidth, H = sg.clientHeight;
    var key = n + "|" + W + "x" + H + "|" + Z;
    if (cache[n] && cache[n].key === key) return Promise.resolve(cache[n].c);
    return DOC.getPage(n).then(function (page) {
      var v1 = page.getViewport({ scale: 1 });
      var fit = Z > 1 ? (W / v1.width) * Z : Math.min(W / v1.width, H / v1.height);
      var dpr = Math.min(window.devicePixelRatio || 1, 3);
      var vw = v1.width * fit * dpr, vh = v1.height * fit * dpr, cap = 14e6;
      if (vw * vh > cap) dpr = dpr * Math.sqrt(cap / (vw * vh));
      var vp = page.getViewport({ scale: fit * dpr });
      var c = document.createElement("canvas");
      c.width = Math.floor(vp.width); c.height = Math.floor(vp.height);
      c.style.width = Math.floor(v1.width * fit) + "px";
      c.style.height = Math.floor(v1.height * fit) + "px";
      return page.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise.then(function () {
        cache[n] = { key: key, c: c };
        order = order.filter(function (x) { return x !== n; }); order.push(n);
        while (order.length > 6) delete cache[order.shift()];
        return c;
      });
    });
  }
  function place(c, exitDir) {
    var sg = $("s"), old = sg.querySelector("canvas");
    var msg = sg.querySelector(".prmsg"); if (msg) sg.removeChild(msg);
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
  function info(icon, html) {
    var sg = $("s");
    sg.classList.remove("z");
    sg.innerHTML = '<div class="prmsg"><div class="big">' + icon + "</div><div>" + html + "</div></div>";
  }
  function labels() {
    $("p").value = S.page;
    $("r").value = S.page;
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
    S.page = n;
    if (S.book) ls("pr-last-" + S.book.id, n);
    Z = 1; $("s").classList.remove("z");
    labels();
    show(n, exitDir || 0);
  }
  function flip(delta) {
    var n = S.page + delta;
    if (n < 1 || n > NUM) return;
    var finger = (delta > 0) === S.rtl ? 1 : -1;   // পুরোনো পাতা আঙুলের দিকে বেরিয়ে যাবে
    go(n, finger);
  }

  /* ---------- কিতাব খোলা ---------- */
  function openBook(id) {
    var meta = null;
    books.forEach(function (b) { if (b.id === id) meta = b; });
    if (!meta) return;
    S.view = "rd"; S.book = meta;
    ov.classList.remove("lib"); ov.classList.add("rd");
    $("lb").textContent = meta.name;
    info("⏳", "খোলা হচ্ছে…");
    idbGet("b:" + id).then(function (blob) {
      if (!blob) throw new Error("missing");
      return openBlob(blob);
    }).then(function (d) {
      if (S.book !== meta) { try { d.destroy(); } catch (e) {} return; }
      DOC = d; NUM = d.numPages; cache = {}; order = [];
      $("r").max = NUM; $("p").max = NUM;
      $("of").textContent = "/ " + bd(NUM);
      $("r").style.direction = S.rtl ? "rtl" : "ltr";
      var last = parseInt(ls("pr-last-" + id), 10) || 1;
      go(Math.min(last, NUM));
    }).catch(function () {
      info("😔", "এই কিতাব খোলা যায়নি।<br><small>ফাইলটি মুছে গেছে বা নষ্ট হয়ে থাকতে পারে। কিতাবের তালিকা থেকে মুছে আবার যোগ করুন।</small>");
    });
  }

  /* ---------- মেনু: শুধু পৃষ্ঠা নম্বর খোঁজা ---------- */
  function drawRes() {
    var raw = ascii($("q").value).trim(), res = $("res");
    if (!raw) {
      res.innerHTML = '<div class="prem">পৃষ্ঠা নম্বর লিখুন (১ থেকে ' + bd(NUM || 1) + ")।<br>লিখে নিচের বোতাম বা কিবোর্ডের ✓ চাপুন।</div>";
      return;
    }
    var n = parseInt(raw, 10);
    if (!/^\d+$/.test(raw) || !(n >= 1 && n <= NUM)) {
      res.innerHTML = '<div class="prem">১ থেকে ' + bd(NUM) + " এর মধ্যে একটি সংখ্যা লিখুন।</div>";
      return;
    }
    res.innerHTML = '<button class="prgo" data-p="' + n + '"><span>↪</span><span>পৃষ্ঠা ' + bd(n) + "-এ যান</span></button>";
  }
  function openMenu() { ov.classList.add("mo"); $("q").value = ""; drawRes(); setTimeout(function () { try { $("q").focus(); } catch (e) {} }, 260); }
  function closeMenu() { ov.classList.remove("mo"); }
  function dirLabel() { $("dir").textContent = S.rtl ? "↔ ডানে টানলে পরের পাতা" : "↔ বামে টানলে পরের পাতা"; }

  /* ---------- চালু ও বন্ধ ---------- */
  function openIt() {
    if (opened) return;
    opened = true;
    ov.style.display = "flex";
    try { history.pushState({ pr: 1 }, ""); } catch (e) {}
    loadBooks().then(function () { showLib(); });
    setTimeout(prefetchLib, 1500);
  }
  function closeIt() {
    if (!opened) return;
    opened = false;
    closeMenu();
    if (DOC) { try { DOC.destroy(); } catch (e) {} DOC = null; }
    ov.style.display = "none";
  }
  $("x").onclick = function () {
    if (S.view === "rd") { showLib(); return; }
    var had = false;
    try { had = history.state && history.state.pr; } catch (e) {}
    if (had) history.back(); else closeIt();
  };
  window.addEventListener("popstate", function () {
    if (!opened) return;
    if (ov.classList.contains("mo")) { closeMenu(); try { history.pushState({ pr: 1 }, ""); } catch (e) {} return; }
    if (S.view === "rd") { showLib(); try { history.pushState({ pr: 1 }, ""); } catch (e) {} return; }
    closeIt();
  });

  $("lib").onclick = function (e) {
    var d = e.target.closest ? e.target.closest("[data-del]") : null;
    if (d) {
      e.stopPropagation();
      var id = d.getAttribute("data-del"), nm = "";
      books.forEach(function (b) { if (b.id === id) nm = b.name; });
      if (confirm("\"" + nm + "\" মুছে ফেলবেন? ফোন থেকে এই কিতাবের কপি মুছে যাবে।")) {
        books = books.filter(function (b) { return b.id !== id; });
        idbDel("b:" + id).then(saveBooks).then(drawLib).then(function () { dlForget(id); });
        try { localStorage.removeItem("pr-last-" + id); } catch (er) {}
      }
      return;
    }
    var b = e.target.closest ? e.target.closest(".prbook") : null;
    if (b) openBook(b.getAttribute("data-id"));
  };
  $("m").onclick = function () { if (DOC) openMenu(); };
  $("mx").onclick = closeMenu;
  $("bk").onclick = closeMenu;
  $("lbk").onclick = function () { closeMenu(); showLib(); };
  $("q").oninput = drawRes;
  $("q").onkeydown = function (e) {
    if (e.key === "Enter") {
      var n = parseInt(ascii(this.value).trim(), 10);
      if (DOC && n >= 1 && n <= NUM) { closeMenu(); go(n); }
    }
  };
  $("res").onclick = function (e) {
    var b = e.target.closest ? e.target.closest(".prgo") : null;
    if (b && DOC) { closeMenu(); go(parseInt(b.getAttribute("data-p"), 10)); }
  };
  $("p").onchange = function () { if (DOC && parseInt(this.value, 10) !== S.page) go(this.value); };
  $("p").onkeydown = function (e) { if (e.key === "Enter") this.blur(); };
  $("r").oninput = function () { $("p").value = this.value; };
  $("r").onchange = function () { if (DOC) go(this.value); };
  $("dir").onclick = function () {
    S.rtl = !S.rtl; ls("pr-dir", S.rtl ? "rtl" : "ltr"); dirLabel();
    $("r").style.direction = S.rtl ? "rtl" : "ltr";
  };
  dirLabel();

  // আঙুল দিয়ে পাতা উল্টানো + ডবল ট্যাপে বড় করা
  var sg0 = $("s"), px = 0, py = 0, pid = null, pt = 0, lastTap = 0;
  function zoomToggle() {
    if (!DOC) return;
    Z = Z > 1 ? 1 : 2.2;
    sg0.classList.toggle("z", Z > 1);
    show(S.page, 0);
  }
  sg0.addEventListener("pointerdown", function (e) {
    if (Z > 1) return;
    px = e.clientX; py = e.clientY; pid = e.pointerId; pt = Date.now();
  });
  sg0.addEventListener("pointercancel", function () { pid = null; });
  sg0.addEventListener("pointerup", function (e) {
    if (!DOC) return;
    var now = Date.now();
    if (Z > 1) {
      if (now - lastTap < 300) { zoomToggle(); lastTap = 0; } else lastTap = now;
      return;
    }
    if (pid !== e.pointerId) return;
    pid = null;
    var dx = e.clientX - px, dy = e.clientY - py;
    if (Math.abs(dx) > 50 && Math.abs(dx) > 1.4 * Math.abs(dy)) {
      flip((dx > 0) === S.rtl ? 1 : -1);
      lastTap = 0;
    } else if (Math.abs(dx) < 12 && Math.abs(dy) < 12 && now - pt < 350) {
      if (now - lastTap < 300) { zoomToggle(); lastTap = 0; } else lastTap = now;
    }
  });
  document.addEventListener("keydown", function (e) {
    if (!opened || S.view !== "rd" || ov.classList.contains("mo")) return;
    if (e.target && e.target.tagName === "INPUT") return;
    if (e.key === "ArrowLeft") flip(S.rtl ? 1 : -1);
    else if (e.key === "ArrowRight") flip(S.rtl ? -1 : 1);
  });
  window.addEventListener("resize", function () { if (opened && DOC) { cache = {}; order = []; show(S.page, 0); } });

  /* ---------- ডাউনলোড করে অফলাইনে রাখা (কিতাব ও কুরআনের PDF তালিকা থেকে) ----------
     ফাইল অ্যাপের নিজস্ব গোপন স্টোরেজে (IndexedDB) জমা হয়। ফোনের Downloads, গ্যালারি বা ফাইল ম্যানেজারে দেখা যায় না।
     অ্যাপের "পিডিএফ যোগ করে পড়ুন" রিডারেই পড়া যায়, ইন্টারনেট ছাড়াও। */
  var DL = {};
  try { DL = JSON.parse(ls("pr-dlmap") || "{}") || {}; } catch (e) { DL = {}; }
  function dlSave() { ls("pr-dlmap", JSON.stringify(DL)); }
  function say(m) { try { if (typeof window.toast === "function") { window.toast(m); return; } } catch (e) {} alert(m); }
  function dlState(url) {
    var id = DL[url];
    if (!id) return Promise.resolve("");
    return loadBooks().then(function () {
      var ok = books.some(function (b) { return b.id === id; });
      if (!ok) { delete DL[url]; dlSave(); return ""; }
      return id;
    });
  }
  function dlFetch(url, onp) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error("http");
      var total = parseInt(r.headers.get("content-length"), 10) || 0;
      if (!r.body || !r.body.getReader) return r.blob();
      var rd = r.body.getReader(), parts = [], got = 0;
      return (function pump() {
        return rd.read().then(function (x) {
          if (x.done) return new Blob(parts, { type: "application/pdf" });
          parts.push(x.value); got += x.value.length;
          if (onp) onp(got, total);
          return pump();
        });
      })();
    });
  }
  function dlBook(url, name, onp) {
    try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}
    return dlState(url).then(function (have) {
      if (have) return have;
      return dlFetch(url, onp).then(function (blob) {
        return openBlob(blob).then(function (doc) {
          var meta = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), name: name, pages: doc.numPages, size: blob.size, added: Date.now(), src: url };
          try { doc.destroy(); } catch (e) {}
          return idbSet("b:" + meta.id, blob)
            .then(function () { return loadBooks(); })
            .then(function () { books.push(meta); return saveBooks(); })
            .then(function () { DL[url] = meta.id; dlSave(); return meta.id; });
        });
      });
    });
  }
  function readSaved(id) {
    if (!opened) {
      opened = true;
      ov.style.display = "flex";
      try { history.pushState({ pr: 1 }, ""); } catch (e) {}
      setTimeout(prefetchLib, 1500);
    }
    loadBooks().then(function () { showLib(); openBook(id); });
  }
  function dlForget(id) {
    Object.keys(DL).forEach(function (u) { if (DL[u] === id) delete DL[u]; });
    dlSave();
    var bs = document.querySelectorAll('.mfdl[data-id="' + id + '"]');
    for (var i = 0; i < bs.length; i++) { bs[i].removeAttribute("data-id"); bs[i].disabled = false; bs[i].textContent = "⬇️ ডাউনলোড"; }
  }
  function dlDone(b, id) { b.setAttribute("data-id", id); b.disabled = false; b.textContent = "📖 অফলাইন পড়ুন"; }
  function dlScan() {
    var as = document.querySelectorAll("#lst .item a.chip[href], #qpf .item a.chip[href]");
    [].forEach.call(as, function (a) {
      var h = a.href || "";
      if (!/\.pdf(?:[?#].*)?$/i.test(h)) return;
      var it = a.parentNode;
      if (!it || it.querySelector(".mfdl")) return;
      var t = it.querySelector("b"), btn = document.createElement("button");
      btn.type = "button"; btn.className = "chip mfdl"; btn.style.marginRight = "6px";
      btn.setAttribute("data-u", h);
      btn.setAttribute("data-t", t ? t.textContent : "");
      btn.textContent = "⬇️ ডাউনলোড";
      it.insertBefore(btn, a);
      dlState(h).then(function (id) { if (id) dlDone(btn, id); });
    });
  }
  document.addEventListener("click", function (e) {
    var b = e.target && e.target.closest ? e.target.closest(".mfdl") : null;
    if (!b) return;
    e.preventDefault(); e.stopPropagation();
    var id = b.getAttribute("data-id");
    if (id) { readSaved(id); return; }
    if (b.disabled) return;
    if (navigator.onLine === false) { say("ডাউনলোড করতে ইন্টারনেট লাগবে"); return; }
    var url = b.getAttribute("data-u"), name = (b.getAttribute("data-t") || "").trim() || decodeURIComponent((url.split("?")[0].split("/").pop() || "কিতাব").replace(/\.pdf$/i, ""));
    b.disabled = true; b.textContent = "⏳ …";
    dlBook(url, name, function (got, total) {
      b.textContent = total ? "⏳ " + bd(Math.min(99, Math.round(got * 100 / total))) + "%" : "⏳ " + sizeTxt(got);
    }).then(function (nid) {
      dlDone(b, nid);
      say("ডাউনলোড হয়েছে। এখন ইন্টারনেট ছাড়াই পড়া যাবে ✔");
    }).catch(function () {
      b.disabled = false; b.textContent = "⬇️ ডাউনলোড";
      say("ডাউনলোড করা যায়নি। ইন্টারনেট দেখে আবার চেষ্টা করুন।");
    });
  }, true);
  function dlWatch() {
    var app = document.getElementById("app"), q = false;
    dlScan();
    if (app && window.MutationObserver) new MutationObserver(function () {
      if (q) return; q = true;
      setTimeout(function () { q = false; dlScan(); }, 60);
    }).observe(app, { childList: true, subtree: true });
  }

  /* ---------- মূল পাতায় ঘর: "কিতাব" ঘরের পাশে ---------- */
  function mountTile() {
    var app = document.getElementById("app");
    if (!app) return;
    var anchor = app.querySelector('.g3 .tile[data-v="library"]') || app.querySelector('.g3 .tile[data-v="quran"]');
    if (!anchor) return;
    var t = app.querySelector("#pr-tile");
    if (!t) {
      t = document.createElement("button");
      t.className = "tile";
      t.id = "pr-tile";
      t.innerHTML = "<span>📄</span><b>পিডিএফ যোগ করে পড়ুন</b>";
      t.onclick = openIt;
    }
    if (anchor.nextSibling !== t) anchor.parentNode.insertBefore(t, anchor.nextSibling);
  }
  function watch() {
    var app = document.getElementById("app");
    mountTile();
    if (app && window.MutationObserver) new MutationObserver(function () { mountTile(); }).observe(app, { childList: true });
  }
  function mount() { document.body.appendChild(ov); watch(); dlWatch(); }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);

  window.__pr = { open: openIt, flip: flip, go: go, S: S, dl: dlBook, state: dlState, read: readSaved };
})();
