# v1.2.0 çalışma ve doğrulama raporu

A önkoşulları: `node tests.js` 46/46; headless masaüstü Chrome (DPR 3), 360×640 / 390×844: main outline none, alt bar 72 px, başlık 63 px, kart 66 / 69 px. Kartta ●/○ yok. A yeniden uygulanmadı. Mavi çerçeve kaynağı: main tabindex ve sayfa geçişindeki focus için Safari varsayılan outline; önceki yama korunuyor.

## B

Değişenler: index.html, app.js, views.js, style.css, content.js, sw.js, assets/manifest.json (yalnız kayıt). Üç menü: Savaş / Ben / Dükkan. Savaş birleşik ekranında liste içten kayar; eski today eylemi Savaş'a, history kimliği Ben'e yönlenir. Sonuç kartı liste alanında korunur. 650 ms impact ve hasar sayısı aynı sahnede.

46 test geçti. İlk tarayıcı ölçümü: alt çubuk 72, başlık 63; içerik 493 / 697 px. Boss bloğu alanın en fazla %40'ı, 3 px katına aşağı yuvarlanır. Kartlar 66 / 69 px. 0 ve 20 alışkanlık, kısa/uzun ad, vuruş, Ben, Dükkan, Ayarlar için 14 görüntü; belge kaydırması/yatay taşma/JS hatası yok. Sanat pikseli artık tüm görsellerde sabit 3 CSS px. Kısa sahne, mevcut büyük boss ve arka planı kırpar; yeni görsel veya kesirli ölçek yok.

Gerçek iPhone/Safari, VoiceOver, gerçek safe-area ve PWA güncellemesi bu aşamada denenmedi. Dil seçici, boss ölçekleme ve denge değişikliği yapılmadı.

Kullanıcı ölçü kararı: alt sekmeler 36 px ve takvim hücreleri 18 px olarak kalacak; bu iki bileşende 44 px dokunma alanı şartından açıkça vazgeçildi.

## C

Değişenler: views.js, style.css, app.js, content.js, store.js, game.js, data.js, tests.js. Yeni tek veri olayı: geçerli slot için null itemId; IndexedDB sürümü/depoları değişmedi. Mevcut gün sonu ekipman hesabı korunuyor. Null olay için diğer kimlik/zaman/tekillik kontrolleri geçerli; normal kuşanmanın satın alma/slot kontrolleri aynen korunuyor.

49 test geçti. İki boyutta 22 görüntü: boş/kılıç/tüm slotlar, Özellik, geçici eski Geçmiş, Savaş, Dükkan, Ayarlar. Belge kaydırması/yatay taşma/JS hatası yok. Alt sekme 36 px; karakter 192×288; slot 84×84, eşya 72×72; slot arası 6 px; paper doll 360×288; envanter 354×264, dört sütun/üç satır. Karaktere ekipman çizilmez. Izgara altında son eşya şeridi. Can ve toplam XP Özellik'e taşındı; ad/düzenleme sekmelerin üstünde kalır. Kısa ekranda tüm hücreleri görmek için Eşya içeriği içinde kaydırılır.

Gerçek iPhone/Safari, VoiceOver ve gerçek safe-area denenmedi. Tarayıcı kontrollerinin son turunda gerçek IndexedDB giy/çıkar etkileşimi ayrıca sınanacak. Store birim testinde yalnız transaction taşıyıcısı bellekle değiştirilir, unequip callback'i gerçek kaynaktan çalıştırılır.

## D ve son teslim

53 test geçti: kesinti, bugün henüz tik yok, yeni alışkanlık, sıfırlanma, best, ay/yıl/artık gün sınırları; takvim 0/1/33/34/66/67/99/100; geçersiz slot ve null olaylı / eski yedekler. B tamamlanınca 46, C tamamlanınca 49, D tamamlanınca 53 test çalıştırıldı; hiçbir aşama atlanmadı.

Takvim Pazartesi başlangıçlı 15 sütun × 7 satırdır (bugünün haftasına göre 99–105 geçmiş/bugün hücresi; geleceği çizmez). Hücre 18×18, aralık 3 px, toplam 312×144. Bugün işaretli; seçilen günün tarih/sayı ve tamamlanan adları altta. Seriler azalan sıralı; aktif/sönük alev, gerekli olduğunda kupa ve en uzun seri. Savaş satırında 24×24 mini alev bulunur; kart yüksekliği 66/69 px olarak kalır. Seri listesi ve sezon defteri kendi içinde kayar.

Kullanıcıya görünen ekran/ileti metinleri ve güvenilir HTML metin şablonları content.js'e taşındı (COPY, TEXT, interpolate). Tür/zorluk görüntü adları da buradan okunur; config'teki iş kimlikleri aynı kalır. Tarih/sayı biçimleme ve ad sıralama aynı dosyada. Dil seçici veya dışarıdan dil yükleme eklenmedi. JavaScript kapalıyken gereken noscript açıklaması ve statik HTML/PWA metadata'sı yerinde kalır.

Değişen bütün teslim dosyaları: index.html, app.js, views.js, style.css, content.js, derive.js, store.js, game.js, data.js, simulator.js (metin kaynağı yükleme sırası), config.js, sw.js, tests.js, README.md, assets/manifest.json (yalnız mevcut PNG kayıtları), bu rapor ve ekran dizini. config.js / sw.js sürümü birlikte **1.2.0**. 11 yeni hazır PNG önbelleğe kaydedildi. Yeni runtime dosyası, paket veya CDN yok.

Son ölçümler (CSS px, gerçek safe-area hariç):

| Öğe | 360×640 | 390×844 |
| --- | ---: | ---: |
| Alt bar | 72 | 72 |
| Başlık | 63 | 63 |
| Kullanılabilir main | 493 | 697 |
| Savaş boss bloğu | 195 | 276 |
| Canvas sahne | 132 | 213 |
| Tek / iki satırlı kart | 66 / 69 | 66 / 69 |
| Ben alt sekmesi | 36 | 36 |
| Karakter / paper doll yüksekliği | 288 | 288 |
| Slot / eşya ikonu | 84 / 72 | 84 / 72 |
| Envanter (4×3) | 354×264 | 354×264 |
| Takvim | 312×144 | 312×144 |

30 teslim ekran görüntüsü: her boyutta kısa/uzun ad, 0 ve 20 alışkanlık, vuruş, seri; Eşya boş/kılıç/tam ve ızgaranın altı; Özellik; Geçmiş; Dükkan; Ayarlar. Yerel ekran görüntüsü dizini `notes/rutin-v1-2-ekranlar.md` dosyasındadır. Ölçüm JSON'u ve çalıştırılabilir QA betiği `.qa/v12/` içindedir; ekran görüntüleri ve QA çıktıları yayın listesine dahil değildir.

Gerçek IndexedDB ile iki boyutta: üst slottan çıkar; ızgaradan giy/çıkar; aynı slotta eşya değiştir; boş slota dokun; onay penceresi çıkmaması; takvim seçimi; işlem sonrası null olaylı yedeğin doğrulanması. Kapalı gün defteri işlem öncesi/sonrası birebir aynı. Test envanteri gerçek oyun hesabıyla kazanılmış sezon ödüllerinden finanse edildi; negatif bakiye veya sahte ödül yok. Sayfa kaydırması/yatay taşma/JS hatası yok. Son görüntüler yalnız masaüstü headless Chrome, DPR 3 ile doğrulandı.

Kontrol: assets altında başlangıçtaki bütün dosyalar (manifest kaydı hariç) SHA-256 olarak aynı. Sayısal GAME_CONFIG, şema sürümü ve CSP başlangıçla aynı; DB2 ve depoları korunur. `node tools/release-files.cjs`: 115 yerel yayın dosyası. `git diff --check` temiz. Push, commit veya yayınlama yapılmadı.

Sığmayanlar: kısa ekranda Eşya'nın 12 hücresi aynı anda görünmez; içerik alanı kaydırılır. Can ve toplam XP Özellik'e taşındı; ad/düzenleme, seviye, XP ve altın korunur. %40 boss alanı ve 3 px ölçek birlikte korunurken büyük boss/arka plan sahne sınırında kırpılır. Sezon sonuç kartı Savaş listesinin kaydırma alanındadır; kaybolmaz.

Denenmeyenler: gerçek iPhone/Safari, VoiceOver, gerçek safe-area, diğer DPR değerleri, bu sürümün gerçek PWA güncelleme/çevrimdışı kabul turu. Önceki sürümün bu alanlardaki testleri yeni sürüm için kanıt sayılmadı. Yeni görsel çizimi, boss can ölçekleme/denge, dil seçici ve dil dosyası yükleme ertelenmiş kapsam olarak bırakıldı. B/C/D'de yarım bırakılmış aşama yok.
