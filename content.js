(function (root, factory) {
  const content = factory();
  if (typeof module === 'object' && module.exports) module.exports = content;
  else root.RutinContent = content;
})(globalThis, function () {
  'use strict';
  function freezeTree(value) { if (value && typeof value === 'object') { Object.values(value).forEach(freezeTree); Object.freeze(value); } return value; }
  const ASSETS = freezeTree({
  "types": {
    "Güç": "./assets/ikon/hazir/ikon_tur_guc_v01.png",
    "Zeka": "./assets/ikon/hazir/ikon_tur_zeka_v01.png",
    "Dayanıklılık": "./assets/ikon/hazir/ikon_tur_dayaniklilik_v01.png",
    "Odak": "./assets/ikon/hazir/ikon_tur_odak_v01.png"
  },
  "menu": {
    "boss": "./assets/ui/hazir/menu_savas_v01.png",
    "today": "./assets/ikon/hazir/menu_bugun_v01.png",
    "me": "./assets/ikon/hazir/menu_ben_v01.png",
    "shop": "./assets/ikon/hazir/menu_dukkan_v01.png",
    "history": "./assets/ikon/hazir/menu_gecmis_v01.png"
  },
  "character": "./assets/karakter/hazir/karakter_ana_v02_64x96.png",
  "backgrounds": {
    "tembel-beyin": "./assets/arkaplan/hazir/arkaplan_arena_tembel_beyin_v01.png",
    "kaydirma-canavari": "./assets/arkaplan/hazir/arkaplan_arena_kaydirma_canavari_v01.png",
    "bahane-goblini": "./assets/arkaplan/hazir/arkaplan_arena_bahane_goblini_v01.png",
    "fallback": "./assets/arkaplan/hazir/arkaplan_arena_v01.png"
  },
  "portraits": {
    "tembel-beyin": "./assets/portre/hazir/portre_tembel_beyin_v01.png",
    "kaydirma-canavari": "./assets/portre/hazir/portre_kaydirma_canavari_v01.png",
    "bahane-goblini": "./assets/portre/hazir/portre_bahane_goblini_v01.png"
  },
  "rewards": {
    "closed": "./assets/odul/hazir/sandik_kapali_v01.png",
    "open": "./assets/odul/hazir/sandik_acik_v01.png",
    "gold": "./assets/odul/hazir/altin_yigini_v01.png"
  },
  "ui": {
"ikon_alev_v01":"./assets/ui/hazir/ikon_alev_v01.png",
"ikon_alev_sonuk_v01":"./assets/ui/hazir/ikon_alev_sonuk_v01.png",
"ikon_alev_mini_v01":"./assets/ui/hazir/ikon_alev_mini_v01.png",
"ikon_kupa_v01":"./assets/ui/hazir/ikon_kupa_v01.png",
"ui_takvim_bugun_v01":"./assets/ui/hazir/ui_takvim_bugun_v01.png",
"ui_takvim_hucre_0_v01":"./assets/ui/hazir/ui_takvim_hucre_0_v01.png",
"ui_takvim_hucre_1_v01":"./assets/ui/hazir/ui_takvim_hucre_1_v01.png",
"ui_takvim_hucre_2_v01":"./assets/ui/hazir/ui_takvim_hucre_2_v01.png",
"ui_takvim_hucre_3_v01":"./assets/ui/hazir/ui_takvim_hucre_3_v01.png",
"ui_takvim_hucre_4_v01":"./assets/ui/hazir/ui_takvim_hucre_4_v01.png",
    "ui_panel_v01": "./assets/ui/hazir/ui_panel_v01.png",
    "ui_panel_kart_v01": "./assets/ui/hazir/ui_panel_kart_v01.png",
    "ui_slot_v01": "./assets/ui/hazir/ui_slot_v01.png",
    "ui_slot_secili_v01": "./assets/ui/hazir/ui_slot_secili_v01.png",
    "ui_cubuk_cerceve_v01": "./assets/ui/hazir/ui_cubuk_cerceve_v01.png",
    "ui_cubuk_dolgu_kirmizi_v01": "./assets/ui/hazir/ui_cubuk_dolgu_kirmizi_v01.png",
    "ui_cubuk_dolgu_turuncu_v01": "./assets/ui/hazir/ui_cubuk_dolgu_turuncu_v01.png",
    "ui_cubuk_dolgu_yesil_v01": "./assets/ui/hazir/ui_cubuk_dolgu_yesil_v01.png",
    "ui_cubuk_dolgu_mavi_v01": "./assets/ui/hazir/ui_cubuk_dolgu_mavi_v01.png",
    "ui_cubuk_dolgu_altin_v01": "./assets/ui/hazir/ui_cubuk_dolgu_altin_v01.png",
    "ui_buton_v01": "./assets/ui/hazir/ui_buton_v01.png",
    "ui_buton_basili_v01": "./assets/ui/hazir/ui_buton_basili_v01.png",
    "ui_buton_pasif_v01": "./assets/ui/hazir/ui_buton_pasif_v01.png",
    "ui_tik_bos_v01": "./assets/ui/hazir/ui_tik_bos_v01.png",
    "ui_tik_dolu_v01": "./assets/ui/hazir/ui_tik_dolu_v01.png",
    "ikon_kalp_v01": "./assets/ui/hazir/ikon_kalp_v01.png",
    "ikon_altin_v01": "./assets/ui/hazir/ikon_altin_v01.png",
    "ikon_xp_v01": "./assets/ui/hazir/ikon_xp_v01.png",
    "ikon_kilit_v01": "./assets/ui/hazir/ikon_kilit_v01.png",
    "ikon_onay_v01": "./assets/ui/hazir/ikon_onay_v01.png",
    "menu_ayar_v01": "./assets/ui/hazir/menu_ayar_v01.png",
    "ikon_kafatasi_v01": "./assets/ui/hazir/ikon_kafatasi_v01.png",
    "kurdele_zafer_v01": "./assets/ui/hazir/kurdele_zafer_v01.png",
    "kurdele_yenilgi_v01": "./assets/ui/hazir/kurdele_yenilgi_v01.png",
    "slot_bos_kilic_v01": "./assets/ui/hazir/slot_bos_kilic_v01.png",
    "slot_bos_zirh_v01": "./assets/ui/hazir/slot_bos_zirh_v01.png",
    "slot_bos_kozmetik_v01": "./assets/ui/hazir/slot_bos_kozmetik_v01.png"
  },
  "effects": {
    "hit": [
      "./assets/ui/hazir/efekt_vurus_v01_1.png",
      "./assets/ui/hazir/efekt_vurus_v01_2.png",
      "./assets/ui/hazir/efekt_vurus_v01_3.png"
    ],
    "heal": [
      "./assets/ui/hazir/efekt_iyilesme_v01_1.png",
      "./assets/ui/hazir/efekt_iyilesme_v01_2.png",
      "./assets/ui/hazir/efekt_iyilesme_v01_3.png"
    ],
    "hurt": [
      "./assets/ui/hazir/efekt_hasar_aldin_v01_1.png",
      "./assets/ui/hazir/efekt_hasar_aldin_v01_2.png"
    ],
    "death": [
      "./assets/ui/hazir/efekt_boss_oldu_v01_1.png",
      "./assets/ui/hazir/efekt_boss_oldu_v01_2.png",
      "./assets/ui/hazir/efekt_boss_oldu_v01_3.png",
      "./assets/ui/hazir/efekt_boss_oldu_v01_4.png"
    ],
    "confetti": [
      "./assets/ui/hazir/efekt_konfeti_v01_1.png",
      "./assets/ui/hazir/efekt_konfeti_v01_2.png",
      "./assets/ui/hazir/efekt_konfeti_v01_3.png"
    ]
  }
});
  const ART_SIZES = freezeTree({
"./assets/ui/hazir/ikon_alev_v01.png":[16,16],
"./assets/ui/hazir/ikon_alev_sonuk_v01.png":[16,16],
"./assets/ui/hazir/ikon_alev_mini_v01.png":[8,8],
"./assets/ui/hazir/ikon_kupa_v01.png":[8,8],
"./assets/ui/hazir/ui_takvim_bugun_v01.png":[6,6],
"./assets/ui/hazir/ui_takvim_hucre_0_v01.png":[6,6],
"./assets/ui/hazir/ui_takvim_hucre_1_v01.png":[6,6],
"./assets/ui/hazir/ui_takvim_hucre_2_v01.png":[6,6],
"./assets/ui/hazir/ui_takvim_hucre_3_v01.png":[6,6],
"./assets/ui/hazir/ui_takvim_hucre_4_v01.png":[6,6],
  "./assets/ui/hazir/menu_savas_v01.png": [16,16],
  "./assets/ikon/hazir/ikon_tur_guc_v01.png": [
    16,
    16
  ],
  "./assets/ikon/hazir/ikon_tur_zeka_v01.png": [
    16,
    16
  ],
  "./assets/ikon/hazir/ikon_tur_dayaniklilik_v01.png": [
    16,
    16
  ],
  "./assets/ikon/hazir/ikon_tur_odak_v01.png": [
    16,
    16
  ],
  "./assets/ikon/hazir/menu_bugun_v01.png": [
    16,
    16
  ],
  "./assets/ikon/hazir/menu_ben_v01.png": [
    16,
    16
  ],
  "./assets/ikon/hazir/menu_dukkan_v01.png": [
    16,
    16
  ],
  "./assets/ikon/hazir/menu_gecmis_v01.png": [
    16,
    16
  ],
  "./assets/karakter/hazir/karakter_ana_v02_64x96.png": [
    64,
    96
  ],
  "./assets/arkaplan/hazir/arkaplan_arena_tembel_beyin_v01.png": [
    120,
    270
  ],
  "./assets/arkaplan/hazir/arkaplan_arena_kaydirma_canavari_v01.png": [
    120,
    270
  ],
  "./assets/arkaplan/hazir/arkaplan_arena_bahane_goblini_v01.png": [
    120,
    270
  ],
  "./assets/arkaplan/hazir/arkaplan_arena_v01.png": [
    120,
    270
  ],
  "./assets/portre/hazir/portre_tembel_beyin_v01.png": [
    24,
    24
  ],
  "./assets/portre/hazir/portre_kaydirma_canavari_v01.png": [
    24,
    24
  ],
  "./assets/portre/hazir/portre_bahane_goblini_v01.png": [
    24,
    24
  ],
  "./assets/odul/hazir/sandik_kapali_v01.png": [
    24,
    24
  ],
  "./assets/odul/hazir/sandik_acik_v01.png": [
    24,
    24
  ],
  "./assets/odul/hazir/altin_yigini_v01.png": [
    24,
    24
  ],
  "./assets/ui/hazir/ui_panel_v01.png": [
    24,
    24
  ],
  "./assets/ui/hazir/ui_panel_kart_v01.png": [
    24,
    24
  ],
  "./assets/ui/hazir/ui_slot_v01.png": [
    28,
    28
  ],
  "./assets/ui/hazir/ui_slot_secili_v01.png": [
    28,
    28
  ],
  "./assets/ui/hazir/ui_cubuk_cerceve_v01.png": [
    12,
    7
  ],
  "./assets/ui/hazir/ui_cubuk_dolgu_kirmizi_v01.png": [
    4,
    5
  ],
  "./assets/ui/hazir/ui_cubuk_dolgu_turuncu_v01.png": [
    4,
    5
  ],
  "./assets/ui/hazir/ui_cubuk_dolgu_yesil_v01.png": [
    4,
    5
  ],
  "./assets/ui/hazir/ui_cubuk_dolgu_mavi_v01.png": [
    4,
    5
  ],
  "./assets/ui/hazir/ui_cubuk_dolgu_altin_v01.png": [
    4,
    5
  ],
  "./assets/ui/hazir/ui_buton_v01.png": [
    24,
    16
  ],
  "./assets/ui/hazir/ui_buton_basili_v01.png": [
    24,
    16
  ],
  "./assets/ui/hazir/ui_buton_pasif_v01.png": [
    24,
    16
  ],
  "./assets/ui/hazir/ui_tik_bos_v01.png": [
    12,
    12
  ],
  "./assets/ui/hazir/ui_tik_dolu_v01.png": [
    12,
    12
  ],
  "./assets/ui/hazir/ikon_kalp_v01.png": [
    8,
    8
  ],
  "./assets/ui/hazir/ikon_altin_v01.png": [
    8,
    8
  ],
  "./assets/ui/hazir/ikon_xp_v01.png": [
    8,
    8
  ],
  "./assets/ui/hazir/ikon_kilit_v01.png": [
    8,
    8
  ],
  "./assets/ui/hazir/ikon_onay_v01.png": [
    8,
    8
  ],
  "./assets/ui/hazir/menu_ayar_v01.png": [
    16,
    16
  ],
  "./assets/ui/hazir/ikon_kafatasi_v01.png": [
    16,
    16
  ],
  "./assets/ui/hazir/kurdele_zafer_v01.png": [
    96,
    24
  ],
  "./assets/ui/hazir/kurdele_yenilgi_v01.png": [
    96,
    24
  ],
  "./assets/ui/hazir/slot_bos_kilic_v01.png": [
    24,
    24
  ],
  "./assets/ui/hazir/slot_bos_zirh_v01.png": [
    24,
    24
  ],
  "./assets/ui/hazir/slot_bos_kozmetik_v01.png": [
    24,
    24
  ],
  "./assets/ui/hazir/efekt_vurus_v01_1.png": [
    24,
    24
  ],
  "./assets/ui/hazir/efekt_vurus_v01_2.png": [
    24,
    24
  ],
  "./assets/ui/hazir/efekt_vurus_v01_3.png": [
    24,
    24
  ],
  "./assets/ui/hazir/efekt_iyilesme_v01_1.png": [
    16,
    16
  ],
  "./assets/ui/hazir/efekt_iyilesme_v01_2.png": [
    16,
    16
  ],
  "./assets/ui/hazir/efekt_iyilesme_v01_3.png": [
    16,
    16
  ],
  "./assets/ui/hazir/efekt_hasar_aldin_v01_1.png": [
    32,
    32
  ],
  "./assets/ui/hazir/efekt_hasar_aldin_v01_2.png": [
    32,
    32
  ],
  "./assets/ui/hazir/efekt_boss_oldu_v01_1.png": [
    48,
    48
  ],
  "./assets/ui/hazir/efekt_boss_oldu_v01_2.png": [
    48,
    48
  ],
  "./assets/ui/hazir/efekt_boss_oldu_v01_3.png": [
    48,
    48
  ],
  "./assets/ui/hazir/efekt_boss_oldu_v01_4.png": [
    48,
    48
  ],
  "./assets/ui/hazir/efekt_konfeti_v01_1.png": [
    48,
    48
  ],
  "./assets/ui/hazir/efekt_konfeti_v01_2.png": [
    48,
    48
  ],
  "./assets/ui/hazir/efekt_konfeti_v01_3.png": [
    48,
    48
  ]
});
  const BOSSES = [
    { id: 'tembel-beyin', arkaplan: ASSETS.backgrounds['tembel-beyin'], portre: ASSETS.portraits['tembel-beyin'], ad: 'Tembel Beyin', sprite: './assets/boss/hazir/boss_tembel_beyin_v01.png', zayifTur: 'Odak', aciklama: '“Sonra yaparım” diyen sese küçük bir adımla karşı koy.' },
    { id: 'kaydirma-canavari', arkaplan: ASSETS.backgrounds['kaydirma-canavari'], portre: ASSETS.portraits['kaydirma-canavari'], ad: 'Kaydırma Canavarı', sprite: './assets/boss/hazir/boss_kaydirma_canavari_v01.png', zayifTur: 'Zeka', aciklama: 'Bir kaydırma daha yerine, kendine bir sayfa ayır.' },
    { id: 'bahane-goblini', arkaplan: ASSETS.backgrounds['bahane-goblini'], portre: ASSETS.portraits['bahane-goblini'], ad: 'Bahane Goblini', sprite: './assets/boss/hazir/boss_bahane_goblini_v01.png', zayifTur: 'Güç', aciklama: 'Bahaneler güçlü. Senin küçük adımların daha güçlü.' }
  ];
  const ITEMS = [];
  ['kilic', 'zirh'].forEach(slot => ['tahta', 'demir', 'celik'].forEach((material, index) => {
    const kademe = index + 1;
    ITEMS.push({ id: `${slot}-${kademe}`, slot, kademe, ad: `${['Tahta', 'Demir', 'Çelik'][index]} ${slot === 'kilic' ? 'Kılıç' : 'Zırh'}`, fiyat: [50, 150, 400][index], etki: slot === 'kilic' ? 'hasar' : 'koruma', sprite: `./assets/ekipman_kozmetik/hazir/${slot}_t${kademe}_${material}_v02.png` });
  }));
  [['pelerin', 'Pelerin', 100], ['yuzuk', 'Yüzük', 150], ['kolye', 'Kolye', 200], ['tac', 'Taç', 250]].forEach(([id, ad, fiyat]) => {
    ITEMS.push({ id, slot: 'kozmetik', kozmetikSlot: id, kademe: 0, ad, fiyat, etki: 'Yalnız görünüm; oyun etkisi yok.', sprite: `./assets/ekipman_kozmetik/hazir/kozmetik_${id}_v01.png` });
  });
  const SLOTS = { kilic: 'Kılıç', zirh: 'Zırh', pelerin: 'Pelerin', tac: 'Taç', yuzuk: 'Yüzük', kolye: 'Kolye' };
  const TEXT = freezeTree({
"calendar":"Son 15 hafta",
"calendarLegend":"Günlük tamamlanma: yüzde 0, 1–33, 34–66, 67–99, 100",
"habits":"alışkanlık",
"streaks":"Seriler",
"days":"gün",
"best":"en uzun",
"seasons":"Sezonlar",
"noSeasons":"İlk sezonun sonucu burada yerini alacak.",
"noHabits":"Henüz alışkanlık yok.",
"noCompleted":"Bu gün tamamlanan alışkanlık yok.",
"won":"Yendin",
"died":"Öldün",
"gold":"altın",
"calendarDay":"Takvim günü",
"invalidSlot":"Geçersiz eşya slotu.",
"equippedToast":"Eşya kuşanıldı.",
"unequippedToast":"Eşya çıkarıldı.",
"emptySlot":"boş",
"slot":"slotu",
"equipped":"kuşanılı",
"equipTouch":"Kuşanmak için dokun",
"unequipTouch":"Çıkarmak için dokun",
"emptyInventory":"Boş envanter hücresi",
"lastItem":"Giyinmek için bir eşyaya dokun.",
"level":"Seviye",
"xp":"XP",
"totalXp":"toplam XP",
"hp":"Can",
"rename":"Adı düzenle",
"traveler":"Yolcu",
"attributes":"Özelliklerin",
"inventory":"Sahip olduğun eşyalar",
"damage":"Hasar",
"protection":"Koruma",
  "battle": "Savaş",
  "me": "Ben",
  "shop": "Dükkan",
  "battleHome": "Savaş ana ekranı",
  "daily": "Günlük adımlar",
  "addHabit": "+ Yeni alışkanlık",
  "todayHits": "Bugünün vuruşları",
  "hit": "Son vuruş",
  "damage": "hasar",
  "items": "Eşya",
  "stats": "Özellik",
  "history": "Geçmiş"
});
  const number = value => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1 }).format(value);
  const formatDate = value => new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value + 'T12:00:00'));
  const COPY = freezeTree({
  "copy002": "<small class=\"habit-lock\">Sezon kaydı kilitli</small>",
  "copy003": "tiki geri al",
  "copy004": "tik at",
  "copy005": "Günlük ilerleme",
  "copy006": "<div class=\"empty\"><p class=\"eyebrow\">BİR ADIMLA BAŞLA</p><h2>İlk alışkanlığını ekle.</h2><p>Sezonun, bir günlük alışkanlığın olduğunda başlar.</p><button type=\"button\" class=\"primary wide\" data-action=\"add\">İlk alışkanlığını ekle</button></div>",
  "copy007": "<p class=\"eyebrow\">KINDLEBORN</p><h1>Her gün bir adım.</h1><div class=\"empty\"><p>Karakterini oluştur; günlük alışkanlıklarınla bosslara karşı ilerle.</p><button type=\"button\" class=\"primary wide\" data-action=\"rename\">Karakterini oluştur</button><button type=\"button\" class=\"secondary wide\" data-action=\"settings\">Yedek geri yükle</button></div>",
  "copy008": "Karakter canı",
  "copy009": "Boss canı",
  "copy010": "Bossu yendin!",
  "copy011": "Bu kez düştün.",
  "copy012": "</div><section class=\"daily-area\">",
  "copy013": " · ",
  "copy014": "KOZMETİK",
  "copy015": "kuşanıldı",
  "copy016": "kuşan",
  "copy017": "satın al",
  "copy018": "Kuşanıldı",
  "copy019": "Kuşan",
  "copy020": "Satın al",
  "copy021": "Zorluk başına puan",
  "copy022": "Hedef sezon günü",
  "copy023": "Boss can katsayısı",
  "copy024": "Zayıf tür çarpanı",
  "copy025": "Günlük ortalama vuruş",
  "copy026": "r alt sınırı",
  "copy027": "r üst sınırı",
  "copy028": "Boss iyileşme oranı",
  "copy029": "Haftalık iyileşme tavanı",
  "copy030": "Zafer sonrası ölçek",
  "copy031": "Ölüm sonrası ölçek",
  "copy032": "Taban can",
  "copy033": "Dayanıklılık başına can",
  "copy034": "Mükemmel gün canı",
  "copy035": "Odak başına can",
  "copy036": "Zafer temel altını",
  "copy037": "Zafer XP",
  "copy038": "Ölüm altın oranı",
  "copy039": "Zeka altın bonusu",
  "copy040": "Zeka bonus tavanı",
  "copy041": "İlk seviye eşiği",
  "copy042": "Seviye eşiği artışı",
  "copy043": "—",
  "copy044": "Ölüm",
  "copy045": "Sezon sürüyor",
  "copy046": "<p>Arşiv henüz boş.</p>",
  "copy047": "Kılıç",
  "copy048": "Zırh",
  "copy049": "Hesaplanıyor…",
  "copy050": "1000 sezonu simüle et",
  "copy051": "pixel effect hurt-effect",
  "copy052": "Depolama durumu kontrol ediliyor.",
  "copy053": "Çevrimdışı hazırlık sürüyor.",
  "copy054": "Cihaz depolaması dolu. Bir yedek alıp yer açmayı dene.",
  "copy055": "İşlem tamamlanamadı. Tekrar dene.",
  "copy056": "Denge alanlarını kontrol et.",
  "copy057": "Tutarlılık 0–100 arasında, tohum dolu olmalı.",
  "copy058": "Henüz sezon yok.",
  "copy059": "Simülatör açılamadı. Yeniden dene.",
  "copy060": "Alışkanlığı düzenle",
  "copy061": "Yeni alışkanlık",
  "copy062": "Değişiklikleri kaydet",
  "copy063": "Alışkanlığı ekle",
  "copy064": "Arşivden çıkar",
  "copy065": "Arşivle",
  "copy066": "Yedek dosyası hazır. İndirmeler / Dosyalar bölümünü kontrol et.",
  "copy067": "Bu tarayıcı dosya paylaşımını desteklemiyor. JSON yedeğini indir.",
  "copy068": "Kindleborn yedeği",
  "copy069": "Paylaşım açılamadı. JSON yedeğini indir.",
  "copy070": "Yedek dosyası 25 MB’tan küçük olmalıdır.",
  "copy071": "Yedeği geri yükle?",
  "copy072": "Veriyi değiştir",
  "copy073": "Yedek geri yüklendi.",
  "copy074": "Dosya geçerli bir JSON yedeği değil.",
  "copy075": "Bu tarayıcı depolama durumunu bildirmiyor.",
  "copy076": "Kalıcı depolama izni verildi.",
  "copy077": "Kalıcı depolama izni verilmedi. Yedek almayı unutma.",
  "copy078": "Depolama durumu okunamadı. Yedek almayı unutma.",
  "copy079": "Bu tarayıcı çevrimdışı uygulama desteği sunmuyor.",
  "copy080": "Çevrimdışı hazırlık tamamlanamadı. İnternete bağlanıp yeniden aç.",
  "copy081": "Uygulama kabuğu hazır. Çevrimdışı açabilirsin.",
  "copy082": "Çevrimdışı hazırlık tamamlanamadı. HTTPS veya localhost üzerinden aç.",
  "copy083": "Bir alışkanlık adı yaz.",
  "copy084": "Değişiklikler kaydedildi. Eski tiklerin bilgisi korundu.",
  "copy085": "Yeni alışkanlığın hazır.",
  "copy086": "Alışkanlık arşivden çıkarıldı.",
  "copy087": "Arşivlendi. Geçmiş tiklerin korundu.",
  "copy088": "Alışkanlık kalıcı olarak silinsin mi?",
  "copy089": "Kalıcı olarak sil",
  "copy090": "Alışkanlık ve tikleri silindi.",
  "copy091": "Tik kaydedildi. Boss hasar aldı.",
  "copy092": "Tik geri alındı. Hasar geri çevrildi.",
  "copy093": "Sezon kapandı. Yeni mücadele tam canla başlıyor.",
  "copy094": "Eşya satın alındı. Dilediğinde kuşanabilirsin.",
  "copy095": "Varsayılan ayarlar yeni sezonlara uygulanacak.",
  "copy096": "Tüm veriyi sil?",
  "copy097": "Bu cihazdaki bütün alışkanlıklar, tikler, sezonlar, gün defteri ve eşyalar kalıcı olarak silinecek. Geri almak için JSON yedeğin gerekir.",
  "copy098": "Tüm veriyi sil",
  "copy099": "Bütün veriler silindi.",
  "copy100": "Diğer Kindleborn sekmelerini kapatıp bu sayfayı yeniden aç.",
  "copy101": "Yeni gün başladı. Önceki gün deftere kapandı.",
  "copy102": "Ayarlar yalnız yeni sezonlara uygulanacak.",
  "copy103": "Bir karakter adı yaz.",
  "copy104": "Karakterin hazır.",
  "copy105": "Kayıt tamamlanamadı.",
  "copy106": "Kapanmış gün değiştirilemez.",
  "copy107": "Oluşturulma tarihi değiştirilemez.",
  "copy108": "Alışkanlık bilgileri geçersiz.",
  "copy109": "Tik yalnız kapanmamış bugün için değiştirilebilir.",
  "copy110": "Önce karakterini oluştur ve bir alışkanlık ekle.",
  "copy111": "Bu tik önceki sezona ait; kapanmış sezon değiştirilemez.",
  "copy112": "Önce tamamlanan sezonu kapat.",
  "copy113": "Tiki olan alışkanlık silinemez. Arşivleyebilirsin.",
  "copy114": "Karakter adı 1–24 karakter olmalı.",
  "copy115": "Aktif sezon bulunamadı.",
  "copy116": "Sezon henüz bitmedi.",
  "copy117": "Bu eşya zaten sende veya bulunamadı.",
  "copy118": "Altının bu eşya için yeterli değil.",
  "copy119": "Önce bu eşyayı satın al.",
  "copy120": "Bu yedeğin şema sürümü desteklenmiyor.",
  "copy121": "v0 yedeğinde karakterAdi null olmalıdır.",
  "copy122": "Karakter adı geçersiz.",
  "copy123": "Yedekte habits ve ticks listeleri bulunmalıdır.",
  "copy124": "Yedek çok büyük.",
  "copy125": "Alışkanlık kimliği geçersiz veya tekrarlı.",
  "copy126": "Alışkanlık adı geçersiz.",
  "copy127": "Alışkanlık türü, zorluğu veya hedefi geçersiz.",
  "copy128": "Alışkanlık tarihi veya arşiv durumu geçersiz.",
  "copy129": "Tik kimliği veya alışkanlık bağlantısı geçersiz.",
  "copy130": "Tik tarihi veya zamanı geçersiz.",
  "copy131": "Bir alışkanlık için aynı gün birden fazla tik var.",
  "copy132": "Tik snapshot bilgisi geçersiz.",
  "copy133": "Şema 1 yedeği oyun verisi içeremez.",
  "copy134": "Sezon kimliği veya sırası geçersiz.",
  "copy135": "Sezon başlangıcı veya boss bilgisi geçersiz.",
  "copy136": "Sezon başlangıç zamanı geçersiz.",
  "copy137": "Sezon sonucu geçersiz.",
  "copy138": "Sezon bitiş zamanı geçersiz.",
  "copy139": "Oyun verisi için karakter adı gerekir.",
  "copy140": "Sezon sırası veya aktif sezon geçersiz.",
  "copy141": "Sezonlar çakışıyor.",
  "copy142": "Boss başlangıç canı ayarlarla tutarsız.",
  "copy143": "Gün defteri tarihi veya sezon bağlantısı geçersiz.",
  "copy144": "Gün defteri değerleri geçersiz.",
  "copy145": "Gün defteri tiklerle tutarsız.",
  "copy146": "Satın alma kaydı geçersiz.",
  "copy147": "Kuşanma kaydı veya eşya bağlantısı geçersiz.",
  "copy148": "Yedekte altın bakiyesi negatif.",
  "copy149": "Sezon sonucu oyun hesabıyla tutarsız.",
  "copy150": "Oyun ayarları geçersiz.",
  "copy151": "Oyun ayarları eksik veya tanımsız alan içeriyor.",
  "copy152": "Sezon günü tam sayı olmalı; rMin, rMax değerini aşamaz.",
  "copy153": "Dayanıklılık",
  "copy154": "Aktif sezon kapanmadan yeni sezon başlatılamaz.",
  "copy155": "Boss canı hesap sınırını aştı. Denge ayarını azalt.",
  "copy156": "Simülasyon girdileri geçersiz.",
  "copy157": "Simülasyon",
  "copy158": "Geçersiz tarih.",
  "copy159": "Kindleborn",
  "copy160": "KINDLEBORN",
  "copy161": "Yeni sürüm hazır.",
  "copy162": "Güncelle",
  "copy163": "Rutinlerin açılıyor…",
  "copy164": "×",
  "copy165": "Alışkanlık adı",
  "copy166": "Tür",
  "copy167": "Zorluk",
  "copy168": "Kaçınma alışkanlıklarında tik, “bugün yapmadım” demektir. Her tiki sen atarsın.",
  "copy169": "MACERAN BAŞLIYOR",
  "copy170": "Adın ne, yolcu?",
  "copy171": "Her gün küçük bir adım. Her tik bir vuruş.",
  "copy172": "Karakter adı",
  "copy173": "Devam et",
  "copy174": "Önce bir yedek geri yükle",
  "copy175": "Emin misin?",
  "copy176": "Vazgeç",
  "copy177": "Onayla",
  "copy178": "Savaş ana ekranı",
  "copy179": "Ayarlar",
  "copy180": "Ana gezinme",
  "copy181": "Kapat",
  "copy182": "Örn. 20 dakika kitap oku"
});
  const TEMPLATES = freezeTree({
  "views001": [
    "<img class=\"pixel ",
    "\" src=\"",
    "\" data-art=\"",
    "\" data-art-height=\"",
    "\" alt=\"\" aria-hidden=\"true\" ",
    ">"
  ],
  "views002": [
    "<div class=\"progress ",
    "\" role=\"progressbar\" aria-valuenow=\"",
    "\" aria-valuemin=\"0\" aria-valuemax=\"",
    "\" aria-label=\"",
    "\" data-value=\"",
    "\" data-max=\"",
    "\"><span class=\"bar-fill\"></span></div>"
  ],
  "views003": [
    "<span class=\"badge\">",
    "<span>",
    "</span></span>"
  ],
  "views004": [
    "<span class=\"difficulty-pip",
    "\" aria-hidden=\"true\"></span>"
  ],
  "views005": [
    "",
    "<span class=\"habit-copy\"><span class=\"habit-name\">",
    "</span><span class=\"habit-meta\"><span class=\"habit-type\">",
    "</span><span class=\"difficulty\" role=\"img\" aria-label=\"",
    "\">",
    "</span>",
    "</span>",
    "</span>"
  ],
  "views006": [
    "<span class=\"habit-streak\">",
    " ",
    "</span>"
  ],
  "views007": [
    "<div class=\"habit-main\">",
    "</div>"
  ],
  "views008": [
    "<button type=\"button\" class=\"habit-main edit-habit\" data-action=\"edit\" data-id=\"",
    "\" aria-label=\"",
    " alışkanlığını düzenle\">",
    "</button>"
  ],
  "views009": [
    "<article class=\"habit-card ",
    "\">",
    "<button type=\"button\" class=\"tick-button\" data-action=\"tick\" data-id=\"",
    "\" aria-label=\"",
    ": ",
    "\" aria-pressed=\"",
    "\" ",
    ">",
    "</button></article>"
  ],
  "views010": [
    "<div class=\"daily-summary\"><span>",
    "</span><strong>",
    "/",
    "</strong>",
    "</div>"
  ],
  "views011": [
    "<p class=\"eyebrow\">",
    " · MACERAN BAŞLIYOR</p><h1>Küçük adımlar.<br>Büyük mücadele.</h1>",
    ""
  ],
  "views012": [
    "<section class=\"battle-page\"><div class=\"battle-area\"><section class=\"battle-scene\"><canvas id=\"boss-canvas\" aria-hidden=\"true\"></canvas><span class=\"hit-number\" role=\"status\" aria-label=\"",
    "\" hidden></span><div class=\"battle-hud\"><div class=\"hero-meta\"><span>",
    " · SV. ",
    "</span><strong>",
    "/",
    " ",
    " CAN</strong></div>",
    "\n      <div class=\"boss-heading\"><p class=\"eyebrow\">SEZON ",
    " · GÜN ",
    "</p><h1>",
    "</h1><div class=\"boss-details\"><span>Boss canı</span><span>",
    " / ",
    "</span></div></div>",
    "\n      </div></section><div class=\"battle-footer\"><p class=\"boss-weakness\">Zayıf tür ",
    "</p>\n      ",
    "<p class=\"battle-summary\">Bugün ",
    " hasar, +",
    " iyileşti, +",
    " can</p><p class=\"field-note center\">İyileşme ve can kazancı kapanmış son günden. Bugün yalnız hasar canlıdır.</p></div>"
  ],
  "views013": [
    "<section class=\"result-card\" role=\"status\"><div class=\"result-banner\">",
    "<h2>",
    "</h2></div><p class=\"eyebrow\">SEZON SONUCU</p>",
    "<div class=\"result-effects\">",
    "</div>",
    "<p>",
    ". gün · ",
    "</p><div class=\"reward-grid\"><span>",
    " ALTIN<strong>+",
    "</strong></span><span>",
    " XP<strong>+",
    "</strong></span></div>",
    "<p class=\"field-note\">Ödül, sezonu kapattığında bakiyene eklenir. Sonraki sezon tam canla başlar.</p><button type=\"button\" class=\"primary wide\" data-action=\"close-season\">Sezonu kapat</button></section>"
  ],
  "views014": [
    "<p>Zeka bonusu: %",
    "</p>"
  ],
  "views015": [
    "<div class=\"section-heading\"><h2>",
    "</h2><button type=\"button\" class=\"text-button\" data-action=\"add\">",
    "</button></div>",
    "<div class=\"habit-scroll\">",
    "<div class=\"habit-list\">",
    "</div></div></section></section>"
  ],
  "views016": [
    "<nav class=\"me-tabs\" aria-label=\"",
    "\">",
    "</nav>"
  ],
  "views017": [
    "<button type=\"button\" data-action=\"me-tab\" data-tab=\"",
    "\" aria-pressed=\"",
    "\">",
    "</button>"
  ],
  "views018": [
    "<div class=\"me-heading\"><h1>",
    "</h1><button type=\"button\" class=\"text-button\" data-action=\"rename\">",
    "</button></div>"
  ],
  "views019": [
    "<div class=\"life-strip\"><span>",
    " ",
    "/",
    "</span>",
    "</div>"
  ],
  "views020": [
    "<div class=\"attributes-pane\">",
    "<p class=\"level-label\">",
    " ",
    " · ",
    " ",
    "</p><div class=\"stat-grid\">",
    "</div></div>"
  ],
  "views021": [
    "<section class=\"stat-card\">",
    "<h3>",
    "</h3><strong>",
    " ",
    "</strong>",
    "<small>",
    "/",
    " ",
    "</small></section>"
  ],
  "views022": [
    "<div class=\"me-content\">",
    "</div>"
  ],
  "views023": [
    "<button type=\"button\" class=\"gear-slot",
    "\" data-action=\"unequip\" data-slot=\"",
    "\" data-id=\"",
    "\" aria-label=\"",
    "\">",
    "</button>"
  ],
  "views024": [
    "<button type=\"button\" class=\"inventory-cell is-empty\" aria-label=\"",
    "\" disabled></button>"
  ],
  "views025": [
    "<button type=\"button\" class=\"inventory-cell",
    "\" data-action=\"inventory\" data-id=\"",
    "\" aria-label=\"",
    ". ",
    "\">",
    "",
    "</button>"
  ],
  "views026": [
    "<div class=\"me-content items-pane\"><div class=\"paper-doll\"><div class=\"slot-column\">",
    "</div><div class=\"doll-character\">",
    "</div><div class=\"slot-column\">",
    "</div></div><p class=\"doll-level\">",
    " ",
    "</p><div class=\"wallet-strip\"><div><span>",
    ": ",
    " / ",
    "</span>",
    "</div><strong>",
    " ",
    "</strong></div><div class=\"inventory-grid\" aria-label=\"",
    "\">",
    "</div><p class=\"item-info\" role=\"status\">",
    "</p></div>"
  ],
  "views027": [
    "<section class=\"me-page\">",
    "",
    "",
    "</section>"
  ],
  "views028": [
    "<p class=\"eyebrow\">DÜKKAN</p><h1>Küçük bir hazırlık.</h1><div class=\"gold-wallet\"><span>ALTININ</span><strong>",
    " ",
    "</strong></div><p class=\"field-note\">Altın yalnız kapatılan sezonların ödüllerinden gelir.</p><div class=\"shop-grid\">",
    "</div>"
  ],
  "views029": [
    "<article class=\"shop-item\"><img class=\"pixel item-sprite\" data-art=\"24\" src=\"",
    "\" alt=\"",
    "\"><p class=\"eyebrow\">",
    "</p><h2>",
    "</h2><p>",
    "</p><strong class=\"item-price\">",
    " ",
    "</strong><button type=\"button\" class=\"",
    " wide\" data-action=\"",
    "\" data-id=\"",
    "\" aria-label=\"",
    ": ",
    "\" ",
    ">",
    " ",
    "</button></article>"
  ],
  "views030": [
    "",
    " · ",
    "/",
    " ",
    ""
  ],
  "views031": [
    "<button type=\"button\" class=\"calendar-cell\" data-action=\"calendar-day\" data-date=\"",
    "\" aria-label=\"",
    "\" aria-pressed=\"",
    "\"><span>",
    "",
    "</span></button>"
  ],
  "views032": [
    "<section class=\"history-pane\"><h2>",
    "</h2><div class=\"calendar-legend\" role=\"img\" aria-label=\"",
    "\">",
    "</div><div class=\"calendar\" aria-label=\"",
    "\">",
    "</div><div class=\"day-detail\" role=\"status\"><p>",
    " · ",
    "/",
    " ",
    "</p><p class=\"completed-names\">",
    "</p></div><h2>",
    "</h2><div class=\"streak-list\">",
    "</div><h2>",
    "</h2><div class=\"season-list\">",
    "</div></section>"
  ],
  "views033": [
    "<div class=\"streak-row\">",
    "<div><span>",
    "</span><strong>",
    " ",
    "</strong>",
    "</div></div>"
  ],
  "views034": [
    "<small>",
    " ",
    ": ",
    " ",
    "</small>"
  ],
  "views035": [
    "<p>",
    "</p>"
  ],
  "views036": [
    "<section class=\"history-week\"><div class=\"section-heading\"><h3>",
    " ",
    "</h3><span>",
    "</span></div><p>",
    " → ",
    " · ",
    " ",
    "</p><p>",
    " ",
    " ",
    " ",
    " · +",
    " ",
    "</p></section>"
  ],
  "views037": [
    "<p>",
    "</p>"
  ],
  "views038": [
    "<div class=\"settings-card\" role=\"status\"><h3>1000 sezon · aynı tohum</h3><p>Yenme: %",
    " (",
    ")<br>Ölüm: ",
    "<br>",
    " günde hâlâ süren: ",
    "</p><p>Ortalama yenme günü: ",
    "<br>Ortalama ölme günü: ",
    "</p></div>"
  ],
  "views039": [
    "<section class=\"settings-card\"><h3>Geçmiş yeniden oynatımı</h3><p>",
    "</p><svg class=\"replay-chart\" viewBox=\"0 0 280 120\" role=\"img\" aria-label=\"Gün gün boss canı (kırmızı) ve karakter canı (yeşil)\"><polyline points=\"",
    "\" class=\"chart-boss\"/><polyline points=\"",
    "\" class=\"chart-hp\"/></svg><p class=\"field-note\">Kırmızı: boss · Yeşil: karakter</p><div class=\"table-scroll\"><table><thead><tr><th>Gün</th><th>Boss</th><th>Can</th></tr></thead><tbody>",
    "</tbody></table></div></section>"
  ],
  "views040": [
    "",
    " · ",
    ". gün"
  ],
  "views041": [
    "<tr><td>",
    "</td><td>",
    "</td><td>",
    "</td></tr>"
  ],
  "views042": [
    "<p class=\"eyebrow\">KONTROL SENDE</p><h1>Ayarlar.</h1><section class=\"settings-card\"><h2>Yedekleme</h2><p>Verilerin yalnız bu cihazda. Düzenli yedek al.</p><button type=\"button\" class=\"primary wide\" data-action=\"download\">JSON yedeğini indir</button><button type=\"button\" class=\"secondary wide\" data-action=\"share\">Yedeği paylaş</button><button type=\"button\" class=\"secondary wide\" data-action=\"import\">JSON’dan geri yükle</button><input type=\"file\" id=\"backup-file\" accept=\".json,application/json\" hidden><p class=\"field-note\">Geri yükleme bütün alışkanlık, tik, sezon, gün defteri ve eşya verilerini değiştirir. v0 yedekleri de kabul edilir.</p></section>\n      <section class=\"settings-card\"><h2>Cihazda saklama</h2><p class=\"storage-status\">",
    "</p><button type=\"button\" class=\"secondary wide\" data-action=\"persist\">Kalıcı depolama iste</button><p class=\"field-note\">",
    "</p></section><section class=\"settings-card\"><h2>Arşiv (",
    ")</h2>",
    "</section>\n      <details class=\"developer\" id=\"developer\" ",
    "><summary>Geliştirici · denge ve simülatör</summary><p class=\"field-note\">Bu bölüm güvenlik sınırı değildir. Değişiklikler yalnız yeni sezonlara uygulanır; süren sezon kendi ayarlarını kullanır.</p><form id=\"config-form\"><div class=\"config-grid\">",
    "</div>",
    "<button class=\"primary wide\" type=\"submit\">Yeni sezon ayarlarını kaydet</button><button class=\"secondary wide\" type=\"button\" data-action=\"reset-config\">Varsayılana dön</button></form><h2 class=\"spaced\">Simülatör</h2><label for=\"consistency\">Tutarlılık (%)</label><input id=\"consistency\" type=\"number\" min=\"0\" max=\"100\" value=\"",
    "\"><label for=\"sim-seed\">Sabit tohum</label><input id=\"sim-seed\" maxlength=\"80\" value=\"",
    "\"><p class=\"field-note\">5 günlük alışkanlık, N=1000; en fazla 90 gün. Bitmeyen sezonlar ayrıca sayılır. Formdaki seçili ayarı kullanır, oyuncu verisine yazmaz.</p><button class=\"secondary wide\" type=\"button\" data-action=\"simulate\" ",
    ">",
    "</button><label for=\"replay-season\">Gerçek geçmiş</label><select id=\"replay-season\">",
    "</select><button class=\"secondary wide\" type=\"button\" data-action=\"replay\" ",
    ">Seçili sezonu yeniden oynat</button><div id=\"sim-result\">",
    "</div></details>\n      <section class=\"settings-card\"><h2>Ana ekranından kullan</h2><p>Safari → Paylaş → Ana Ekrana Ekle. İlk alışkanlık ve tikini ana ekran ikonundan oluştur. Her zaman aynı yerden aç.</p></section><div class=\"version\"><span>Kindleborn v",
    "</span><span>Şema ",
    "</span></div><button type=\"button\" class=\"danger-text wide\" data-action=\"clear\">Tüm veriyi kalıcı olarak sil</button>"
  ],
  "views043": [
    "<div class=\"archive-row\"><span>",
    "</span><button class=\"secondary\" type=\"button\" data-action=\"edit\" data-id=\"",
    "\">Düzenle</button></div>"
  ],
  "views044": [
    "<label>",
    "<input name=\"",
    "\" aria-label=\"",
    "\" type=\"number\" min=\"",
    "\" max=\"",
    "\" step=\"any\" value=\"",
    "\" required></label>"
  ],
  "views045": [
    "<label>",
    " bonusları (Tahta, Demir, Çelik)<input name=\"",
    "\" value=\"",
    "\" aria-label=\"",
    "\" required></label>"
  ],
  "views046": [
    "<option value=\"",
    "\" ",
    ">Sezon ",
    " · ",
    "</option>"
  ],
  "views047": [
    "−",
    ""
  ],
  "app001": [
    "",
    " alışkanlık, ",
    " tik ve ",
    " sezon yüklenecek. Alışkanlıklar, tikler, sezonlar, gün defteri ve eşyalar dahil mevcut verilerin tamamı silinip bu yedekle değiştirilecek."
  ],
  "app002": [
    "<option>",
    "</option>"
  ],
  "app003": [
    "<option value=\"",
    "\">",
    " (",
    ")</option>"
  ],
  "app004": [
    "“",
    "” ve ona ait tüm tikler silinecek. Bu işlem geri alınamaz."
  ],
  "app005": [
    "<div class=\"empty\"><h1>Veriler açılamadı.</h1><p>",
    "</p><p>Safari’nin normal modunda, HTTPS veya localhost üzerinden yeniden aç.</p><button type=\"button\" class=\"primary wide\" id=\"retry-open\">Tekrar dene</button></div>"
  ],
  "data001": [
    "",
    " listesi geçersiz veya çok büyük."
  ],
  "game001": [
    "",
    ": ",
    "–",
    " arasında bir sayı olmalı."
  ],
  "game002": [
    "",
    ": üç bonus, 0 ile 1 arasında olmalı."
  ]
});
  function interpolate(key, values) { return TEMPLATES[key].map((part,i) => part + (i < values.length ? values[i] : '')).join(''); }
  const compareNames = (a,b) => a.localeCompare(b,'tr');
  const TYPE_LABELS = freezeTree({ 'Güç': 'Güç', 'Zeka': 'Zeka', 'Dayanıklılık': 'Dayanıklılık', 'Odak': 'Odak' });
  const DIFFICULTY_LABELS = freezeTree({ 1: 'Kolay', 2: 'Orta', 3: 'Zor' });
  const tierLabel = value => `KADEME ${number(value)}`;
  const replayWin = 'Yenme';
  // Templates contain only trusted static markup; values are escaped by callers.
  // No eval, remote language loading or language selector is introduced.
  return Object.freeze({ COPY, interpolate, compareNames, TYPE_LABELS, DIFFICULTY_LABELS, tierLabel, replayWin, TEXT, number, formatDate, ASSETS, ART_SIZES, BOSSES: Object.freeze(BOSSES.map(Object.freeze)), ITEMS: Object.freeze(ITEMS.map(Object.freeze)), SLOTS: Object.freeze(SLOTS) });
});
