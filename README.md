# Kindleborn v1.1.1

Türkçe, cihazda çalışan alışkanlık takip RPG’si. Düz HTML / CSS / JavaScript; paket, derleme, CDN, sunucu uygulaması, hesap, analitik ve bildirim yok. GitHub Pages yalnız statik dosyaları sunar. Alışkanlık, tik ve oyun verisi IndexedDB’de kalır; internete gönderilmez. İlk çevrimiçi açılışta uygulama kabuğu, yerel font ve bütün oyun sprite’ları önbelleğe alınır.

## Yerelde çalıştırma

Bu klasörde Node.js ile:

```powershell
node tests.js
node serve.js
```

[http://localhost:8080/rutin/](http://localhost:8080/rutin/) adresini aç. Yerel sunucu özellikle `/rutin/` alt yolunu kullanır; `Ctrl+C` ile durur. Başka port için `$env:RUTIN_PORT = '8088'` ayarla. Node yalnız test ve önizleme için gerekir; yayınlanan uygulamada bağımlılık yoktur.

`file://` ile açma. Service worker için HTTPS veya localhost gerekir. Telefonda bilgisayarın düz HTTP IP adresiyle açmak PWA kabul testi için yeterli değildir; HTTPS Pages adresini kullan.

## Ekranlar

- **Boss:** ana ekran. Karakter canı, parçalı boss canı, sezon günü, zayıf tür ve büyük boss sprite’ı. Altında bugünün canlı hasarı ve kapanmış son günün boss iyileşmesi / karakter can kazancı gösterilir. Kısa alışkanlık listesinden tik atınca boss sarsılır, hasar sayısı görünür. Üstteki KINDLEBORN düğmesi bu ekrana döner.
- **Bugün:** günlük alışkanlık ekle / düzenle / arşivle, tür rozeti ve zorluk noktaları. Tik yalnız bugün için atılır veya geri alınır. Tarih gezintisi ve haftalık hedef alanı kaldırıldı.
- **Ben:** karakter adı, seviye, XP, can ve dört özelliğin seviyesi / XP’si. Kılıç, Zırh, Pelerin, Taç, Yüzük ve Kolye slotları. Ekipman karakterin üzerinde değil slotlarda görünür. Unvan yoktur; `game.js → levelTitle()` ilerisi için null döner.
- **Dükkan:** altın, 3 kademeli kılıç/zırh ve 4 kozmetik. Her eşya bir kez satın alınır, ardından kuşanılabilir. Kozmetiklerin oyun etkisi yoktur.
- **Geçmiş:** son 8 haftanın alışkanlık başına k/7 ve yüzdesi; sezon sonuçları ve kapanmış son 56 günün defteri. Salt okunur.
- **Ayarlar:** sağ üstteki dişli. JSON yedek, geri yükleme, depolama durumu, arşiv, sürüm ve varsayılan kapalı Geliştirici bölümü.

İlk açılışta 1–24 karakterlik karakter adı istenir. Alışkanlık yoksa sezon başlamaz. İlk aktif alışkanlık eklendiğinde birinci sezon otomatik başlar. Varsayılan alışkanlık Güç / Orta / günlük; ad en fazla 80 karakter. Tür listesi yalnız `config.js → TYPES` içinde tanımlıdır. Kaçınma alışkanlıkları da elle tiklenir; tik “bugün yapmadım” beyanıdır.

## Gün defteri ve geçmişin korunması

Gün yerel **00:00**’da kapanır. Uygulama açılınca, görünür hâle gelince ve açıkken gece yarısı geçilince geçmiş günler deftere eklenir. iOS arka planda JavaScript’i durdurursa öne geldiğinde eksikleri tamamlar.

Her veri değiştirme işlemi, alışkanlık düzenlemesi ve arşivleme dahil, önce kapanmış günleri hesaplar. Kapanış ve değişiklik tek, bütün depoları kapsayan IndexedDB transaction’ında yapılır. Aynı gün tekrar yazılmaz; eski defter kaydı ve tik snapshot’ı değişmez. Birden fazla sekmenin aynı günü iki kez kapatması da önlenir.

Tiki olan alışkanlık **kalıcı silinemez**, arşivlenir. Hiç tiki olmayan alışkanlık ayrı onayla silinebilir. **Tüm veriyi sil** ve yedekten geri yükle açık, onaylı sıfırlama eylemleridir. Bunlar oyun defteri, sezon ve eşya kayıtlarını da kapsar.

## Başlangıç oyun kuralları

Sayısal değerler denge tahminidir; `config.js → GAME_CONFIG` içinde tek yerde bulunur. Sezon başında ayarların kopyası sezon kaydına alınır. Geliştirici bölümünde yapılan değişiklik **yalnız yeni sezonlara** uygulanır. Süren sezonun ayarını değiştiren düğme yoktur.

| Konu | Varsayılan |
|---|---|
| Tik puanı | Snapshot zorluğu (1/2/3) × 10 |
| Karakter XP | Tik puanları + kapatılan boss ödülü XP |
| Tür XP | O türün snapshot’larından gelen tik puanları |
| Seviye eşiği | L→L+1: 100 + 50 × (L−1); tüm seviyeler 1’den başlar |
| Başlangıç boss canı | 0,6 × 14 × başlangıç günlük potansiyeli |
| Boss ölçeği | Yenilmiş boss sayısı için ×1,1^n; önceki sonuç ölümse ayrıca ×0,9 |
| Zayıf tür | Tik hasarı ×1,5 |
| Kılıç / Zırh | Tahta %5, Demir %10, Çelik %15 |
| Gün sonu boss iyileşmesi | Kaçırılan puan ×0,5; başlangıç canını aşmaz |
| Haftalık iyileşme tavanı | Pazartesi–pazar, başlangıç boss canının %20’si |
| Günlük boss vuruşu | (100/14) × r × (1−zırh bonusu); r, [0,2) aralığında |
| Mükemmel gün | +5 + 0,5 × Odak seviyesi can |
| Azami can | 100 + 5 × Dayanıklılık seviyesi; sezon tam canla başlar |
| Yenme ödülü | ⌊100 ×1,1^n ×(1+min(%30, %2×Zeka seviyesi))⌋ altın; 200 XP |
| Ölüm ödülü | ⌊%25 ×100 ×1,1^n⌋ altın; 0 XP |
| Altın bakiyesi | Kapatılmış sezonların ödülü − satın alma fiyatları |
| Ekipman fiyatları | Tahta 50, Demir 150, Çelik 400 |
| Kozmetik fiyatları | Pelerin 100, Yüzük 150, Kolye 200, Taç 250 |

Hasar önce uygulanır. Boss sıfıra düşerse aynı gün boss vuruşu/ölüm uygulanmaz. Yenilmediyse iyileşme → boss vuruşu → mükemmel gün canı → ölüm kontrolü sırası izlenir. Bugün için yalnız hasar canlıdır; iyileşme, vuruş ve mükemmel gün kapanışta uygulanır. Ardışık sıfır-tikli günlerde yalnız ilk boş gün iyileşme/vuruş yapar; sonraki boş günler etkisizdir. Tikli gün diziyi sıfırlar.

Sonuç ekranda görünür, **Sezonu kapat** ile kalıcı ödüle dönüşür ve sıradaki bossla yeni sezon başlar. Aynı gün kazanmayı sağlayan tik, sezon kapatılmadan geri alınabilir. Boss sırası Tembel Beyin (Odak) → Kaydırma Canavarı (Zeka) → Bahane Goblini (Güç); sonra başa döner.

RNG, FNV-1a tohum + Mulberry32 üretecidir. Günlük r tohumu `sezon.tohum + ':' + tarih`. `Math.random` yoktur. Sezon kimliği/tohumu oluşturulurken cihazın kriptografik kimliği kullanılır ve saklanır; aynı kayıt/ayar her hesaplamada aynı sonucu verir. Eşya kuşanma, gün sonuna kadarki en son olayı kullanır; kılıç ve zırh bonusları toplanmaz, ilgili slotun kuşanılmış kademesi geçerlidir.

## Yeni veri şeması ve v0 taşıma

IndexedDB `rutin`, sürüm **2**. `settings.main.schemaVersion` **2**. Sürüm 1→2 yükseltmesi eski alışkanlıkları ve tikleri yeniden yazmaz, silmez. Yalnız yeni depolar ve oyun ayarları eklenir. Eski `haftalikHedef` ve snapshot hedefleri korunur; v1 ekranında bütün alışkanlıklar günlük sayılır. Yeni veya düzenlenmiş alışkanlık ve yeni tik snapshot’larında hedef 7’dir.

```js
habit = { id, ad, tur, zorluk, haftalikHedef, olusturma, arsiv }
tick = { id, habitId, tarih, ts, snapshot: { tur, zorluk, haftalikHedef } }
settings = { schemaVersion: 2, karakterAdi, oyunAyar }
season = { id, sira, bossId, baslangic, baslangicTs, tohum, p0, bossCan0, ayar,
  sonuc: null /* veya { durum, bitisTarihi, bitisTs, gun, altin, xp } */ }
gun = { tarih, sezonId, potansiyel, yapilan, kacirilan, tikSayisi, mukemmel }
purchase = { id, itemId, ts, fiyat }
equip = { id, slot, itemId, ts }
```

`habits`, `ticks`, `settings` depoları korunur. Yeni depolar `seasons`, `gunler` (anahtar tarih), `purchases`, `equips`. Günlük tik için `[habitId,tarih]` ve satın alma için `itemId` benzersiz indeksleri vardır. Kuşanma slotları `kilic`, `zirh`, `pelerin`, `tac`, `yuzuk`, `kolye`; katalogda kozmetiklerin ana slotu `kozmetik`, alt slotu `kozmetikSlot` alanındadır.

Tarihler yerel YYYY-MM-DD, olay zamanları epoch milisaniyesidir. Takvim hesabında UTC/ISO dönüşümü veya 24 saatlik milisaniye bölümü kullanılmaz. Can, güncel boss canı, XP, seviye ve altın **kalıcı yazılmaz**; `game.js` bunları tik, gün defteri, sezon sonucu ve olaylardan türetir. İzin verilen kalıcı hesaplar başlangıç potansiyeli/canı, gün defteri ve kapatılmış sezon sonucudur.

## Yedekleme

Ayarlar → **JSON yedeğini indir**: `kindleborn-yedek-YYYY-MM-DD.json`. iOS’ta Dosyalar / İndirmeler’i kontrol et. **Yedeği paylaş** desteklenen cihazlarda paylaşım ekranını açar; dosyayı Dosyalar’a kaydedebilirsin. Desteklenmezse indirme kullanılır. Paylaşım çağrısı iOS’un kullanıcı dokunuşu şartını korur.

Şema 2 yedeği habits, ticks, settings, seasons, gunler, purchases ve equips taşır. Şema 1 v0 yedekleri de kabul edilip boş oyun depoları / varsayılan ayarlarla şema 2’ye çevrilir. v0 alışkanlıkları ve tikleri aynen kalır.

Geri yüklemeden önce şema, kimlik, tarih, referans, günlük tik tekilliği, sezon sırası, boss başlangıç canı, defterin tik sayısı/puanı, satın alma/kuşanma bağlantıları ve sezon sonuç/ödül hesabı doğrulanır. Dosya en fazla 25 MB; alışkanlık 10.000, tik 500.000, her oyun listesi 50.000 kayıt. Geçersiz dosya mevcut veriye dokunmaz. Sonra **bütün mevcut verinin değişeceği** sayılarla açıklanıp onay istenir. Temizleme ve yazma tek transaction’dır; hata olursa eski veri korunur.

İlk açılışta `navigator.storage.persist()` istenir; destek/izin durumu Ayarlar’dadır. Reddedilmesi uygulamayı durdurmaz. Kalıcı depolama elle silmeye karşı korumaz; düzenli yedek al.

## Geliştirici ve simülatör

Geliştirici açılır bölümü oyuncu akışından ayrıdır; güvenlik sınırı değildir. Bütün denge sabitleri ve üç kademenin bonusları geçerlilik denetimiyle düzenlenir. **Varsayılana dön** de yalnız yeni sezonları etkiler.

- **Sentetik:** seçili form ayarı, tutarlılık yüzdesi ve sabit tohumla 1000 bağımsız sezon. 5 Orta günlük alışkanlık, dört türe sırayla dağılım; başlangıç ekipmanı/ödülü yok. Her gün her alışkanlığın tik olasılığı seçili tutarlılıktır. Yenme oranı ve ortalama yenme/ölme günü verilir. 90 günün sonunda bitmeyenler ayrı sayılır; otomatik kaçma sonucu uydurulmaz.
- **Gerçek geçmiş:** varsayılan son sezon veya seçilen sezon, formdaki ayarla yeniden hesaplanır. Defter potansiyeli korunur; puan çarpanı değişirse potansiyel ve P0 da oransal ölçeklenir. Gün gün boss/karakter eğrisi ve tablo gösterilir. Yeni ayarla sonuç değişirse yalnız kayıtlı zaman aralığı yeniden oynatılır; sonrasına hayalî gün eklenmez.

Her iki mod aynı saf `game.js` fonksiyonlarını kullanır. `simulator.js` bir Web Worker’dır; hesap sırasında arayüz yanıt verir. Oyuncunun IndexedDB kayıtlarına yazmaz. Formdaki kaydedilmemiş ayar simülasyonda denenebilir; kalıcı uygulama için ayrıca **Yeni sezon ayarlarını kaydet** gerekir.

## Görseller ve font

Üç 96×96 boss, 64×96 karakter, 120×270 temalı arka planlar, 24×24 eşya/portre/ödüller, 16×16 tür/menü ikonları ve hazır UI kiti kullanılır. Görseller yeniden üretilmedi veya değiştirilmedi. Yollar `content.js → ASSETS` içinde; boss/eşya kataloğu mevcut eşlemelerini korur. `_x6`, zemin kontrolü, ham dosya, atlas, prompt, `tmp/` ve `.qa/` yüklenmez veya önbelleğe alınmaz.

Palet: `assets/paletler/endesga-32.hex`. Bütün ekran sprite’ları aynı **S = max(1, floor(içerik CSS genişliği × DPR / 120))** ölçeğini kullanır. CSS boyutu sanat boyutu × S / DPR’dir. `--art-pixel` aynı ölçeği panel, slot, düğme ve çubuklara taşır. Sprite başlangıcı ve son boyutu cihaz pikseline hizalanır; tarayıcının CSS boyutlarını 1/64 piksele yuvarlaması küçük bir transform düzeltmesiyle karşılanır. Kaydırmada hizalama yenilenir. Canvas `imageSmoothingEnabled=false`, sprite’lar `image-rendering: pixelated`; sarsılma tam sanat pikseli adımlarıyla yapılır.

Karakter yalnız Ben ekranındadır; ekipmanlar 28×28 slotta, boş slot silüetle görünür. Panel/kartlar 8, düğmeler 6 sanat pikseli kenarlı 9-dilimli görseller kullanır. Can kırmızı, boss canı parçalı turuncu, XP yeşil dolgudur. Vuruş, iyileşme, can kaybı, boss yenme ve konfeti hazır karelerle yaklaşık 80 ms/kare gösterilir; azaltılmış hareket tercihinde ilk kare sabit kalır. Sonuçta kurdele, portre, kapalı sandık, altın ve XP; kapatılmış sezonun Geçmiş satırında açık sandık görünür. Metin ve erişilebilir adlar DOM’da kalır; dekoratif görseller `aria-hidden` kullanır.

Uygulama ikonları `assets/uygulama_ikonu/hazir/` kaynaklarından `icons/` içine birebir kopyalandı. 512 ikonunun şekil sınırı (80,112)–(431,399), merkezden en uzak şekil pikseli yaklaşık 210,5 px’dir. Maskable güvenli dairesinin yarıçapı 204,8 px olduğundan manifest’te maskable girdisi kaldırıldı; kaynak görsel değiştirilmedi.

Press Start 2P yerel `assets/fonts/PressStart2P-Regular.ttf` dosyasından yüklenir; lisans `assets/fonts/OFL.txt`. CDN veya dış font isteği yoktur.

## Varsayımlar ve bilinen sınırlar

- Kısa boss sahnesinde üst gökyüzü ve alt zemin kırpılır; platform y≈170, boss x=12/y=77 sanat pikselinde durur. Uzun sahnenin üstü arka planın ilk gökyüzü satırıyla uzar. İçerik dikey kaydırılabilir; alt menü sabittir. Ben ekranında büyük karakter, dar ekranlarda okunabilir XP alanı için tek sütunda gösterilir.
- Kafatası ve ayarlar simgesi UI kitinin gerçek ölçüsüne göre **16×16**; kalp/altın/XP/kilit/onay **8×8**’dir. UI kitinin JSON kaydı bu ayrım için esas alındı.
- Can kaybı efekti açık uygulamada gün değişirken önceki canla karşılaştırılarak gösterilir. Efektler sunumdur, saklanan oyun verisine alan eklemez. Ekrana yeniden girişte sonuç/iyileşme kare dizisi tekrar oynayabilir.

- **14 gün bir denge hedefidir, zaman aşımı değildir.** Verilen sonuç şemasında yalnız yenme/ölüm bulunduğu için 14. günde yeni bir kaçma/beraberlik kuralı eklenmedi. Sonuç çıkana kadar sezon sürer. Sıfır-tikli günlerin tek-gün kuralı nedeniyle bazı sezonlar uzun süre devam edebilir.
- Başlangıç seviyesi 1; varsayılan tam can 105. Tür seviyeleri o günün tikleri dahil hesaplanır. Azami can yükselirse mevcut can kendiliğinden doldurulmaz; yalnız mükemmel gün veya yeni sezon can sağlar.
- Altın aşağı yuvarlanır; hasar/can/iyileşme hesapları yuvarlanmadan yapılır, ekranda en fazla bir ondalık gösterilir. Haftalık tavanda başlangıç boss canı ve gerçekten uygulanmış iyileşme kullanılır.
- Gün içi zorluk azaltılması/arşivleme yapılan puanı potansiyelin üzerine çıkarabilir. Kaçırılan puan negatif sayılmaz: `max(0, P−yapılan)`. Mükemmel gün, gün kapanışında uygun alışkanlıkların hepsinin tiki olması ve P>0 ile belirlenir.
- Gün defteri, alışkanlık tanımlarının yalnız uygulama üzerinden değiştirildiğini varsayar. Uygulama kapalıyken kaçan günler ilk açılışta mevcut tanımlarla, tarih sınırına göre kapanır; değişiklik önce kapanış yaptığı için gelecek düzenleme eski günü etkilemez. Başka cihaz/haricî IndexedDB düzenlemesi desteklenmez.
- Aynı gün sezonu kapatıp yenisini başlatmak mümkündür. Bu ayrım için **baslangicTs** ve sonuçta **bitisTs** eklenmiştir. Önceki sezona dahil edilmiş aynı-gün tikleri kilitlenir; yeni bossu tekrar vurmaz. Her alışkanlığın günde tek tiki kuralı korunur. Eski tik olmayan başka bir alışkanlık bugünkü yeni sezona katkı verebilir.
- Aynı gün biten eski sezonun kapanış sonrasındaki ekipman olayları o kapanış sonucunu değiştirmez. Kapanış anı olay kesimidir. Ek zaman alanı olmayan şema 2 dosyaları yerel gün başı/sonu sınırlarını kullanır; aynı gün ardışık sezonları ayıramayan çakışmalı dosyalar reddedilir.
- v0’ın geçmiş tikleri karakter/tür XP’sine katkı verir. Yeni boss sezonu v1’de başlangıç anından itibaren hesaplanır; eski tikler bosslara yeniden hasar olarak uygulanmaz. V0’da geçmişten eklenen tikler aynen saklanır; v1’de değiştirilemez.
- `haftalikHedef` eski yedek ve snapshot’larda korunur; v1 hesabında günlük 7 sayılır. Eski `derive.js` fonksiyonları ve v0 regresyon testleri uyumluluk için tutulur; aktif tik yazma kontrolü `game.js` + `store.js` ile yalnız bugüne izin verir.
- Arşivli alışkanlık yeni tik alamaz. Bugünkü, henüz kapanmamış sezona ait tikini geri almak için arşivden çıkarabilirsin. Defterde uygun alışkanlık ID listesi yoktur; doğrulama tarihi tanımı yeniden icat etmek yerine defterin tik sayısı/puanı/kaçırılan puanı ve temel mükemmel-gün koşullarını doğrular.
- Cihazın yerel tarihi esas alınır. Saat/saat dilimini elle geriye almak kapanmış bir günü açmaz; ileri almak günleri kapatabilir. Haricî saat manipülasyonu için yeni bir oyun mekaniği yoktur.
- Admin paneli, sunucu, ortak boss, içerik düzenleme ekranı, unvan, kask ve kalkan v1 kapsamı dışındadır. Oyun kataloğu `content.js` içinde, ileride sunucuya taşınabilecek düz veridir.

## Doğrulama

V1.1 için altı yeni test: config/kabuk sürümü, dosya ve önbellek bütünlüğü, PNG IHDR boyutları, UI/efekt boyutları, yasak dosyaların dışlanması ve ikon kopyalarının birebir eşitliği. Mevcut 38 oyun/veri testi korunur.

V1.1 tarayıcı kontrolü: 360/390/430 CSS px × 640/900 CSS px, DPR 2.625 ve 3, altı ekran; bütün sprite başlangıç/boyutları cihaz pikselinde tam sayı ve ortak S, yatay taşma yok. Tüm kabuk çevrimdışı bulunur; v1 → v1.1 gerçek worker güncellemesi IndexedDB’nin bütün depolarını birebir korur ve eski önbelleği siler. Sonuç ve kapatılmış sandık kontrol edildi; kabuk dışı uygulama isteği ve JavaScript hatası görülmedi.

`node tests.js`: **44 bağımlılıksız test**. v0 tarih/hafta/snapshot/yedek testleri; belirleyici RNG ve aralığı; seviye eğrisi; bugünkü tik geri alma; geçmiş/gelecek tik yasağı; silme koruması; zayıf tür ve ekipman bonusları; tek-boş-gün kuralı; haftalık iyileşme tavanı; mükemmel gün; aynı-gün zafer/ölüm sırası; ödül ve Zeka tavanı; gece yarısı defteri, kapalı günlerin doldurulması, defter değişmezliği; şema taşıma; oyunlu yedek ve sahte ödül reddi; ayar snapshot’ı; aynı-gün sezon ayrımı; simülatör belirleyiciliği/veri değişmezliği; geçmiş XP ve replay ölçekleme; cihaz tarihi geri alınırken kapanmış günün kilitli kalması.

İzole Chromium + gerçek IndexedDB ile kontrol edildi: **v0 DB1→DB2 yükseltmesi**, eski kayıtların aynen kalması, karakter/sezon başlangıcı, 360/390/430 px taşma kontrolü, tam cihaz pikseli ölçeği ve smoothing=false, bugün tik/düzenleme/snapshot, geçmiş tik ve silmenin veri katmanında reddi, 23:59→00:01 açık uygulama kapanışı, günlerce kapalı kalma simülasyonu, gerçek JSON indirme–silme–geri yükleme turu, geri alınabilir canlı zafer, kapatılmış ödül ve boss sırası, kılıç/kozmetik satın alma ve kuşanma, ayarın süren sezonu değiştirmemesi, 1000 sezon + gerçek geçmiş simülatörünün veriye yazmaması, çevrimdışı boss/eşya/font ve Güncelle akışında verinin korunması. Kabuk dışı uygulama ağ isteği görülmedi.

44 test İstanbul, Los Angeles ve Berlin saat dilimlerinde geçti. Ayrıca boş cihazda ilk alışkanlıktan önce sezon başlamaması, tikin yeniden açılışta kalması ve tüm ekranlarda DPR 2.625 için tam sayı backing-pixel ölçeği kontrol edildi. Paylaşım API’si bir test ikamesiyle kullanıcı dokunuşunun etkin olduğu anda çağrıldı; bu kontrol gerçek iOS paylaşım ekranını doğrulamaz. Formdaki kaydedilmemiş ayar/tohum/tutarlılık simülasyon sonrasında korunur. Cihaz tarihi geri alınırken kapanmış güne tik yazma veri katmanında reddedildi.

Tarayıcı QA geliştirme ortamının aracıyla yapılır; uygulamaya paket bağımlılığı eklemez. Geçici QA betikleri/ekran görüntüleri `.qa/` altında ve Git’te yok sayılır. iPhone 13 / Safari **gerçek cihazda henüz test edilmedi**.

## GitHub Pages ile yayınlama ve güncelleme

Depo: [runosc/kindleborn](https://github.com/runosc/kindleborn). Uygulama: [Kindleborn](https://runosc.github.io/kindleborn/).

Pages kaynağı **main / /(root)**, statik sunum için `.nojekyll` kullanılır. Uygulama yolları, manifest scope/start_url/id ve worker kaydı görelidir. Node veya sunucu uygulaması üretimde gerekmez.

Yeni sürümde `config.js VERSION` ve `sw.js VERSION` birlikte artırılır (şimdiki sürüm **1.1.1**). Değişiklikleri kontrol edip testleri çalıştırdıktan sonra:

```powershell
node tests.js
node tools/release-files.cjs --stage
git diff --cached --stat
git commit -m "Kindleborn güncellemesi"
git push origin main
```

Yayın listesi worker kabuğundan türetilir; yalnız uygulama, seçili hazır görseller, testler, dokümantasyon ve font lisansı eklenir. Ham kaynaklar, atlaslar, promptlar, önizlemeler, `tmp/`, `.qa/` ve JSON yedekleri yayına girmez. `git add .` kullanmaya gerek yoktur.

Yeni worker önce bütün kabuğu indirir, sonra **Yeni sürüm hazır → Güncelle** gösterir. Dokunulunca etkinleşir ve sayfa yenilenir; IndexedDB korunur. İnternet açıkken uygulamayı yeniden açmak veya öne getirmek güncelleme kontrolünü tetikler. Eski önbellek temizliği aynı scope ile sınırlıdır.

Ad değişikliği sunumla sınırlıdır: eski veriyi korumak için IndexedDB adı `rutin`, şema 2, dahili JavaScript adları ve worker önbellek öneki korunur. Localhost veya başka bir site adresindeki kayıtlar yeni Pages adresine kendiliğinden taşınmaz; gerekirse Ayarlar’dan JSON yedek alıp yeni adreste geri yükle.

## iPhone kabul kontrolü

1. Pages’i **Safari** ile aç → **Paylaş → Ana Ekrana Ekle → Ekle**. Safari’den çık, **Kindleborn ana ekran ikonundan** aç. İlk karakter, alışkanlık ve tikini bu ikondan oluştur. Safari sekmesi/ana ekran uygulaması bazı iOS sürümlerinde ayrı depolama kullanabilir; her zaman aynı yerden aç.
2. Adı yaz → aktif alışkanlık ekle → boss başlasın. Boss sprite’ı keskin, çubuklar ve alt menü safe-area içinde olsun. İlk tiki at, sarsılma/hasarı gör; geri al, boss canı eski hâline dönsün.
3. Uygulamayı kapat/aç; ad, alışkanlık ve tik kalsın. Alışkanlığın tür/zorluğunu değiştir; yedekte eski tik snapshot’ı değişmesin. Geçmişte gün düzenleme düğmesi bulunmasın. Tiki olan alışkanlık için kalıcı silme görünmesin; arşivleme korusun.
4. 23:59’da açık tut, 00:01’de gün defterini kontrol et; dünün tik/puanı sabit ve Bugün boş olsun. Aynısını uygulama arka plandayken ve birkaç gün açmadan deneyip eksik günlerin tek sefer yazıldığını kontrol et.
5. Bir sezon bitince ödül dökümünü kontrol et, **Sezonu kapat**; yeni boss tam canla başlasın. Aynı-gün eski tik kilitli olsun. Ödül ikinci kez alınamasın.
6. Altın yeterliyken kılıç/zırh satın al, kuşan; Ben ekranında slot ve etki görünsün. Bir kozmetik satın al/kuşan; oyun bonusu olmasın.
7. JSON indir ve paylaş seçeneklerini gerçek Dosyalar ekranında dene. Yedek al → bütün veriyi onayla sil → onayla geri yükle; bütün oyun/alışkanlık kayıtları dönsün. Geçersiz JSON mevcut veriye dokunmasın.
8. Ayarlar’da **çevrimdışı kabuk hazır** bilgisini gör → uçak modu → kapat/aç; boss, eşya ve yerel font açılsın. Tik at → kapat/aç; tik kalsın. Çevrimdışı simülatörü de dene.
9. Geliştirici ayarını değiştir; aktif sezon etkilenmesin. Simülatörü iki kez aynı tohumla çalıştır; aynı sonuç çıksın ve altın/tik/defter değişmesin.
10. Yeni sürüm yayınlandığında Güncelle’yi dene; bütün veriler korunsun. iOS dosya paylaşımı, arka plan/uyku davranışı ve kesirli-DPR fiziksel keskinlik gerçek cihazda doğrulanmış sayılmaz.

## Dosya düzeni

`derive.js`: v0 saf tarih/hafta hesapları. `game.js`: v1 saf oyun/defter/simülasyon hesapları. `config.js`: türler, sürüm ve denge sayıları. `content.js`: 3 boss / 10 eşyalı düz katalog. `data.js`: yedek doğrulama/taşıma. `store.js`: atomik IndexedDB işlemleri. `app.js`: akış ve etkileşim; `views.js`: ekranlar, hazır görsel kompozisyonu ve ortak ölçek. `simulator.js`: hesap worker’ı. `sw.js`: sürümlü çevrimdışı kabuk. `tests.js`: bağımlılıksız testler. `serve.js`: yalnız yerel önizleme. PNG ikonlar hazır kaynaklardan kopyalanmıştır. `tools/release-files.cjs` yalnız yayın dosyalarını seçer.
