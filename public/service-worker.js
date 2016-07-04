const version = 'v1/assets';

const assets = [
  '/',
  '/public/dist/styles.min.css',
];

this.addEventListener('install', event => {
  console.log(`[Service Worker::${version}] Install event in progress...`);

  const openVersionedCache = caches.open(version);
  const addAllAssets = openVersionedCache.then(cache => cache.addAll(assets));

  const workerInstalled = addAllAssets.then(() => {
    console.log(`[Service Worker::${version}] Install completed!`);
  });

  event.waitUntil(workerInstalled);
});
