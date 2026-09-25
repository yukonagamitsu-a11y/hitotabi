// オフライン用: 一度開いたページと資産を保存し、電波がないときも開けるようにする。
// 更新したら VERSION を上げる。
const VERSION = 'hitotabi-v1'

self.addEventListener('install', () => { self.skipWaiting() })

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

const store = (req, res) => {
  const copy = res.clone()
  caches.open(VERSION).then((c) => c.put(req, copy))
  return res
}

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return
  // ページ本体と設定は「ネット優先、だめなら保存分」、それ以外は「保存分優先」
  const netFirst = req.mode === 'navigate' || req.url.endsWith('/sw.js') || req.url.endsWith('.webmanifest')
  e.respondWith(
    netFirst
      ? fetch(req).then((res) => store(req, res)).catch(() => caches.match(req).then((r) => r || caches.match('./')))
      : caches.match(req).then((r) => r || fetch(req).then((res) => store(req, res)))
  )
})
