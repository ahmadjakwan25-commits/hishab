/* হাফেজী কোরআন শরীফ — কার্ড ও আলাদা ভিউয়ার (hafezi-quran/ ফোল্ডার). অন্য কোনো ফাইল বদলায় না। */
(function(){
if(window.__hfzcard)return;window.__hfzcard=1;
var st=document.createElement('style');
st.textContent='.hz-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}'
+'.hz-card{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;text-align:center;font:inherit;padding:16px 8px;border-radius:18px;border:1px solid var(--line,#dbe5de);background:var(--card,#fff);color:var(--ink,#14261c);cursor:pointer;-webkit-tap-highlight-color:transparent}'
+'.hz-card span{font-size:30px;line-height:1.1}.hz-card b{font-size:15px;line-height:1.3}.hz-card small{font-size:11px;color:var(--mut,#5d7066)}'
+'.hz-gold{background:linear-gradient(135deg,#0f5a3c,#1f7a4d);color:#fff;border:2px solid #d9b34a}.hz-gold small{color:#f3e6b5}'
+'#hz-ov{position:fixed;left:0;top:0;right:0;bottom:0;z-index:2147483000;background:var(--bg,#f1f5f2);display:flex;flex-direction:column;padding-top:env(safe-area-inset-top,0px)}'
+'#hz-ov .hz-top{display:flex;align-items:center;gap:10px;padding:8px 12px;background:#0f6b57;color:#fff;font-size:16px}#hz-ov .hz-x{background:#fff2;color:#fff;border:1px solid #fff6;border-radius:8px;padding:5px 12px;font:inherit;font-size:16px}'
+'#hz-ov iframe{flex:1;width:100%;border:0;background:var(--bg,#f1f5f2)}';
document.head.appendChild(st);
function cards(){return '<div class="hz-row"><button type="button" class="hz-card" data-h="qt:s"><span>📖</span><b>কুরআন শরীফ</b><small>সূরা অনুযায়ী</small></button><button type="button" class="hz-card hz-gold" data-hfz="open"><span>🕋</span><b>হাফেজী কোরআন শরীফ</b><small>পাতা দেখে পড়ুন ও শুনুন</small></button></div>'}
function wrap(){if(typeof window.quranHtml!=='function'||window.quranHtml.__hz)return;var o=window.quranHtml;var n=function(){return cards()+o.apply(this,arguments)};n.__hz=1;window.quranHtml=n}
wrap();
var skip=0;
function openV(){if(document.getElementById('hz-ov'))return;var ov=document.createElement('div');ov.id='hz-ov';
 ov.innerHTML='<div class="hz-top"><button type="button" class="hz-x" aria-label="বন্ধ">←</button><b>হাফেজী কোরআন শরীফ</b></div><iframe src="hafezi-quran/index.html" allowfullscreen allow="fullscreen"></iframe>';
 document.body.appendChild(ov);document.documentElement.style.overflow='hidden';
 ov.querySelector('.hz-x').onclick=function(){closeV(false)};
 try{history.pushState({hz:1},'')}catch(e){}}
function closeV(fromPop){var ov=document.getElementById('hz-ov');if(!ov)return;ov.remove();document.documentElement.style.overflow='';if(!fromPop){skip=1;try{history.back()}catch(e){skip=0}}}
document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-hfz]');if(!t)return;e.stopPropagation();e.preventDefault();openV()},true);
window.addEventListener('popstate',function(e){if(skip){skip=0;e.stopImmediatePropagation();return}if(document.getElementById('hz-ov')){closeV(true);e.stopImmediatePropagation()}},true);
})();
