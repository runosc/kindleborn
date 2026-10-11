'use strict';
// Bump VERSION here AND in config.js whenever a cached asset changes.
// v1.1.1 presentation: main focus, flat navigation, compact habit rows.
const VERSION = '1.2.0';
// Scope-specific prefix prevents deleting another app's caches on github.io.
const PREFIX = `rutin:${self.registration.scope}:`;
const CACHE = `${PREFIX}v${VERSION}`;
const SHELL = [
  './', './index.html', './style.css', './config.js', './derive.js', './content.js', './game.js', './data.js', './store.js', './views.js', './app.js', './simulator.js',
  './assets/ui/hazir/menu_savas_v01.png',
  './assets/ui/hazir/ikon_alev_v01.png',
  './assets/ui/hazir/ikon_alev_sonuk_v01.png',
  './assets/ui/hazir/ikon_alev_mini_v01.png',
  './assets/ui/hazir/ikon_kupa_v01.png',
  './assets/ui/hazir/ui_takvim_bugun_v01.png',
  './assets/ui/hazir/ui_takvim_hucre_0_v01.png',
  './assets/ui/hazir/ui_takvim_hucre_1_v01.png',
  './assets/ui/hazir/ui_takvim_hucre_2_v01.png',
  './assets/ui/hazir/ui_takvim_hucre_3_v01.png',
  './assets/ui/hazir/ui_takvim_hucre_4_v01.png',
  './manifest.webmanifest', './icons/apple-touch-icon.png', './icons/icon-192.png',
  './icons/icon-512.png',
  './assets/fonts/PressStart2P-Regular.ttf',
  "./assets/ikon/hazir/ikon_tur_guc_v01.png",
  "./assets/ikon/hazir/ikon_tur_zeka_v01.png",
  "./assets/ikon/hazir/ikon_tur_dayaniklilik_v01.png",
  "./assets/ikon/hazir/ikon_tur_odak_v01.png",
  "./assets/ikon/hazir/menu_bugun_v01.png",
  "./assets/ikon/hazir/menu_ben_v01.png",
  "./assets/ikon/hazir/menu_dukkan_v01.png",
  "./assets/ikon/hazir/menu_gecmis_v01.png",
  "./assets/karakter/hazir/karakter_ana_v02_64x96.png",
  "./assets/arkaplan/hazir/arkaplan_arena_tembel_beyin_v01.png",
  "./assets/arkaplan/hazir/arkaplan_arena_kaydirma_canavari_v01.png",
  "./assets/arkaplan/hazir/arkaplan_arena_bahane_goblini_v01.png",
  "./assets/arkaplan/hazir/arkaplan_arena_v01.png",
  "./assets/portre/hazir/portre_tembel_beyin_v01.png",
  "./assets/portre/hazir/portre_kaydirma_canavari_v01.png",
  "./assets/portre/hazir/portre_bahane_goblini_v01.png",
  "./assets/odul/hazir/sandik_kapali_v01.png",
  "./assets/odul/hazir/sandik_acik_v01.png",
  "./assets/odul/hazir/altin_yigini_v01.png",
  "./assets/ui/hazir/ui_panel_v01.png",
  "./assets/ui/hazir/ui_panel_kart_v01.png",
  "./assets/ui/hazir/ui_slot_v01.png",
  "./assets/ui/hazir/ui_slot_secili_v01.png",
  "./assets/ui/hazir/ui_cubuk_cerceve_v01.png",
  "./assets/ui/hazir/ui_cubuk_dolgu_kirmizi_v01.png",
  "./assets/ui/hazir/ui_cubuk_dolgu_turuncu_v01.png",
  "./assets/ui/hazir/ui_cubuk_dolgu_yesil_v01.png",
  "./assets/ui/hazir/ui_cubuk_dolgu_mavi_v01.png",
  "./assets/ui/hazir/ui_cubuk_dolgu_altin_v01.png",
  "./assets/ui/hazir/ui_buton_v01.png",
  "./assets/ui/hazir/ui_buton_basili_v01.png",
  "./assets/ui/hazir/ui_buton_pasif_v01.png",
  "./assets/ui/hazir/ui_tik_bos_v01.png",
  "./assets/ui/hazir/ui_tik_dolu_v01.png",
  "./assets/ui/hazir/ikon_kalp_v01.png",
  "./assets/ui/hazir/ikon_altin_v01.png",
  "./assets/ui/hazir/ikon_xp_v01.png",
  "./assets/ui/hazir/ikon_kilit_v01.png",
  "./assets/ui/hazir/ikon_onay_v01.png",
  "./assets/ui/hazir/menu_ayar_v01.png",
  "./assets/ui/hazir/ikon_kafatasi_v01.png",
  "./assets/ui/hazir/kurdele_zafer_v01.png",
  "./assets/ui/hazir/kurdele_yenilgi_v01.png",
  "./assets/ui/hazir/slot_bos_kilic_v01.png",
  "./assets/ui/hazir/slot_bos_zirh_v01.png",
  "./assets/ui/hazir/slot_bos_kozmetik_v01.png",
  "./assets/ui/hazir/efekt_vurus_v01_1.png",
  "./assets/ui/hazir/efekt_vurus_v01_2.png",
  "./assets/ui/hazir/efekt_vurus_v01_3.png",
  "./assets/ui/hazir/efekt_iyilesme_v01_1.png",
  "./assets/ui/hazir/efekt_iyilesme_v01_2.png",
  "./assets/ui/hazir/efekt_iyilesme_v01_3.png",
  "./assets/ui/hazir/efekt_hasar_aldin_v01_1.png",
  "./assets/ui/hazir/efekt_hasar_aldin_v01_2.png",
  "./assets/ui/hazir/efekt_boss_oldu_v01_1.png",
  "./assets/ui/hazir/efekt_boss_oldu_v01_2.png",
  "./assets/ui/hazir/efekt_boss_oldu_v01_3.png",
  "./assets/ui/hazir/efekt_boss_oldu_v01_4.png",
  "./assets/ui/hazir/efekt_konfeti_v01_1.png",
  "./assets/ui/hazir/efekt_konfeti_v01_2.png",
  "./assets/ui/hazir/efekt_konfeti_v01_3.png",
  './assets/boss/hazir/boss_tembel_beyin_v01.png', './assets/boss/hazir/boss_kaydirma_canavari_v01.png', './assets/boss/hazir/boss_bahane_goblini_v01.png',
  './assets/ekipman_kozmetik/hazir/kilic_t1_tahta_v02.png', './assets/ekipman_kozmetik/hazir/kilic_t2_demir_v02.png', './assets/ekipman_kozmetik/hazir/kilic_t3_celik_v02.png',
  './assets/ekipman_kozmetik/hazir/zirh_t1_tahta_v02.png', './assets/ekipman_kozmetik/hazir/zirh_t2_demir_v02.png', './assets/ekipman_kozmetik/hazir/zirh_t3_celik_v02.png',
  './assets/ekipman_kozmetik/hazir/kozmetik_pelerin_v01.png', './assets/ekipman_kozmetik/hazir/kozmetik_yuzuk_v01.png', './assets/ekipman_kozmetik/hazir/kozmetik_kolye_v01.png', './assets/ekipman_kozmetik/hazir/kozmetik_tac_v01.png'
];
const shellURLs = new Set(SHELL.map(path => new URL(path, self.registration.scope).href));
async function fromShell(url) {
  const cache = await caches.open(CACHE);
  const stored = await cache.match(url);
  if (stored) return stored;
  // Recover online if the browser evicted a cache while retaining the worker.
  const response = await fetch(new Request(url, { cache: 'reload' }));
  if (response.ok) await cache.put(url, response.clone());
  return response;
}
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL.map(path => new Request(new URL(path, self.registration.scope), { cache: 'reload' })))));
  // A new version waits for the user's Güncelle action.
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key.startsWith(PREFIX) && key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fromShell(new URL('./index.html', self.registration.scope).href));
  } else if (shellURLs.has(url.href)) {
    event.respondWith(fromShell(url.href));
  }
});
