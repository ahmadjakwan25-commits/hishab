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
    "#prw .prstg{position:relative;flex:1;overflow:hidden;touch-action:none;background:radial-gradient(circle at 50% 30%,#e8e2cd,#cfc8ae)}" +
    "#prw .prstg canvas{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:#fff;box-shadow:0 3px 14px rgba(0,0,0,.35);transition:transform .24s ease}" +
    "#prw .prstg.z{overflow:auto;touch-action:pan-x pan-y;-webkit-overflow-scrolling:touch}" +
    "#prw .prstg.z canvas{position:relative;left:auto;top:auto;transform:none;margin:0 auto;display:block;transition:none}" +
    "#prw .prmsg{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:24px;text-align:center;line-height:1.6;color:#3a3420}" +
    "#prw .prmsg .big{font-size:44px}" +
    "#prw .prsl{padding:6px 14px;padding-bottom:max(6px,env(safe-area-inset-bottom,0px));background:#145132}" +
    "#prw .prsl input{width:100%;margin:0;padding:0;accent-color:#f4c542}" +
    /* মোড: কিতাবের তালিকা / পড়ার পাতা */
    "#prw.lib .prstg,#prw.lib .prsl,#prw.lib #pr-p,#prw.lib .prof,#prw.lib #pr-m,#prw.lib .prct,#prw.lib #pr-bm{display:none}" +
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
    "#prw .prres{flex:0 0 auto;max-height:24%;overflow:auto;padding:4px 12px}" +
    "#prw .prgo{display:flex;align-items:center;gap:10px;width:100%;text-align:left;padding:12px;border:1px solid #17603c;border-radius:10px;background:#e3f1e8;color:#1c1a14;font-size:16px}" +
    "#prw .prem{padding:14px 6px;text-align:center;color:#7a735a;font-size:14px;line-height:1.6}" +
    "#prw .prft{display:flex;flex-wrap:wrap;gap:6px;padding:8px 12px;padding-bottom:max(8px,env(safe-area-inset-bottom,0px));border-top:1px solid #e0d6b0;background:#f4edd2}" +
    "#prw .prft button{flex:1;min-width:130px;padding:9px;border:1px solid #c9bd8f;border-radius:10px;background:#fff;font-size:13px;color:#3a3420}" +
    "#prw.land{inset:auto;top:0;transform:rotate(90deg);transform-origin:0 0}" +
    "#prw.fs .prtb,#prw.fs .prsl,#prw.fs .prct{display:none}" +
    "#prw .prct{display:flex;gap:6px;padding:6px 10px;background:#145132;align-items:center}" +
    "#prw .prct button{flex:1;min-width:0;border:0;border-radius:10px;padding:9px 4px;background:rgba(255,255,255,.18);color:#fff;font-size:15px;white-space:nowrap}" +
    "#prw .prct #pr-zf{flex:1.4;font-size:13px}" +
    "#prw .prct button.on,#prw .prtb #pr-bm.on{background:#f4c542;color:#3d2c02}" +
    "#prw .prbmh{display:flex;align-items:center;gap:8px;padding:8px 12px 4px;border-top:1px solid #e0d6b0}#prw .prbmh b{flex:1;font-size:15px}" +
    "#prw .prbmh button{border:1px solid #17603c;border-radius:10px;padding:7px 10px;background:#e3f1e8;color:#17603c;font-size:13px}" +
    "#prw .prbml{flex:1;overflow:auto;padding:4px 12px}" +
    "#prw .prbm{display:flex;gap:6px;margin-bottom:6px}" +
    "#prw .prbg{flex:1;display:flex;justify-content:space-between;align-items:center;text-align:left;padding:11px 12px;border:1px solid #d8c47a;border-radius:10px;background:#fff7d6;color:#1c1a14;font-size:15px}#prw .prbg small{color:#7a6a2a;font-size:12px}" +
    "#prw .prbd{border:0;border-radius:10px;padding:0 12px;background:#f3e0dc;color:#9a2b1f}" +
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
    '<button id="pr-bm" aria-label="বুকমার্ক">🔖</button><button id="pr-x" aria-label="বন্ধ">✕</button></div>' +
    '<div class="prlib" id="pr-lib"></div>' +
    '<div class="prstg" id="pr-s"></div>' +
    '<div class="prct"><button id="pr-pv" aria-label="আগের পাতা">‹ আগের</button><button id="pr-zo" aria-label="ছোট করুন">➖</button><button id="pr-zf" aria-label="মাপ ঠিক করুন">১০০%</button><button id="pr-zi" aria-label="বড় করুন">➕</button><button id="pr-nx" aria-label="পরের পাতা">পরের ›</button><button id="pr-ro" aria-label="আড়াআড়ি">🔄</button></div>' +
    '<div class="prsl"><input id="pr-r" type="range" min="1" max="1" value="1" aria-label="পাতা সরান"></div>' +
    '<div class="prbkd" id="pr-bk"></div>' +
    '<div class="prmn"><div class="prmh"><b>পৃষ্ঠা খুঁজুন</b><button id="pr-mx">✕ বন্ধ</button></div>' +
    '<div class="prsr"><input id="pr-q" type="search" inputmode="numeric" placeholder="পৃষ্ঠা নম্বর লিখুন…" autocomplete="off"></div>' +
    '<div class="prres" id="pr-res"></div>' +
    '<div class="prbmh"><b>🔖 বুকমার্ক</b><button id="pr-bma"></button></div><div class="prbml" id="pr-bml"></div>' +
    '<div class="prft"><button id="pr-dir"></button><button id="pr-ro2">🔄 আড়াআড়ি</button><button id="pr-lbk">📚 কিতাবের তালিকা</button></div></div>';
  function $(id) { return ov.querySelector("#pr-" + id); }

  /* ---------- অবস্থা ---------- */
  var S = { view: "lib", page: 1, rtl: ls("pr-dir") !== "ltr", book: null, dl: false, land: ls("pr-land") === "1" };
  var pdfjs = null, DOC = null, NUM = 0, Z = 1, token = 0, cache = {}, order = [], books = [], dlbooks = [], opened = false;

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
    S.view = "lib"; S.book = null; S.dl = false;
    ov.classList.remove("rd", "mo", "fs"); ov.classList.add("lib");
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
      var fit = Math.min(W / v1.width, H / v1.height) * Z;
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
    var sg = $("s"), old = sg.querySelector("canvas"), pf = pendingFocus;
    pendingFocus = null;
    var msg = sg.querySelector(".prmsg"); if (msg) sg.removeChild(msg);
    if (Z > 1 || !old || !exitDir) {
      while (sg.firstChild) sg.removeChild(sg.firstChild);
      sg.appendChild(c);
      sg.classList.toggle("z", Z > 1);
      if (Z > 1) {
        if (pf) {
          sg.scrollLeft = c.offsetLeft + pf.fx * c.offsetWidth - pf.vx;
          sg.scrollTop = c.offsetTop + pf.fy * c.offsetHeight - pf.vy;
        } else { sg.scrollLeft = (sg.scrollWidth - sg.clientWidth) / 2; sg.scrollTop = 0; }
      }
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
    zlabel(); bmDraw();
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
  function go(n, exitDir, keepZ) {
    n = parseInt(n, 10);
    if (!(n >= 1)) n = 1;
    if (n > NUM) n = NUM;
    S.page = n;
    if (S.book) ls("pr-last-" + S.book.id, n);
    if (!keepZ) { Z = 1; $("s").classList.remove("z"); }
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
  function openBook(id, dl) {
    var meta = null;
    (dl ? dlbooks : books).forEach(function (b) { if (b.id === id) meta = b; });
    if (!meta) return;
    S.view = "rd"; S.book = meta; S.dl = !!dl;
    ov.classList.remove("lib", "fs"); ov.classList.add("rd");
    $("lb").textContent = meta.name;
    info("⏳", "খোলা হচ্ছে…");
    idbGet((dl ? "d:" : "b:") + id).then(function (blob) {
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
  function openMenu() { ov.classList.add("mo"); $("lbk").textContent = S.dl ? "⬅️ তালিকায় ফিরুন" : "📚 কিতাবের তালিকা"; $("q").value = ""; drawRes(); bmDraw(); setTimeout(function () { try { $("q").focus(); } catch (e) {} }, 260); }
  function closeMenu() { ov.classList.remove("mo"); }
  function dirLabel() { $("dir").textContent = S.rtl ? "↔ ডানে টানলে পরের পাতা" : "↔ বামে টানলে পরের পাতা"; }

  /* ---------- চালু ও বন্ধ ---------- */
  function openIt() {
    if (opened) return;
    opened = true;
    ov.style.display = "flex"; applyLand();
    try { history.pushState({ pr: 1 }, ""); } catch (e) {}
    loadBooks().then(function () { showLib(); });
    setTimeout(prefetchLib, 1500);
  }
  function closeIt() {
    if (!opened) return;
    opened = false;
    closeMenu(); ov.classList.remove("fs");
    if (DOC) { try { DOC.destroy(); } catch (e) {} DOC = null; }
    ov.style.display = "none";
  }
  $("x").onclick = function () {
    if (S.view === "rd") { if (S.dl) { leaveDl(); return; } showLib(); return; }
    var had = false;
    try { had = history.state && history.state.pr; } catch (e) {}
    if (had) history.back(); else closeIt();
  };
  window.addEventListener("popstate", function () {
    if (!opened) return;
    if (ov.classList.contains("mo")) { closeMenu(); try { history.pushState({ pr: 1 }, ""); } catch (e) {} return; }
    if (S.view === "rd") { if (S.dl) { closeIt(); return; } showLib(); try { history.pushState({ pr: 1 }, ""); } catch (e) {} return; }
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
        idbDel("b:" + id).then(saveBooks).then(drawLib);
        try { localStorage.removeItem("pr-last-" + id); localStorage.removeItem("pr-bm-" + id); } catch (er) {}
      }
      return;
    }
    var b = e.target.closest ? e.target.closest(".prbook") : null;
    if (b) openBook(b.getAttribute("data-id"));
  };
  $("m").onclick = function () { if (DOC) openMenu(); };
  $("mx").onclick = closeMenu;
  $("bk").onclick = closeMenu;
  $("lbk").onclick = function () { closeMenu(); if (S.dl) leaveDl(); else showLib(); };
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

  /* ---------- জুম, আড়াআড়ি, বুকমার্ক ---------- */
  var pendingFocus = null, multi = false, pz = null, ZST = [1, 1.4, 2, 2.8, 4, 6];
  function clamp01(v) { return v !== v ? 0.5 : Math.max(0, Math.min(1, v)); }
  function zlabel() { $("zf").textContent = bd(Math.round(Z * 100)) + "%"; }
  function curFocus() {
    var sg = $("s"), c = sg.querySelector("canvas"), vx = sg.clientWidth / 2, vy = sg.clientHeight / 2;
    if (!c || Z <= 1 || !c.offsetWidth) return { fx: 0.5, fy: 0.5, vx: vx, vy: vy };
    return { fx: clamp01((sg.scrollLeft + vx - c.offsetLeft) / c.offsetWidth), fy: clamp01((sg.scrollTop + vy - c.offsetTop) / c.offsetHeight), vx: vx, vy: vy };
  }
  function setZoom(nz, f) {
    if (!DOC) return;
    nz = Math.max(1, Math.min(6, nz));
    if (Math.abs(nz - Z) < 0.01) { zlabel(); return; }
    pendingFocus = f || curFocus();
    Z = nz;
    $("s").classList.toggle("z", Z > 1);
    zlabel();
    show(S.page, 0);
  }
  function zoomStep(dir) {
    var i;
    if (dir > 0) { for (i = 0; i < ZST.length; i++) if (ZST[i] > Z + 0.01) { setZoom(ZST[i]); return; } }
    else { for (i = ZST.length - 1; i >= 0; i--) if (ZST[i] < Z - 0.01) { setZoom(ZST[i]); return; } }
  }
  function step(d) {
    if (!DOC) return;
    var n = S.page + d;
    if (n < 1 || n > NUM) return;
    go(n, 0, true);
  }
  // আড়াআড়ি: ফোন সোজা ধরা থাকলেও পাতা আড়াআড়ি দেখায় (ফোন বাঁয়ে ঘুরিয়ে ধরুন)
  function landLabel() { $("ro").className = S.land ? "on" : ""; $("ro2").textContent = S.land ? "↩ সোজা করুন" : "🔄 আড়াআড়ি"; }
  function applyLand() {
    var want = !!S.land && window.innerHeight > window.innerWidth;
    ov.classList.toggle("land", want);
    if (want) { ov.style.width = window.innerHeight + "px"; ov.style.height = window.innerWidth + "px"; ov.style.left = window.innerWidth + "px"; }
    else { ov.style.width = ""; ov.style.height = ""; ov.style.left = ""; }
    landLabel();
  }
  function toggleLand() {
    S.land = !S.land; ls("pr-land", S.land ? "1" : "0");
    applyLand();
    if (DOC) { cache = {}; order = []; show(S.page, 0); }
  }
  function loc(e) { return ov.classList.contains("land") ? { x: e.clientY, y: window.innerWidth - e.clientX } : { x: e.clientX, y: e.clientY }; }
  // বুকমার্ক (প্রতিটি কিতাবের আলাদা, ফোনেই জমা থাকে)
  function bmKey() { return "pr-bm-" + (S.book ? S.book.id : ""); }
  function bmGet() { try { var a = JSON.parse(ls(bmKey()) || "[]"); return a && a.length !== undefined ? a : []; } catch (e) { return []; } }
  function bmDraw() {
    if (!S.book) return;
    var a = bmGet(), has = a.some(function (b) { return b.p === S.page; });
    $("bm").className = has ? "on" : "";
    $("bma").textContent = has ? "✕ বুকমার্ক সরান" : "➕ এই পৃষ্ঠা (" + bd(S.page) + ")";
    $("bml").innerHTML = a.length ? a.map(function (b) {
      var d = ""; try { d = new Date(b.t).toLocaleDateString("bn-BD", { day: "numeric", month: "short" }); } catch (e) {}
      return '<div class="prbm"><button class="prbg" data-bg="' + b.p + '"><span>🔖 পৃষ্ঠা ' + bd(b.p) + "</span><small>" + d + '</small></button><button class="prbd" data-bd="' + b.p + '" aria-label="মুছুন">✕</button></div>';
    }).join("") : '<div class="prem">কোনো বুকমার্ক নেই।<br>পড়তে পড়তে 🔖 চেপে যেকোনো পৃষ্ঠা রেখে দিন।</div>';
  }
  function bmToggle() {
    if (!S.book || !DOC) return;
    var a = bmGet(), i = -1;
    a.forEach(function (b, k) { if (b.p === S.page) i = k; });
    if (i >= 0) a.splice(i, 1); else a.push({ p: S.page, t: Date.now() });
    a.sort(function (x, y) { return x.p - y.p; });
    ls(bmKey(), JSON.stringify(a));
    bmDraw();
    say(i >= 0 ? "বুকমার্ক সরানো হয়েছে" : "পৃষ্ঠা " + bd(S.page) + " বুকমার্ক করা হয়েছে 🔖");
  }
  $("pv").onclick = function () { step(-1); };
  $("nx").onclick = function () { step(1); };
  $("zo").onclick = function () { zoomStep(-1); };
  $("zi").onclick = function () { zoomStep(1); };
  $("zf").onclick = function () { setZoom(1); };
  $("ro").onclick = toggleLand;
  $("ro2").onclick = function () { closeMenu(); toggleLand(); };
  $("bm").onclick = bmToggle;
  $("bma").onclick = bmToggle;
  $("bml").onclick = function (e) {
    var g = e.target.closest ? e.target.closest("[data-bg]") : null, d = e.target.closest ? e.target.closest("[data-bd]") : null;
    if (d) {
      var p = parseInt(d.getAttribute("data-bd"), 10), a = bmGet().filter(function (b) { return b.p !== p; });
      ls(bmKey(), JSON.stringify(a)); bmDraw();
    } else if (g && DOC) { closeMenu(); go(parseInt(g.getAttribute("data-bg"), 10)); }
  };
  landLabel();

  // আঙুল দিয়ে পাতা উল্টানো + ডবল ট্যাপে বড় করা
  var sg0 = $("s"), px = 0, py = 0, pid = null, pt = 0, lastTap = 0, tapT = 0;
  function zoomToggle() { setZoom(Z > 1 ? 1 : 2.2); }
  // একবার ছুঁলে উপর-নিচের সবুজ অংশ লুকিয়ে পুরো পর্দায় কিতাব, আবার ছুঁলে ফিরে আসে
  function toggleFs() {
    if (!DOC || S.view !== "rd" || ov.classList.contains("mo")) return;
    var f = curFocus();
    ov.classList.toggle("fs");
    var sg = $("s");
    f.vx = sg.clientWidth / 2; f.vy = sg.clientHeight / 2;
    pendingFocus = Z > 1 ? f : null;
    cache = {}; order = [];
    show(S.page, 0);
  }
  sg0.addEventListener("pointerdown", function (e) {
    var lp = loc(e); px = lp.x; py = lp.y; pid = e.pointerId; pt = Date.now();
  });
  sg0.addEventListener("pointercancel", function () { pid = null; });
  sg0.addEventListener("pointerup", function (e) {
    if (!DOC || multi) return;
    if (pid !== e.pointerId) return;
    pid = null;
    var now = Date.now(), lq = loc(e), dx = lq.x - px, dy = lq.y - py;
    if (Z <= 1 && Math.abs(dx) > 50 && Math.abs(dx) > 1.4 * Math.abs(dy)) {
      clearTimeout(tapT); tapT = 0; lastTap = 0;
      flip((dx > 0) === S.rtl ? 1 : -1);
    } else if (Math.abs(dx) < 12 && Math.abs(dy) < 12 && now - pt < 350) {
      if (tapT && now - lastTap < 320) { clearTimeout(tapT); tapT = 0; lastTap = 0; zoomToggle(); }
      else { lastTap = now; clearTimeout(tapT); tapT = setTimeout(function () { tapT = 0; lastTap = 0; toggleFs(); }, 300); }
    }
  });
  // দুই আঙুলে চিমটি দিয়ে ছোট-বড়
  function spt(t) {
    var p = loc(t);
    if (ov.classList.contains("land")) return { x: p.x - sg0.offsetLeft, y: p.y - sg0.offsetTop };
    var r = sg0.getBoundingClientRect();
    return { x: p.x - r.left, y: p.y - r.top };
  }
  function tdist(t) { var dx = t[0].clientX - t[1].clientX, dy = t[0].clientY - t[1].clientY; return Math.sqrt(dx * dx + dy * dy); }
  sg0.addEventListener("touchstart", function (e) {
    if (e.touches.length >= 2) { multi = true; pid = null; }
    if (e.touches.length !== 2 || !DOC) return;
    var c = sg0.querySelector("canvas"); if (!c || !c.offsetWidth) return;
    var p0 = spt(e.touches[0]), p1 = spt(e.touches[1]);
    var vx = (p0.x + p1.x) / 2, vy = (p0.y + p1.y) / 2, fx, fy;
    clearTimeout(tapT); tapT = 0;
    if (Z > 1) { fx = (sg0.scrollLeft + vx - c.offsetLeft) / c.offsetWidth; fy = (sg0.scrollTop + vy - c.offsetTop) / c.offsetHeight; }
    else { fx = (vx - (sg0.clientWidth - c.offsetWidth) / 2) / c.offsetWidth; fy = (vy - (sg0.clientHeight - c.offsetHeight) / 2) / c.offsetHeight; }
    pz = { d0: tdist(e.touches) || 1, z0: Z, r: 1, c: c, f: { fx: clamp01(fx), fy: clamp01(fy), vx: vx, vy: vy } };
  }, { passive: true });
  sg0.addEventListener("touchmove", function (e) {
    if (!pz || e.touches.length !== 2) return;
    if (e.cancelable) e.preventDefault();
    var r = Math.max(1 / pz.z0, Math.min(6 / pz.z0, tdist(e.touches) / pz.d0)); pz.r = r;
    pz.c.style.transition = "none";
    pz.c.style.transformOrigin = (pz.f.fx * 100) + "% " + (pz.f.fy * 100) + "%";
    pz.c.style.transform = (pz.z0 > 1 ? "" : "translate(-50%,-50%) ") + "scale(" + r + ")";
  }, { passive: false });
  function endPinch(e) {
    if (e.touches.length === 0) setTimeout(function () { multi = false; }, 80);
    if (!pz || e.touches.length >= 2) return;
    var p = pz; pz = null;
    p.c.style.transform = ""; p.c.style.transformOrigin = ""; p.c.style.transition = "";
    if (Math.abs(p.r - 1) > 0.06) setZoom(p.z0 * p.r, p.f);
  }
  sg0.addEventListener("touchend", endPinch, { passive: true });
  sg0.addEventListener("touchcancel", endPinch, { passive: true });
  document.addEventListener("keydown", function (e) {
    if (!opened || S.view !== "rd" || ov.classList.contains("mo")) return;
    if (e.target && e.target.tagName === "INPUT") return;
    if (e.key === "ArrowLeft") flip(S.rtl ? 1 : -1);
    else if (e.key === "ArrowRight") flip(S.rtl ? -1 : 1);
  });
  window.addEventListener("resize", function () {
    if (!opened) return;
    var ae = document.activeElement;
    if (ae && ae.tagName === "INPUT" && ov.contains(ae)) return;   // কিবোর্ড খুললে ঘোরানো বদলায় না
    applyLand();
    if (DOC) { cache = {}; order = []; show(S.page, 0); }
  });

  /* ---------- কিতাব ও কুরআন: অনলাইন / অফলাইন ----------
     অনলাইন তালিকায় শুধু ডাউনলোড বোতাম থাকে। ডাউনলোড হলে কিতাব অফলাইন তালিকায় যায় এবং সেখান থেকেই পড়া যায়।
     ফাইল অ্যাপের গোপন স্টোরেজে (IndexedDB) জমা হয়, "পিডিএফ যোগ করে পড়ুন"-এর আমার কিতাব থেকে আলাদা।
     ফোনের Downloads, গ্যালারি বা ফাইল ম্যানেজারে দেখা যায় না। */
  var DM = ls("pr-dlmode") === "off" ? "off" : "on", dlLoaded = false, dlReady = false;
  var st2 = document.createElement("style");
  st2.textContent =
    ".mfdl,.mfrd,.mfrm{white-space:nowrap;cursor:pointer}" +
    '#app[data-v="library"] #lst .item>div:first-child,#qpf .item>div:first-child,#app[data-v="library"] #lst .item small,#qpf .item small,.mfoff .item>div:first-child,.mfoff .item small{text-align:left!important;hyphens:manual!important;word-spacing:normal!important}' +
    ".mfact{display:flex;flex-direction:column;gap:6px;align-items:stretch;flex:none}" +
    ".mfact .chip{margin:0!important;text-align:center;white-space:nowrap;padding:7px 12px!important;font-size:14px!important}" +
    ".mfoff .item .mfrd,.mfoff .item .mfrm{font-size:14px;padding:7px 12px}" +
    ".mfdl,.mfrd{border:0!important;padding:8px 15px;font-weight:700;background:linear-gradient(135deg,#f6dc8a,#d9a21f);color:#3d2c02!important;box-shadow:0 6px 12px -6px rgba(217,162,31,.9)}" +
    ".mfdl[data-have]{background:linear-gradient(135deg,#bfe5cc,#5fae7e);box-shadow:none}" +
    ".mfrm{margin-left:6px}" +
    ".mfbar{margin:0 0 10px}";
  document.head.appendChild(st2);

  /* গুগল ড্রাইভের লিংক: Drive API দিয়ে ডাউনলোড (লিংকের ফাইল "Anyone with the link" শেয়ার করা থাকতে হবে)
     নিচের "" এর ভেতরে আপনার Google Drive API key বসান। ফাঁকা থাকলে ড্রাইভের লিংকে ডাউনলোড বোতাম আসবে না। */
  var DRIVE_KEY = window.MF_DRIVE_KEY || "AIzaSyAMxbHl91IWUWXTGIalFfmq8HP1eiaFtWQ";
  function driveId(u) {
    if (!/^https?:\/\/(?:drive|docs)\.google\.com\//i.test(u || "")) return "";
    var m = /\/file\/d\/([\w-]{15,})/.exec(u) || /[?&]id=([\w-]{15,})/.exec(u);
    return m ? m[1] : "";
  }
  function realUrl(u) {
    var id = driveId(u);
    return id && DRIVE_KEY ? "https://www.googleapis.com/drive/v3/files/" + id + "?alt=media&supportsAllDrives=true&key=" + encodeURIComponent(DRIVE_KEY) : u;
  }
  function say(m) { try { if (typeof window.toast === "function") { window.toast(m); return; } } catch (e) {} alert(m); }
  function loadDl() { return idbGet("dlbooks").then(function (b) { dlbooks = b || []; }).catch(function () { dlbooks = []; }); }
  function saveDl() { return idbSet("dlbooks", dlbooks); }
  function dlFetch(url, onp) {
    return fetch(realUrl(url)).then(function (r) {
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
  function findDl(url, kind) {
    for (var i = 0; i < dlbooks.length; i++) if (dlbooks[i].src === url && dlbooks[i].kind === kind) return dlbooks[i];
    return null;
  }
  function dlAdd(url, name, author, kind, onp) {
    try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}
    return loadDl().then(function () {
      var ex = findDl(url, kind);
      if (ex) return ex.id;
      return dlFetch(url, onp).then(function (blob) {
        return openBlob(blob).then(function (doc) {
          var meta = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), name: name, author: author || "", kind: kind, pages: doc.numPages, size: blob.size, added: Date.now(), src: url };
          try { doc.destroy(); } catch (e) {}
          return idbSet("d:" + meta.id, blob)
            .then(function () { return loadDl(); })
            .then(function () { dlbooks.push(meta); return saveDl(); })
            .then(function () { return meta.id; });
        });
      });
    });
  }
  function readDl(id) {
    if (!opened) {
      opened = true;
      ov.style.display = "flex"; applyLand();
      try { history.pushState({ pr: 1 }, ""); } catch (e) {}
      setTimeout(prefetchLib, 1500);
    }
    loadDl().then(function () { openBook(id, true); });
  }
  function leaveDl() {
    var had = false;
    try { had = history.state && history.state.pr; } catch (e) {}
    if (had) history.back(); else closeIt();
  }
  function delDl(id) {
    var nm = "";
    dlbooks.forEach(function (b) { if (b.id === id) nm = b.name; });
    if (!confirm("\"" + nm + "\" অফলাইন থেকে মুছে ফেলবেন? চাইলে আবার অনলাইন থেকে ডাউনলোড করা যাবে।")) return;
    idbDel("d:" + id).then(function () {
      dlbooks = dlbooks.filter(function (b) { return b.id !== id; });
      return saveDl();
    }).then(function () { try { localStorage.removeItem("pr-last-" + id); localStorage.removeItem("pr-bm-" + id); } catch (er) {} dlScan(); });
  }
  function offHtml(list) {
    if (!list.length) return '<div class="empty">কিছু ডাউনলোড করা নেই।<br>অনলাইন থেকে ডাউনলোড করলে এখানে আসবে, তখন ইন্টারনেট ছাড়াই পড়া যাবে।</div>';
    return list.map(function (b) {
      return '<div class="item fi"><div style="flex:1"><b>' + esc(b.name) + "</b><small>" + esc(b.author || "") + (b.author ? " · " : "") + bd(b.pages) + " পৃষ্ঠা · " + sizeTxt(b.size) +
        '</small></div><button type="button" class="chip mfrd" data-id="' + b.id + '">📖 পড়ুন</button><button type="button" class="chip mfrm" data-id="' + b.id + '" aria-label="মুছুন">🗑</button></div>';
    }).join("");
  }
  /* কোন লিংক ডাউনলোড করা যাবে তা আগে যাচাই করা হয়: যেটা যাবে না তাতে ডাউনলোড বোতাম আসে না */
  var PC = {}, PQ = [], PS = {}, PR = 0, dlTimer = null;
  try { PC = JSON.parse(ls("pr-probe") || "{}") || {}; } catch (e) { PC = {}; }
  function probeSave() { try { ls("pr-probe", JSON.stringify(PC)); } catch (e) {} }
  function probeState(u) {
    var p = PC[u];
    if (!p) return undefined;
    var ttl = p.r ? 7 * 864e5 : 3 * 6e4;   // ব্যর্থ হলে মাত্র ৩ মিনিট মনে রাখে (নতুন আপলোডের ফাইল তৈরি হতে সময় লাগে)
    if (Date.now() - p.t > ttl) { delete PC[u]; return undefined; }
    return p.r;
  }
  function probeOne(u) {
    var ac = window.AbortController ? new AbortController() : null;
    var to = setTimeout(function () { try { if (ac) ac.abort(); } catch (e) {} }, 8000);
    return fetch(realUrl(u), ac ? { signal: ac.signal } : {}).then(function (r) {
      clearTimeout(to);
      var ct = ((r.headers && r.headers.get("content-type")) || "").toLowerCase();
      var ok = !!r.ok && ct.indexOf("text/html") < 0;
      try { if (ac) ac.abort(); } catch (e) {}
      return ok;
    });
  }
  function dlSchedule() { clearTimeout(dlTimer); dlTimer = setTimeout(dlScan, 80); }
  function pumpProbes() {
    while (PR < 3 && PQ.length) {
      (function (u) {
        PR++;
        probeOne(u).then(function (ok) { PC[u] = { r: ok ? 1 : 0, t: Date.now() }; })
          .catch(function () { PC[u] = { r: 0, t: Date.now() }; })
          .then(function () { probeSave(); delete PS[u]; PR--; dlSchedule(); pumpProbes(); });
      })(PQ.shift());
    }
  }
  function queueProbe(u) {
    if (PS[u] || navigator.onLine === false) return;
    PS[u] = 1; PQ.push(u); pumpProbes();
  }
  window.addEventListener("online", dlSchedule);
  function setDisp(el, v) { if (el.style.display !== v) el.style.display = v; }
  function dlCtxs() {
    var app = document.getElementById("app"), v = app ? app.getAttribute("data-v") : "", out = [], l, q;
    if (v === "library" && (l = document.getElementById("lst"))) out.push({ kind: "books", box: l });
    if ((q = document.getElementById("qpf"))) out.push({ kind: "quran", box: q });
    return out;
  }
  function dlScan() {
    if (!dlLoaded) { dlLoaded = true; loadDl().then(function () { dlReady = true; dlScan(); }); return; }
    if (!dlReady) return;
    dlCtxs().forEach(function (c) {
      var box = c.box, par = box.parentNode;
      if (!par) return;
      var bar = box.previousElementSibling;
      if (!bar || !bar.classList || !bar.classList.contains("mfbar")) {
        bar = document.createElement("div"); bar.className = "qtabs mfbar";
        par.insertBefore(bar, box);
      }
      var mine = dlbooks.filter(function (b) { return b.kind === c.kind; });
      var th = '<button type="button" class="qtab mftab' + (DM === "on" ? " on" : "") + '" data-m="on">🌐 অনলাইন</button>' +
        '<button type="button" class="qtab mftab' + (DM === "off" ? " on" : "") + '" data-m="off">📥 অফলাইন (' + bd(mine.length) + ")</button>";
      if (bar.getAttribute("data-sig") !== th) { bar.innerHTML = th; bar.setAttribute("data-sig", th); }
      var off = box.nextElementSibling;
      if (!off || !off.classList || !off.classList.contains("mfoff")) {
        off = document.createElement("div"); off.className = c.kind === "books" ? "panel mfoff" : "mfoff";
        par.insertBefore(off, box.nextSibling);
      }
      if (DM === "on") {
        setDisp(box, ""); setDisp(off, "none");
        [].forEach.call(box.querySelectorAll(".item"), function (it) {
          var a = it.querySelector("a.chip[href]"), btn = it.querySelector(".mfdl");
          if (!a && !btn) return;
          var url = btn ? btn.getAttribute("data-u") : a.href;
          var have = !!findDl(url, c.kind);
          var isPdf = /\.pdf(?:[?#].*)?$/i.test(url || "") || (!!DRIVE_KEY && !!driveId(url));
          var ok = have || (isPdf && probeState(url) === 1);
          if (!ok) {
            if (btn && !btn.getAttribute("data-busy") && btn.parentNode) btn.parentNode.removeChild(btn);
            if (isPdf && probeState(url) === undefined) queueProbe(url);
            return;
          }
          if (!btn) {
            var t = it.querySelector("b"), au = it.querySelector("small");
            btn = document.createElement("button");
            btn.type = "button"; btn.className = "chip mfdl";
            btn.setAttribute("data-u", url); btn.setAttribute("data-k", c.kind);
            btn.setAttribute("data-t", t ? t.textContent : ""); btn.setAttribute("data-a", au ? au.textContent : "");
            var w = a && a.parentNode === it ? document.createElement("span") : null;
            if (w) { w.className = "mfact"; it.insertBefore(w, a); w.appendChild(a); w.appendChild(btn); }
            else it.appendChild(btn);
          }
          if (btn.getAttribute("data-busy")) return;
          var want = have ? "✔ ডাউনলোড হয়েছে" : "⬇️ ডাউনলোড";
          if (btn.textContent !== want) btn.textContent = want;
          if (have && !btn.getAttribute("data-have")) btn.setAttribute("data-have", "1");
          if (!have && btn.getAttribute("data-have")) btn.removeAttribute("data-have");
        });
      } else {
        setDisp(box, "none"); setDisp(off, "");
        var sig = mine.map(function (b) { return b.id; }).join(",") + "|" + DM;
        if (off.getAttribute("data-sig") !== sig) { off.innerHTML = offHtml(mine); off.setAttribute("data-sig", sig); }
      }
    });
  }
  document.addEventListener("click", function (e) {
    var t = e.target && e.target.closest ? e.target.closest(".mftab,.mfdl,.mfrd,.mfrm") : null;
    if (!t) return;
    e.preventDefault(); e.stopPropagation();
    var cl = t.classList;
    if (cl.contains("mftab")) { DM = t.getAttribute("data-m") === "off" ? "off" : "on"; ls("pr-dlmode", DM); dlScan(); return; }
    if (cl.contains("mfrd")) { readDl(t.getAttribute("data-id")); return; }
    if (cl.contains("mfrm")) { delDl(t.getAttribute("data-id")); return; }
    // ডাউনলোড বোতাম
    if (t.getAttribute("data-have")) { DM = "off"; ls("pr-dlmode", DM); dlScan(); return; }
    if (t.getAttribute("data-busy")) return;
    if (navigator.onLine === false) { say("ডাউনলোড করতে ইন্টারনেট লাগবে"); return; }
    var url = t.getAttribute("data-u"), kind = t.getAttribute("data-k") || "books";
    var name = (t.getAttribute("data-t") || "").trim() || decodeURIComponent((url.split("?")[0].split("/").pop() || "কিতাব").replace(/\.pdf$/i, ""));
    t.setAttribute("data-busy", "1"); t.textContent = "⏳ …";
    dlAdd(url, name, (t.getAttribute("data-a") || "").trim(), kind, function (got, total) {
      t.textContent = total ? "⏳ " + bd(Math.min(99, Math.round(got * 100 / total))) + "%" : "⏳ " + sizeTxt(got);
    }).then(function () {
      t.removeAttribute("data-busy"); dlScan();
      say("ডাউনলোড হয়েছে। এখন অফলাইন ট্যাব থেকে ইন্টারনেট ছাড়াই পড়া যাবে ✔");
    }).catch(function () {
      t.removeAttribute("data-busy"); t.textContent = "⬇️ ডাউনলোড";
      say("ডাউনলোড করা যায়নি। এটা সরাসরি PDF লিংক কিনা এবং ইন্টারনেট ঠিক আছে কিনা দেখুন।");
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

  window.__pr = { open: openIt, flip: flip, go: go, S: S, read: readDl };
})();
