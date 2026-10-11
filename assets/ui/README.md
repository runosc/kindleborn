# Arayüz kiti v01 (kodla çizim)

42 şeffaf PNG, `hazir/` içinde. Yalnız Endesga 32 renkleri, alfa ikili (tam saydam veya tam opak), 1 piksel koyu dış çizgi (`#181425`), ışık sol üstten. Claude kodla çizdi: `kaynak/ui_kiti_v01.py` (yeniden üretmek için: `py -3 -I kaynak/ui_kiti_v01.py <assets klasörü>`). Alan ve boyut ayrıntıları `ui_kiti_v01.json`; önizleme `ui_kiti_v01_onizleme.png` (büyük görseller kırpılmıştır).

Hepsi tam sayı ölçekle (3 css px = 1 sanat pikseli) ve `image-rendering: pixelated` ile gösterilmelidir.

## İçerik

| Grup | Dosyalar | Boyut | Not |
|---|---|---|---|
| Panel | `ui_panel_v01`, `ui_panel_kart_v01` | 24×24 | 9-dilimli, kenar 8; koyu plaka ve açık kart |
| Slot | `ui_slot_v01`, `ui_slot_secili_v01` | 28×28 | İçe 24×24 eşya ortalanır |
| Çubuk çerçeve | `ui_cubuk_cerceve_v01` | 12×7 | Yatay 9-dilimli (sol/sağ 3); iç alan x=1..w−2, y=1..5 |
| Çubuk dolgu | `ui_cubuk_dolgu_{kirmizi,turuncu,yesil,mavi,altin}_v01` | 4×5 | Yatay gerilir; can=kırmızı, boss=turuncu, XP=yeşil |
| Buton | `ui_buton_v01`, `_basili_`, `_pasif_` | 24×16 | 9-dilimli, kenar 6 |
| Tik kutusu | `ui_tik_bos_v01`, `ui_tik_dolu_v01` | 12×12 | |
| Simgeler 8×8 | `ikon_kalp_v01`, `ikon_altin_v01`, `ikon_xp_v01`, `ikon_kilit_v01`, `ikon_onay_v01` | 8×8 | |
| Simgeler 16×16 | `menu_ayar_v01` (dişli), `ikon_kafatasi_v01` | 16×16 | |
| Efekt: vuruş | `efekt_vurus_v01_1..3` | 24×24 | Kare dizisi, ~80 ms |
| Efekt: iyileşme | `efekt_iyilesme_v01_1..3` | 16×16 | Yukarı süzülen artı |
| Efekt: hasar aldın | `efekt_hasar_aldin_v01_1..2` | 32×32 | Kenar kırmızı parlama; ekrana üst katman |
| Efekt: boss öldü | `efekt_boss_oldu_v01_1..4` | 48×48 | Genişleyen patlama ve enkaz |
| Efekt: konfeti | `efekt_konfeti_v01_1..3` | 48×48 | Düşen parçalar |
| Kurdele | `kurdele_zafer_v01`, `kurdele_yenilgi_v01` | 96×24 | Yazı uygulamadan eklenir; alan x=14..81, y=7..14 |
| Boş slot silüeti | `slot_bos_kilic_v01`, `slot_bos_zirh_v01`, `slot_bos_kozmetik_v01` | 24×24 | `ekipman_kozmetik` ikonlarından türetildi |

## Not

- Menü simgelerinin geri kalanı (Bugün, Ben, Dükkan, Geçmiş), tür ikonları, karakter, arka plan, sandık ve altın yığını bu pakette YOKTUR; Codex'te skill ile üretilecek.
- 9-dilimli dosyaların kesim değerleri `ui_kiti_v01.json` içinde `dilim` alanındadır.
- Bu paket `assets/manifest.json` dosyasına eklenmedi; kayıt `ui/ui_kiti_v01.json` içindedir. Ana manifest'e taşımak ajanın işidir.
- Uygulamaya henüz bağlanmadı; ekranda görünümü denenmedi.
