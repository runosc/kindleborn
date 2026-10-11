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
  return Object.freeze({ ASSETS, ART_SIZES, BOSSES: Object.freeze(BOSSES.map(Object.freeze)), ITEMS: Object.freeze(ITEMS.map(Object.freeze)), SLOTS: Object.freeze(SLOTS) });
});
