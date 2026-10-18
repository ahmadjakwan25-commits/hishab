/* আল-মিফতাহ: শেয়ার অ্যাপ
   মূল পাতার নিচে "শেয়ার অ্যাপ" ঘর। চাপলে হোয়াটসঅ্যাপ, ফেসবুক, টেলিগ্রাম, এসএমএস, ইমেইল বা লিংক কপির মাধ্যমে অ্যাপ শেয়ার করা যায়। */
(function () {
  "use strict";

  // ▼ এখানে নিজের অ্যাপ বা ডাউনলোড লিংক বসাতে পারেন। ফাঁকা থাকলে এই ওয়েব-অ্যাপের লিংকই শেয়ার হবে।
  var LINK = "";
  // ▼ শেয়ারের সাথে যে লেখা যাবে
  var TEXT = "আল-মিফতাহ: ইবাদত ও হিসাব এক জায়গায়। কুরআন, হাদিস, নামাজের সময়, দোয়া ও আরও অনেক কিছু। অ্যাপটি ব্যবহার করুন:";

  function link() { return LINK || (location.origin + location.pathname.replace(/[^\/]*$/, "")); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function enc(s) { return encodeURIComponent(s); }

  var st = document.createElement("style");
  st.textContent =
    "#sh-card{display:flex;align-items:center;gap:12px;width:100%;margin:16px 0 104px;padding:14px 16px;border:2px solid #d8b64a;border-radius:16px;background:linear-gradient(135deg,#145132,#1f7d4e 60%,#2a8f5c);color:#fff;text-align:left;font:inherit;cursor:pointer;box-shadow:0 4px 12px rgba(20,81,50,.35)}" +
    "#sh-card .ci{font-size:34px;line-height:1}#sh-card .ct{flex:1;min-width:0}" +
    "#sh-card b{display:block;font-size:18px;color:#fff1b8}#sh-card small{display:block;margin-top:2px;font-size:13px;opacity:.95}" +
    "#sh-card .cg{font-size:20px;color:#f4c542}" +
    "#shw{position:fixed;inset:0;z-index:10003;display:none;align-items:flex-end;justify-content:center;background:rgba(0,0,0,.5);font-family:inherit}" +
    "#shw *{box-sizing:border-box}" +
    "#shw .sb{width:100%;max-width:520px;background:#fbf6e6;color:#1c1a14;border-radius:20px 20px 0 0;padding:16px 14px;padding-bottom:max(16px,env(safe-area-inset-bottom,0px));box-shadow:0 -6px 24px rgba(0,0,0,.35);max-height:92vh;overflow:auto}" +
    "#shw .sh{display:flex;align-items:center;gap:8px;margin-bottom:10px}" +
    "#shw .sh b{flex:1;font-size:18px}" +
    "#shw .sh button{border:0;border-radius:10px;padding:6px 12px;background:#e8dfbd;font:inherit;color:#3a3420}" +
    "#shw .sm{padding:10px 12px;border:1px solid #d8cd9f;border-radius:12px;background:#fff;font-size:14px;line-height:1.6;word-break:break-word;-webkit-user-select:text;user-select:text}" +
    "#shw .sm i{display:block;margin-top:6px;font-style:normal;color:#17603c;font-size:13px}" +
    "#shw .big{display:block;width:100%;margin:12px 0 4px;padding:14px;border:0;border-radius:14px;background:#17603c;color:#fff;font:inherit;font-size:17px;font-weight:700}" +
    "#shw .gr{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px}" +
    "#shw .gr button{display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 4px;border:1px solid #d8cd9f;border-radius:14px;background:#fff;font:inherit;font-size:13px;color:#1c1a14}" +
    "#shw .gr button span{font-size:26px;line-height:1}" +
    "#shw .ok{min-height:20px;margin-top:10px;text-align:center;color:#17603c;font-size:13px}";
  document.head.appendChild(st);

  var ov = document.createElement("div");
  ov.id = "shw";
  ov.innerHTML =
    '<div class="sb"><div class="sh"><b>অ্যাপ শেয়ার করুন</b><button id="sh-x">✕ বন্ধ</button></div>' +
    '<div class="sm" id="sh-m"></div>' +
    '<button class="big" id="sh-n">📤 শেয়ার করুন</button>' +
    '<div class="gr">' +
    '<button data-k="wa"><span>🟢</span>হোয়াটসঅ্যাপ</button>' +
    '<button data-k="fb"><span>🔵</span>ফেসবুক</button>' +
    '<button data-k="tg"><span>✈️</span>টেলিগ্রাম</button>' +
    '<button data-k="sms"><span>💬</span>এসএমএস</button>' +
    '<button data-k="mail"><span>✉️</span>ইমেইল</button>' +
    '<button data-k="cp"><span>📋</span>লিংক কপি</button>' +
    '</div><div class="ok" id="sh-ok"></div></div>';

  function $(id) { return ov.querySelector("#sh-" + id); }
  function msg(t) { $("ok").textContent = t || ""; }
  function fullText() { return TEXT + " " + link(); }
  function ext(url) {
    var a = document.createElement("a");
    a.href = url; a.target = "_blank"; a.rel = "noopener";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }
  function copy() {
    var t = fullText();
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = t; ta.style.cssText = "position:fixed;left:-9999px;top:0";
      document.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta);
      msg(ok ? "লিংক কপি হয়েছে ✔" : "কপি করা যায়নি, উপরের লেখাটি চেপে ধরে কপি করুন।");
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(t).then(function () { msg("লিংক কপি হয়েছে ✔"); }, fallback);
    } else fallback();
  }
  function act(k) {
    var t = fullText(), l = link();
    if (k === "wa") ext("https://wa.me/?text=" + enc(t));
    else if (k === "fb") ext("https://www.facebook.com/sharer/sharer.php?u=" + enc(l) + "&quote=" + enc(TEXT));
    else if (k === "tg") ext("https://t.me/share/url?url=" + enc(l) + "&text=" + enc(TEXT));
    else if (k === "sms") ext("sms:?&body=" + enc(t));
    else if (k === "mail") ext("mailto:?subject=" + enc("আল-মিফতাহ অ্যাপ") + "&body=" + enc(t));
    else if (k === "cp") copy();
  }

  var opened = false;
  function openIt() {
    if (opened) return;
    opened = true;
    $("m").innerHTML = esc(TEXT) + "<i>" + esc(link()) + "</i>";
    $("n").style.display = navigator.share ? "block" : "none";
    msg("");
    ov.style.display = "flex";
    try { history.pushState({ sh: 1 }, ""); } catch (e) {}
  }
  function closeIt() { if (!opened) return; opened = false; ov.style.display = "none"; }
  $("x").onclick = function () {
    var had = false;
    try { had = history.state && history.state.sh; } catch (e) {}
    if (had) history.back(); else closeIt();
  };
  ov.addEventListener("click", function (e) { if (e.target === ov) $("x").onclick(); });
  window.addEventListener("popstate", function () { if (opened) closeIt(); });
  $("n").onclick = function () {
    try {
      navigator.share({ title: "আল-মিফতাহ", text: TEXT, url: link() }).catch(function () {});
    } catch (e) { copy(); }
  };
  ov.querySelector(".gr").onclick = function (e) {
    var b = e.target.closest ? e.target.closest("button") : null;
    if (b) act(b.getAttribute("data-k"));
  };

  /* ---------- মূল পাতার নিচে "শেয়ার অ্যাপ" ঘর ---------- */
  function mountCard() {
    var app = document.getElementById("app");
    if (!app) return;
    if (!app.querySelector("#nxt") || !app.querySelector(".g3")) return;   // শুধু মূল পাতায়
    var c = app.querySelector("#sh-card");
    if (!c) {
      c = document.createElement("button");
      c.id = "sh-card";
      c.innerHTML = '<span class="ci">📤</span><span class="ct"><b>শেয়ার অ্যাপ</b><small>বন্ধু ও পরিবারের সাথে অ্যাপটি শেয়ার করুন</small></span><span class="cg">◀</span>';
      c.onclick = openIt;
    }
    if (app.lastElementChild !== c) app.appendChild(c);
  }
  function watch() {
    var app = document.getElementById("app");
    mountCard();
    if (app && window.MutationObserver) new MutationObserver(function () { mountCard(); }).observe(app, { childList: true });
  }
  function mount() { document.body.appendChild(ov); watch(); }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);

  window.__sh = { open: openIt };
})();
