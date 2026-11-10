/* হাফেজী কোরআন শরীফ — "তেলাওয়াত" বক্সে চাপলে দুটি কার্ড (আগের কোরআন | হাফেজী কোরআন শরীফ)।
   অন্য কোনো ফাইল বদলায় না। আগের কোরআন কার্ডে চাপলে আগের মতোই খোলে। */
(function(){
if(window.__hfzcard)return;window.__hfzcard=1;
var st=document.createElement('style');
st.textContent=
'#hz-ch,#hz-ov{position:fixed;left:0;top:0;right:0;bottom:0;z-index:2147483000;background:var(--bg,#f1f5f2);display:flex;flex-direction:column;padding-top:env(safe-area-inset-top,0px)}'
+'.hz-top{display:flex;align-items:center;gap:10px;padding:8px 12px;background:#0f6b57;color:#fff;font-size:16px}.hz-x{background:#fff2;color:#fff;border:1px solid #fff6;border-radius:8px;padding:5px 12px;font:inherit;font-size:16px}'
+'#hz-ov iframe{flex:1;width:100%;border:0;background:var(--bg,#f1f5f2)}'
+'.hz-body{flex:1;overflow:auto;padding:16px 12px}.hz-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:stretch}'
+'.hz-c{display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:6px;text-align:center;font:inherit;padding:10px 8px 14px;border-radius:18px;border:1px solid var(--line,#dbe5de);background:var(--card,#fff);color:var(--ink,#14261c);cursor:pointer;-webkit-tap-highlight-color:transparent}'
+'.hz-c b{font-size:16px;line-height:1.3}.hz-c small{font-size:12px;color:var(--mut,#5d7066);line-height:1.4}'
+'.hz-g{background:linear-gradient(160deg,#fff8df,#f1e1a8);border:2px solid #d9b34a;color:#3b2e08}.hz-g small{color:#6b5a1c}'
+'.hz-th{width:100%;border-radius:12px;overflow:hidden;background:#e8f1ea;aspect-ratio:3/4;display:flex;align-items:center;justify-content:center;font-size:64px}'
+'.hz-th img{width:100%;height:100%;object-fit:cover;object-position:top;display:block}'
+'.hz-hint{margin:14px 4px 0;font-size:12px;color:var(--mut,#5d7066);text-align:center}';
document.head.appendChild(st);
var skip=0,pending=null,bypass=0,chEl=null,vEl=null;
function $(id){return document.getElementById(id)}
function runPending(){var f=pending;pending=null;if(f)setTimeout(f,0)}
function pushH(){try{history.pushState({hz:1},'')}catch(e){}}
function back(cb){pending=cb||null;skip=1;try{history.back()}catch(e){skip=0;runPending();return}setTimeout(function(){if(skip){skip=0;runPending()}},600)}
function rm(el){if(el&&el.parentNode)el.parentNode.removeChild(el)}
function unlock(){if(!chEl&&!vEl)document.documentElement.style.overflow=''}
function openChooser(origTarget){
 if(chEl)return;
 var el=document.createElement('div');el.id='hz-ch';
 el.innerHTML='<div class="hz-top"><button type="button" class="hz-x" aria-label="বন্ধ">←</button><b>তেলাওয়াত</b></div>'
 +'<div class="hz-body"><div class="hz-grid">'
 +'<button type="button" class="hz-c" data-w="old"><div class="hz-th">📖</div><b>কোরআন মাজিদ</b><small>পড়ুন ও শুনুন</small></button>'
 +'<button type="button" class="hz-c hz-g" data-w="hfz"><div class="hz-th"><img src="hafezi-quran/pages/p002.jpg" alt="হাফেজী কোরআন, প্রথম পাতা"></div><b>হাফেজী কোরআন শরীফ</b><small>প্রথম পাতা থেকে<br>পড়ুন ও শুনুন</small></button>'
 +'</div></div>';
 document.body.appendChild(el);chEl=el;document.documentElement.style.overflow='hidden';pushH();
 el.querySelector('.hz-x').onclick=function(){closeAll()};
 el.querySelector('[data-w="old"]').onclick=function(){
  rm(chEl);chEl=null;unlock();
  back(function(){bypass=1;try{origTarget.click()}catch(e){}bypass=0});
 };
 el.querySelector('[data-w="hfz"]').onclick=function(){openViewer(true)};
}
function openViewer(fromChooser){
 if(vEl)return;
 var ov=document.createElement('div');ov.id='hz-ov';
 ov.innerHTML='<div class="hz-top"><button type="button" class="hz-x" aria-label="বন্ধ">←</button><b>হাফেজী কোরআন শরীফ</b></div><iframe src="hafezi-quran/index.html" allowfullscreen allow="fullscreen"></iframe>';
 document.body.appendChild(ov);vEl=ov;document.documentElement.style.overflow='hidden';
 if(fromChooser){rm(chEl);chEl=null}else pushH();
 ov.querySelector('.hz-x').onclick=function(){closeAll()};
}
function closeAll(){if(!chEl&&!vEl)return;rm(chEl);rm(vEl);chEl=vEl=null;unlock();back()}
var W1='তেলাওয়াত'.normalize('NFC'),W2='তিলাওয়াত'.normalize('NFC');
function isTile(el){
 var t=(el.textContent||'').normalize('NFC').split('').filter(function(c){var n=c.charCodeAt(0);return n>=2432&&n<=2559}).join('');
 return t===W1||t===W2;
}
document.addEventListener('click',function(e){
 if(bypass)return;
 var t=e.target;if(!t||!t.closest)return;
 if(t.closest('#hz-ch,#hz-ov'))return;
 var app=document.getElementById('app');if(!app||!app.contains(t))return;
 var n=t,hit=null;
 for(var i=0;n&&n!==app&&i<5;i++,n=n.parentElement){if(isTile(n)){hit=n;break}}
 if(!hit)return;
 /* শুধু হোমের বক্স (বাটন/ট্যাব নয়) ধরি: ভেতরে বড় লেখা না থাকা অংশ বাদ */
 if((hit.textContent||'').length>40)return;
 e.stopPropagation();e.preventDefault();openChooser(t);
},true);
window.addEventListener('popstate',function(e){
 if(skip){skip=0;e.stopImmediatePropagation();runPending();return}
 if(chEl||vEl){rm(chEl);rm(vEl);chEl=vEl=null;unlock();e.stopImmediatePropagation()}
},true);
})();
