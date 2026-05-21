const CACHE_NAME = "hydrotech-pm-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/manifest.json",
  "/favicon.ico",
  "/file.svg",
  "/globe.svg",
  "/window.svg"
];

// 1. Cài đặt Service Worker và lưu cache các tài nguyên tĩnh
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching static shell assets");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Kích hoạt Service Worker và dọn dẹp các cache cũ
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[Service Worker] Clearing old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Xử lý các request mạng: Phục vụ từ Cache trước khi Offline, Network-first cho API
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Không can thiệp vào các API của Supabase hoặc Vercel
  if (url.origin.includes("supabase.co") || request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Trả về tài nguyên từ cache (Cache-first cho các tài nguyên tĩnh)
        // Đồng thời fetch ngầm để cập nhật cache mới nhất (stale-while-revalidate)
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          })
          .catch(() => {/* Bỏ qua lỗi khi offline */});
        return cachedResponse;
      }

      // Nếu không có trong cache, tải từ mạng (Network-first)
      return fetch(request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
            return networkResponse;
          }
          // Chỉ cache các request thành công
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          // Trả về trang chủ hoặc thông báo offline nếu không thể truy cập mạng
          if (request.mode === "navigate") {
            return caches.match("/");
          }
        });
    })
  );
});
