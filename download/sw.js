// আল-মিফতাহ ডাউনলোড পাতার সার্ভিস ওয়ার্কার: শুধু নেটওয়ার্ক-ফার্স্ট, কোনো ক্যাশ রাখে না।
self.addEventListener('install', function(){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function(e){
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(function(){
      return new Response('<meta charset="utf-8"><body style="font-family:sans-serif;text-align:center;padding:40px">ইন্টারনেট সংযোগ নেই। আবার চেষ্টা করুন।</body>', {headers:{'Content-Type':'text/html; charset=utf-8'}});
    }));
  }
});
