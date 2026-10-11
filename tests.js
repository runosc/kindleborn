'use strict';
const assert = require('node:assert/strict');
const D = require('./derive.js');
const B = require('./data.js');
const C = require('./config.js');
const G = require('./game.js');
const content = require('./content.js');
let passed = 0;
function test(name, run) {
  run();
  passed++;
  console.log(`✓ ${name}`);
}
const habit = { id: 'h1', ad: 'Kitap oku', tur: 'Zeka', zorluk: 2, haftalikHedef: 3, olusturma: '2026-10-01', arsiv: false };
function tick(date, override = {}) {
  return { id: `t-${date}`, habitId: habit.id, tarih: date, ts: 123456789, snapshot: D.tickSnapshot(habit), ...override };
}
test('Yerel tarih biçimi; UTC dönüşümü yok', () => {
  assert.equal(D.localDate(new Date(2026, 9, 5, 0, 1)), '2026-10-05');
  assert.equal(D.localDate(new Date(2026, 9, 4, 23, 59)), '2026-10-04');
});
test('Pazar 23:59 ve Pazartesi 00:01 farklı haftalar', () => {
  const sunday = D.localDate(new Date(2026, 9, 4, 23, 59));
  const monday = D.localDate(new Date(2026, 9, 5, 0, 1));
  assert.equal(D.weekStart(sunday), '2026-09-28');
  assert.equal(D.weekStart(monday), '2026-10-05');
  assert.notEqual(D.weekStart(sunday), D.weekStart(monday));
});
test('Ay / yıl sınırı ve artık yıl', () => {
  assert.equal(D.addDays('2026-12-31', 1), '2027-01-01');
  assert.equal(D.addDays('2024-02-28', 1), '2024-02-29');
  assert.equal(D.addDays('2024-02-29', 1), '2024-03-01');
  assert.equal(D.weekStart('2027-01-01'), '2026-12-28');
  assert.equal(D.isDate('2026-02-29'), false);
  assert.equal(D.isDate('2026-13-01'), false);
  assert.equal(D.isDate('2026-10-05T00:00:00Z'), false);
});
test('Yaz saati sınırında gün hesabı 24 saat milisaniyesine bağlı değil', () => {
  assert.equal(D.addDays('2026-03-28', 1), '2026-03-29');
  assert.equal(D.addDays('2026-03-29', 1), '2026-03-30');
  assert.equal(D.addDays('2026-10-25', -1), '2026-10-24');
  assert.equal(D.weekStart('2026-03-29'), '2026-03-23');
});
test('Geçmiş günler açık, gelecek ve arşiv tikleri kapalı', () => {
  assert.equal(D.canTick(habit, '2026-09-01', '2026-10-10'), true);
  assert.equal(D.canTick(habit, '2026-10-10', '2026-10-10'), true);
  assert.equal(D.canTick(habit, '2026-10-11', '2026-10-10'), false);
  assert.equal(D.canTick({ ...habit, arsiv: true }, '2026-10-10', '2026-10-10'), false);
});
test('Tür, zorluk ve hedef değişince eski snapshot değişmez', () => {
  const mutableHabit = { ...habit };
  const oldTick = { ...tick('2026-10-05'), snapshot: D.tickSnapshot(mutableHabit) };
  const before = JSON.stringify(oldTick);
  mutableHabit.tur = 'Güç'; mutableHabit.zorluk = 3; mutableHabit.haftalikHedef = 7;
  assert.equal(JSON.stringify(oldTick), before);
  assert.deepEqual(oldTick.snapshot, { tur: 'Zeka', zorluk: 2, haftalikHedef: 3 });
  assert.deepEqual(D.tickSnapshot(mutableHabit), { tur: 'Güç', zorluk: 3, haftalikHedef: 7 });
});
test('Haftalık sayım komşu hafta ve diğer alışkanlığı dışlar', () => {
  const ticks = [tick('2026-10-04'), tick('2026-10-05'), tick('2026-10-07'), tick('2026-10-12'), tick('2026-10-06', { habitId: 'h2' })];
  const result = D.weekProgress(habit, ticks, '2026-10-10');
  assert.equal(result.count, 2);
  assert.equal(result.target, 3);
  assert.equal(result.percent, 67);
});
test('Haftalık hedef son tarihli tikten gelir; giriş sırası etkilemez', () => {
  const ticks = [tick('2026-10-09', { ts: 1, snapshot: { tur: 'Güç', zorluk: 3, haftalikHedef: 5 } }), tick('2026-10-05', { ts: 999 })];
  assert.equal(D.weekProgress({ ...habit, haftalikHedef: 7 }, ticks, '2026-10-10').target, 5);
  assert.equal(D.weekProgress(habit, [], '2026-10-10').target, 3);
});
test('Tamamlanma %100’de durur; fazla tikler saklanır', () => {
  const ticks = ['05', '06', '07', '08'].map(day => tick(`2026-10-${day}`));
  const result = D.weekProgress(habit, ticks, '2026-10-10');
  assert.equal(result.count, 4); assert.equal(result.percent, 100);
  assert.equal(D.weekProgress(habit, [ticks[0], ticks[0]], '2026-10-10').count, 1);
});
test('Son 8 hafta, devam eden hafta dahil; saf fonksiyon girdileri değiştirmez', () => {
  const habits = Object.freeze([Object.freeze({ ...habit, arsiv: true })]);
  const ticks = Object.freeze([Object.freeze(tick('2026-10-06'))]);
  const history = D.historyWeeks(habits, ticks, '2026-10-10');
  assert.equal(history.length, 8);
  assert.equal(history[0].start, '2026-10-05');
  assert.equal(history[7].start, '2026-08-17');
  assert.equal(history[0].habits[0].count, 1);
  assert.equal(history[7].habits[0].available, false);
});
test('Oluşturulmadan önceki güne eklenen tik geçmişte görünür', () => {
  const history = D.historyWeeks([habit], [tick('2026-09-01')], '2026-10-10');
  const row = history.find(week => week.start === '2026-08-31').habits[0];
  assert.equal(row.available, true); assert.equal(row.count, 1);
});
test('Günlük ilerleme, arşivler ve farklı tarihler', () => {
  assert.deepEqual(D.dayProgress([habit, { ...habit, id: 'h2', arsiv: true }], [tick('2026-10-10'), tick('2026-10-09')], '2026-10-10', '2026-10-10'), { done: 1, total: 1, percent: 100 });
  assert.deepEqual(D.dayProgress([], [], '2026-10-10', '2026-10-10'), { done: 0, total: 0, percent: 0 });
});
test('JSON yedeği, silme ve geri yükleme birebir turu', () => {
  const original = { habits: [habit], ticks: [tick('2026-10-05'), tick('2026-10-06')], settings: { schemaVersion: C.SCHEMA_VERSION, karakterAdi: null, oyunAyar: G.validateConfig(C.GAME_CONFIG) }, seasons: [], gunler: [], purchases: [], equips: [] };
  const json = B.makeBackup(original);
  let state = { habits: [], ticks: [], settings: { schemaVersion: 1, karakterAdi: null } };
  state = B.validateBackup(JSON.parse(json), '2026-10-10');
  assert.deepEqual(state, original);
  assert.equal(B.makeBackup(state), json);
});
test('Yedek doğrulama: yinelenen tik, bağlantısız tik, ileri gün, geçersiz şema', () => {
  const valid = { habits: [habit], ticks: [tick('2026-10-05')], settings: { schemaVersion: 1, karakterAdi: null } };
  assert.throws(() => B.validateBackup({ ...valid, ticks: [tick('2026-10-05'), tick('2026-10-05', { id: 'duplicate' })] }, '2026-10-10'), /aynı gün/);
  assert.throws(() => B.validateBackup({ ...valid, ticks: [tick('2026-10-05', { habitId: 'missing' })] }, '2026-10-10'), /bağlantısı/);
  assert.throws(() => B.validateBackup({ ...valid, ticks: [tick('2026-10-11')] }, '2026-10-10'), /tarihi/);
  assert.throws(() => B.validateBackup({ ...valid, settings: { schemaVersion: 99 } }, '2026-10-10'), /sürümü/);
  assert.throws(() => B.validateBackup({ ...valid, habits: [{ ...habit, haftalikHedef: 0 }] }, '2026-10-10'), /hedefi/);
});
test('Geri yüklenen snapshot, mevcut alışkanlıktan yeniden hesaplanmaz', () => {
  const original = { habits: [{ ...habit, tur: 'Güç', zorluk: 3, haftalikHedef: 7 }], ticks: [tick('2026-10-05')], settings: { schemaVersion: 1, karakterAdi: null } };
  const restored = B.validateBackup(JSON.parse(B.makeBackup(original)), '2026-10-10');
  assert.equal(restored.ticks[0].snapshot.zorluk, 2);
  assert.equal(restored.ticks[0].snapshot.haftalikHedef, 3);
});

function fixture(overrides = {}, start = '2026-10-05') {
  const config = G.validateConfig({ ...C.GAME_CONFIG, ...overrides });
  const state = { habits: [{ ...habit, olusturma: start, haftalikHedef: 7 }], ticks: [], seasons: [], gunler: [], purchases: [], equips: [], settings: { schemaVersion: 2, karakterAdi: 'Onur', oyunAyar: config } };
  const season = G.createSeason(state, start, G.dayStart(start), 'season-0', 'fixed-seed');
  state.seasons.push(season);
  return { state, season, config, start };
}
function gameTick(state, date, habitId = state.habits[0].id) {
  const item = state.habits.find(habit => habit.id === habitId);
  const result = { id: `${date}:${habitId}`, habitId, tarih: date, ts: G.dayStart(date) + 3600000, snapshot: { ...D.tickSnapshot(item), haftalikHedef: 7 } };
  state.ticks.push(result); return result;
}
function closeThrough(state, date) { state.gunler.push(...G.pendingDays(state, date)); }
test('Oyun belirleyici; tohumlu r her gün 0–2 aralığında', () => {
  const a = G.seeded('same'), b = G.seeded('same');
  for (let i = 0; i < 1000; i++) { assert.equal(a(), b()); const r = G.dailyR('same', String(i)); assert.ok(r >= 0 && r < 2); }
  const { state, season } = fixture(); gameTick(state, '2026-10-05');
  assert.deepEqual(G.evaluateSeason(state, season, '2026-10-05'), G.evaluateSeason(state, season, '2026-10-05'));
});
test('Seviye eğrisi 100, 150, 200; levelTitle henüz null', () => {
  assert.equal(G.level(99).seviye, 1); assert.equal(G.level(100).seviye, 2);
  assert.equal(G.level(249).seviye, 2); assert.equal(G.level(250).seviye, 3);
  assert.equal(G.level(450).seviye, 4); assert.equal(G.levelTitle(99), null);
});
test('Bugünkü tiki geri almak canlı boss hesabını birebir geri çevirir', () => {
  const { state, season } = fixture();
  const before = G.evaluateSeason(state, season, '2026-10-05');
  gameTick(state, '2026-10-05');
  assert.ok(G.evaluateSeason(state, season, '2026-10-05').bossHp < before.bossHp);
  state.ticks.pop(); assert.deepEqual(G.evaluateSeason(state, season, '2026-10-05'), before);
});
test('Geçmiş ve geleceğe tik yasak; tiki olan alışkanlık silinemez', () => {
  assert.equal(G.canTickToday(habit, '2026-10-09', '2026-10-10'), false);
  assert.equal(G.canTickToday(habit, '2026-10-11', '2026-10-10'), false);
  assert.equal(G.canTickToday(habit, '2026-10-10', '2026-10-10'), true);
  assert.equal(G.canDeleteHabit(habit.id, [tick('2026-10-01')]), false);
  assert.equal(G.canDeleteHabit(habit.id, []), true);
});
test('Zayıf tür 1.5x ve Çelik kılıç %15 hasar', () => {
  const config = C.GAME_CONFIG, boss = content.BOSSES[0];
  const ticks = [{ snapshot: { tur: 'Odak', zorluk: 2 } }];
  assert.equal(G.damage(ticks, boss, null, config), 30);
  assert.equal(G.damage(ticks, boss, content.ITEMS.find(item => item.id === 'kilic-3'), config), 34.5);
});
test('Zırh %15; mükemmel gün +5 +0.5×Odak', () => {
  const { state, season } = fixture({ gunlukVurus: 10, rMin: 1, rMax: 1 });
  gameTick(state, '2026-10-05');
  state.equips.push({ id: 'e1', slot: 'zirh', itemId: 'zirh-3', ts: G.dayStart('2026-10-05') });
  closeThrough(state, '2026-10-06');
  const day = G.evaluateSeason(state, season, '2026-10-06').curve[0];
  assert.equal(day.vurus, 8.5); assert.equal(day.canKazanci, 5.5); assert.equal(day.can, 102);
});
test('Ardışık boş günlerden yalnız ilki vuruş / iyileşme uygular', () => {
  const { state, season } = fixture({ gunlukVurus: 10, rMin: 1, rMax: 1 });
  closeThrough(state, '2026-10-08');
  const play = G.evaluateSeason(state, season, '2026-10-08');
  assert.equal(play.curve[0].vurus, 10);
  assert.equal(play.curve[1].vurus, 0); assert.equal(play.curve[1].atlandi, true);
  assert.equal(play.curve[2].iyilesme, 0); assert.equal(play.hp, 95);
});
test('Pazartesi–pazar iyileşme toplamı boss başlangıç canının %20’sini aşmaz', () => {
  const { state, config } = fixture({ bossCanKatsayisi: 0.1, gunlukVurus: 0 });
  state.habits = Array.from({ length: 5 }, (_, i) => ({ ...habit, id: `h${i}`, tur: 'Güç', olusturma: '2026-10-05', haftalikHedef: 7 }));
  state.seasons = [];
  state.seasons = [G.createSeason(state, '2026-10-05', G.dayStart('2026-10-05'), 'season-0', 'fixed')];
  for (let i = 0; i < 8; i++) gameTick(state, D.addDays('2026-10-05', i), 'h0');
  closeThrough(state, '2026-10-13');
  const play = G.evaluateSeason(state, state.seasons[0], '2026-10-13');
  assert.ok(play.weeklyHeals['2026-10-05'] <= state.seasons[0].bossCan0 * config.haftalikIyilesmeTavani + 1e-9);
  assert.equal(play.weeklyHeals['2026-10-05'], state.seasons[0].bossCan0 * config.haftalikIyilesmeTavani);
  assert.ok(play.weeklyHeals['2026-10-12'] > 0);
  assert.ok(play.bossHp <= state.seasons[0].bossCan0);
});
test('Aynı gün önce hasar: öldürücü vuruş olacakken boss yenilirse zafer', () => {
  const { state, season } = fixture({ bossCanKatsayisi: 0.01, gunlukVurus: 200, rMin: 1, rMax: 1 });
  gameTick(state, '2026-10-05'); closeThrough(state, '2026-10-06');
  const play = G.evaluateSeason(state, season, '2026-10-06');
  assert.equal(play.result.durum, 'yenildi'); assert.equal(play.curve[0].vurus, 0);
  const losing = fixture({ bossCanKatsayisi: 10, gunlukVurus: 200, rMin: 1, rMax: 1 });
  closeThrough(losing.state, '2026-10-06');
  assert.equal(G.evaluateSeason(losing.state, losing.season, '2026-10-06').result.durum, 'oldu');
});
test('Zeka altın bonusu %30 tavan; ölüm %25 altın, XP yok', () => {
  assert.equal(G.reward('yenildi', 0, 100, C.GAME_CONFIG).altin, 130);
  assert.equal(G.reward('yenildi', 0, 1, C.GAME_CONFIG).altin, 102);
  assert.equal(G.reward('oldu', 0, 100, C.GAME_CONFIG).altin, 25);
  assert.equal(G.reward('oldu', 0, 100, C.GAME_CONFIG).xp, 0);
});
test('Sezon başlamak için alışkanlık ve karakter gerekir', () => {
  const { state } = fixture(); state.seasons = []; state.habits = [];
  assert.equal(G.createSeason(state, '2026-10-05', G.dayStart('2026-10-05'), 's', 'seed'), null);
});
test('Gün defteri tek seferlik; 23:59 / 00:01 ve kapalı günleri doldurma', () => {
  const { state } = fixture();
  gameTick(state, '2026-10-05');
  assert.equal(G.pendingDays(state, D.localDate(new Date(2026, 9, 5, 23, 59))).length, 0);
  const first = G.pendingDays(state, D.localDate(new Date(2026, 9, 6, 0, 1)));
  assert.equal(first.length, 1); state.gunler.push(...first);
  const before = JSON.stringify(state.gunler[0]);
  state.habits[0].zorluk = 3;
  assert.equal(G.pendingDays(state, '2026-10-06').length, 0);
  assert.equal(JSON.stringify(state.gunler[0]), before);
  assert.equal(G.pendingDays(state, '2026-10-10').length, 4);
});
test('Kapanış düzenlemeden önce eski potansiyeli dondurur', () => {
  const { state } = fixture();
  const closing = G.pendingDays(state, '2026-10-06');
  state.gunler.push(...closing); state.habits[0].zorluk = 3;
  assert.equal(state.gunler[0].potansiyel, 20);
  assert.equal(G.makeDay(state, state.seasons[0], '2026-10-06').potansiyel, 30);
});
test('v0 şema 1 yedeği şema 2’ye geçer; alışkanlık/tik birebir kalır', () => {
  const old = { habits: [habit], ticks: [tick('2026-10-05')], settings: { schemaVersion: 1, karakterAdi: null } };
  const migrated = B.validateBackup(old, '2026-10-10');
  assert.equal(migrated.settings.schemaVersion, 2);
  assert.deepEqual(migrated.habits, old.habits); assert.deepEqual(migrated.ticks, old.ticks);
  assert.deepEqual(migrated.seasons, []);
});
test('v2 yedek turu; defter, referans ve sahte ödül doğrulaması', () => {
  const { state } = fixture(); gameTick(state, '2026-10-05'); closeThrough(state, '2026-10-07');
  assert.deepEqual(B.validateBackup(JSON.parse(B.makeBackup(state)), '2026-10-10'), state);
  const badDay = JSON.parse(B.makeBackup(state)); badDay.gunler[0].yapilan = 999;
  assert.throws(() => B.validateBackup(badDay, '2026-10-10'), /tiklerle tutarsız/);
  const badEquip = JSON.parse(B.makeBackup(state)); badEquip.equips.push({ id: 'bad', slot: 'kilic', itemId: 'kilic-1', ts: G.dayStart('2026-10-06') });
  assert.throws(() => B.validateBackup(badEquip, '2026-10-10'), /Kuşanma/);
});
test('Süren sezon ayarları, yeni ayar kaydedilince değişmez', () => {
  const { state, season } = fixture(); const before = JSON.stringify(season);
  state.settings.oyunAyar = G.validateConfig({ ...C.GAME_CONFIG, bossCanKatsayisi: 0.9 });
  assert.equal(JSON.stringify(season), before);
});
test('Aynı gün yeni sezonda eski tik yeniden hasar vermez', () => {
  const { state, season } = fixture(); const previous = gameTick(state, '2026-10-05');
  season.sonuc = { durum: 'yenildi', bitisTarihi: '2026-10-05', bitisTs: previous.ts, gun: 1, altin: 102, xp: 200 };
  const next = G.createSeason(state, '2026-10-05', previous.ts + 1, 'second', 'second');
  state.seasons.push(next);
  assert.equal(G.evaluateSeason(state, next, '2026-10-05').bossHp, next.bossCan0);
  assert.equal(next.bossId, 'kaydirma-canavari');
});
test('Kuşanma hesabı gün sonunu izler; sonraki günün eşyası geçmişi değiştirmez', () => {
  const events = [{ id: 'a', slot: 'kilic', itemId: 'kilic-1', ts: G.dayStart('2026-10-05') }, { id: 'b', slot: 'kilic', itemId: 'kilic-3', ts: G.dayStart('2026-10-06') }];
  assert.equal(G.equipmentAt(events, G.dayEnd('2026-10-05')).kilic.id, 'kilic-1');
});
test('Simülatör sabit tohumla tekrarlanabilir, gerçek replay kullanıcı verisine yazmaz', () => {
  const first = G.simulateSynthetic(C.GAME_CONFIG, 0.8, 12, 'test', 25);
  assert.deepEqual(G.simulateSynthetic(C.GAME_CONFIG, 0.8, 12, 'test', 25), first);
  const { state, season } = fixture(); gameTick(state, '2026-10-05'); closeThrough(state, '2026-10-07');
  const before = JSON.stringify(state); G.replay(state, season, C.GAME_CONFIG, '2026-10-10');
  assert.equal(JSON.stringify(state), before);
});
test('Denge girdileri negatif can / geçersiz aralık / eksik bonus kabul etmez', () => {
  assert.throws(() => G.validateConfig({ ...C.GAME_CONFIG, tabanCan: -1 }));
  assert.throws(() => G.validateConfig({ ...C.GAME_CONFIG, rMin: 3, rMax: 2 }));
  assert.throws(() => G.validateConfig({ ...C.GAME_CONFIG, kilicBonuslari: [0.1] }));
});
test('Oyunlu v2 yedek, gerçek zafer ve ödülü doğrular; sahte ödülü reddeder', () => {
  const { state, season } = fixture({ bossCanKatsayisi: 0.01 });
  const tick = gameTick(state, '2026-10-05');
  const result = G.evaluateSeason(state, season, '2026-10-05').result;
  season.sonuc = { durum: result.durum, bitisTarihi: result.bitisTarihi, gun: result.gun, altin: result.altin, xp: result.xp, bitisTs: tick.ts + 1 };
  assert.deepEqual(B.validateBackup(JSON.parse(B.makeBackup(state)), '2026-10-10'), state);
  const bad = JSON.parse(B.makeBackup(state)); bad.seasons[0].sonuc.altin = 999;
  assert.throws(() => B.validateBackup(bad, '2026-10-10'), /Sezon sonucu oyun hesabıyla/);
  const replay = G.replay(state, season, season.ayar, '2026-10-10');
  assert.equal(replay.result.durum, 'yenildi'); assert.equal(replay.curve.length, 1);
});
test('Yeni puan çarpanı geçmiş tik XP’sini değiştirmez; replay P0’ı da ölçekler', () => {
  const { state, season } = fixture(); gameTick(state, '2026-10-05');
  const nextConfig = G.validateConfig({ ...C.GAME_CONFIG, puanCarpani: 20 });
  assert.equal(G.stats(state, '2026-10-05', nextConfig).xp, 20);
  const replay = G.replay(state, season, nextConfig, '2026-10-05');
  assert.equal(replay.curve[0].hasar, 40);
  assert.equal(replay.bossHp, 2 * season.bossCan0 - 40);
});
test('Cihaz tarihi geri alınsa da deftere kapanmış gün yeniden tik alamaz', () => {
  const { state } = fixture();
  const day = { tarih: '2026-10-05', sezonId: 's', potansiyel: 20, yapilan: 0, kacirilan: 20, tikSayisi: 0, mukemmel: false };
  assert.equal(G.canTickToday(state.habits[0], day.tarih, day.tarih, [day]), false);
  assert.equal(G.canTickToday(state.habits[0], '2026-10-06', '2026-10-06', [day]), true);
});
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const shellContext = { self: { registration: { scope: 'https://rutin.test/app/' }, addEventListener() {} }, URL };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'sw.js'), 'utf8') + '\nglobalThis.testShell = SHELL; globalThis.testVersion = VERSION;', shellContext);
const shell = Array.from(shellContext.testShell);
const flattenAssets = value => typeof value === 'string' ? [value] : Object.values(value).flatMap(flattenAssets);
const assetPaths = flattenAssets(content.ASSETS);
function pngSize(file) {
  const bytes = fs.readFileSync(path.join(__dirname, file));
  assert.equal(bytes.subarray(0,8).toString('hex'), '89504e470d0a1a0a', file);
  assert.equal(bytes.toString('ascii',12,16), 'IHDR', file);
  return [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];
}
test('1.2.0 kabuk ve config sürümü eşleşir; veri şeması 2 kalır', () => {
  assert.equal(C.VERSION, '1.2.0'); assert.equal(shellContext.testVersion, C.VERSION); assert.equal(C.SCHEMA_VERSION, 2);
});
test('ASSETS, boss/eşya kataloğu ve SHELL dosyaları var ve çevrimdışı kabukta', () => {
  const sprites = [...assetPaths, ...content.BOSSES.flatMap(b => [b.sprite,b.arkaplan,b.portre]), ...content.ITEMS.map(i=>i.sprite)];
  for (const file of [...shell, ...sprites]) assert.ok(fs.existsSync(path.join(__dirname,file)), file);
  for (const file of sprites) assert.ok(shell.includes(file), `SHELL eksik: ${file}`);
  assert.equal(new Set(shell).size, shell.length);
});
test('PNG IHDR: boss, karakter, eşya, arka plan, tür/menü, ödül ve portre boyutları', () => {
  const check = (paths, expected) => paths.forEach(file => assert.deepEqual(pngSize(file), expected, file));
  check(content.BOSSES.map(b=>b.sprite),[96,96]); check(content.ITEMS.map(i=>i.sprite),[24,24]);
  check([content.ASSETS.character],[64,96]); check(Object.values(content.ASSETS.types),[16,16]);
  check(Object.values(content.ASSETS.menu),[16,16]); check(Object.values(content.ASSETS.backgrounds),[120,270]);
  check(Object.values(content.ASSETS.portraits),[24,24]); check(Object.values(content.ASSETS.rewards),[24,24]);
  for (const file of assetPaths) assert.deepEqual(pngSize(file),content.ART_SIZES[file],file);
});
test('UI kiti IHDR: dilimler, küçük simgeler ve her efekt karesi', () => {
  const ui = JSON.parse(fs.readFileSync(path.join(__dirname,'assets/ui/ui_kiti_v01.json'),'utf8')).varliklar;
  for (const [name, meta] of Object.entries(ui)) assert.deepEqual(pngSize(`./assets/ui/hazir/${name}.png`),meta.boyut,name);
  for (const key of ['ikon_kalp_v01','ikon_altin_v01','ikon_xp_v01','ikon_kilit_v01','ikon_onay_v01']) assert.deepEqual(pngSize(content.ASSETS.ui[key]),[8,8]);
  assert.deepEqual(pngSize(content.ASSETS.ui.ikon_kafatasi_v01),[16,16]);
  for (const [key,size] of Object.entries({hit:24,heal:16,hurt:32,death:48,confetti:48})) content.ASSETS.effects[key].forEach(file=>assert.deepEqual(pngSize(file),[size,size]));
});
test('Kabuk ve ASSETS yalnız seçili hazır görselleri kullanır', () => {
  const banned = /_x6|zemin_kontrol|\/ham\/|atlas|prompt|\/tmp\/|\/\.qa\/|karakter_ana_v01|karakter_ana_v02(?:\.png|_128x192)/i;
  for (const file of [...shell,...assetPaths]) {
    assert.ok(!banned.test(file),file);
    if (file.startsWith('./assets/') && file.endsWith('.png')) assert.ok(file.includes('/hazir/'),file);
  }
});
test('Uygulama ikonları hazır kaynağın birebir kopyasıdır', () => {
  for (const [target,source,size] of [['icon-192.png','icon-192.png',192],['icon-512.png','icon-512.png',512],['apple-touch-icon.png','apple-touch-icon-180.png',180]]) {
    assert.deepEqual(fs.readFileSync(path.join(__dirname,'icons',target)),fs.readFileSync(path.join(__dirname,'assets/uygulama_ikonu/hazir',source)));
    assert.deepEqual(pngSize(`icons/${target}`),[size,size]);
  }
  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'manifest.webmanifest'), 'utf8'));
  for (const icon of manifest.icons) {
    assert.ok(shell.includes(icon.src), icon.src);
    assert.equal(pngSize(icon.src).join('x'), icon.sizes);
  }
  assert.ok(manifest.icons.every(icon => icon.purpose !== 'maskable'));
});

test('Kart şablonu eş pip üretir; dolu pip sayısı zorluktur, nokta glyph’i yoktur', () => {
  const vm = require('node:vm');
  const context = vm.createContext({ RutinConfig: C, RutinDerive: D, RutinGame: G, RutinContent: content, addEventListener() {} });
  vm.runInContext(fs.readFileSync(path.join(__dirname, 'views.js'), 'utf8'), context);
  const state = { habits: [], ticks: [], seasons: [], gunler: [], settings: { karakterAdi: 'Onur' } };
  for (const zorluk of [1, 2, 3]) {
    state.habits = [{ ...habit, zorluk }];
    for (const render of [context.RutinViews.todayPage, context.RutinViews.bossPage]) {
      // Boss renders the shared compact template once a real season exists.
      state.settings.oyunAyar = G.validateConfig(C.GAME_CONFIG);
      state.seasons = [];
      state.seasons = [G.createSeason(state, '2026-10-11', G.dayStart('2026-10-11'), 'pip-season', 'pip-seed')];
      const html = render(state, '2026-10-11');
      assert.ok(!/[●○]/.test(html));
      assert.equal((html.match(/class="difficulty-pip(?: is-filled)?"/g) || []).length, 3);
      assert.equal((html.match(/class="difficulty-pip is-filled"/g) || []).length, zorluk);
      assert.ok(html.includes(`aria-label="${C.DIFFICULTIES[zorluk]}"`));
      assert.equal((html.match(/class="difficulty-pip[^"\n]*" aria-hidden="true"/g) || []).length, 3);
    }
    state.seasons = [];
  }
});

test('main odak çerçevesi kapalı; erişilebilir gezinme ve altın odak halkası korunur', () => {
  const css = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8');
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const app = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
  assert.match(css, /main:focus\s*,\s*main:focus-visible\s*\{\s*outline:\s*none\s*;/);
  assert.match(css, /html\s*\{\s*-webkit-tap-highlight-color:\s*transparent\s*;/);
  assert.match(css, /button:focus-visible, input:focus-visible, select:focus-visible, summary:focus-visible\s*\{\s*outline:\s*2px solid var\(--accent\)/);
  assert.match(html, /<main[^>]*tabindex="-1"/);
  assert.match(app, /main\.focus\(/);
});

test('Çıkarma olayı slotu boşaltır, bonus sıfır; geçmiş günün ekipmanı korunur', () => {
  const day = '2026-10-06';
  const events = [{ id:'w', slot:'kilic', itemId:'kilic-3', ts:G.dayStart('2026-10-05') }, { id:'off', slot:'kilic', itemId:null, ts:G.dayStart(day) }];
  assert.equal(G.equipmentAt(events,G.dayEnd('2026-10-05')).kilic.id,'kilic-3');
  assert.equal(G.equipmentAt(events,G.dayEnd(day)).kilic,undefined);
  assert.equal(G.gearBonus(G.equipmentAt(events,G.dayEnd(day)).kilic,'kilic',C.GAME_CONFIG),0);
});
test('Null itemId yedeği ve eski kuşanma yedeği yüklenir; geçersiz slot/id reddedilir', () => {
  const { state, season } = fixture({bossCanKatsayisi:0.01});
  const t = gameTick(state,'2026-10-05'), result=G.evaluateSeason(state,season,'2026-10-05').result;
  season.sonuc={durum:result.durum,bitisTarihi:result.bitisTarihi,gun:result.gun,altin:result.altin,xp:result.xp,bitisTs:t.ts+1};
  const ts=G.dayStart('2026-10-06');
  state.purchases.push({id:'p',itemId:'kilic-1',ts,fiyat:50});
  state.equips.push({id:'e',slot:'kilic',itemId:'kilic-1',ts:ts+1});
  assert.deepEqual(B.validateBackup(JSON.parse(B.makeBackup(state)),'2026-10-10'),state);
  state.equips.push({id:'off',slot:'kilic',itemId:null,ts:ts+2});
  assert.deepEqual(B.validateBackup(JSON.parse(B.makeBackup(state)),'2026-10-10'),state);
  for(const patch of [{slot:'unknown'},{itemId:'unknown'},{itemId:undefined},{ts:-1},{id:'e'}]){
    const bad=JSON.parse(B.makeBackup(state));Object.assign(bad.equips.at(-1),patch);
    assert.throws(()=>B.validateBackup(bad,'2026-10-10'),/Kuşanma/);
  }
});

test('Seri: ardışık, bugün boş, kaçırılan gün, en uzun ve yeni alışkanlık', () => {
  const h={...habit,olusturma:'2026-10-01'};
  const ticks=['2026-10-01','2026-10-02','2026-10-03','2026-10-05','2026-10-06'].map(date=>tick(date));
  const before=JSON.stringify({h,ticks});
  assert.deepEqual(D.streak(h,ticks,'2026-10-06'),{current:2,best:3});
  assert.deepEqual(D.streak(h,ticks,'2026-10-07'),{current:2,best:3});
  assert.deepEqual(D.streak(h,ticks,'2026-10-08'),{current:0,best:3});
  assert.deepEqual(D.streak({...h,olusturma:'2026-10-06'},ticks,'2026-10-06'),{current:1,best:1});
  assert.deepEqual(D.streak({...h,olusturma:'2026-10-07'},ticks,'2026-10-07'),{current:0,best:0});
  assert.deepEqual(D.streak(h,[...ticks,tick('2026-10-06'),tick('2026-10-07',{habitId:'other'}),tick('2026-10-20')],'2026-10-06'),{current:2,best:3});
  assert.equal(JSON.stringify({h,ticks}),before);
});
test('Seri ay/yıl ve artık gün sınırlarında yerel takvimle sayılır', () => {
  const h={...habit,olusturma:'2024-02-28'};
  assert.deepEqual(D.streak(h,['2024-02-28','2024-02-29','2024-03-01'].map(date=>tick(date)),'2024-03-01'),{current:3,best:3});
  assert.deepEqual(D.streak({...h,olusturma:'2026-12-31'},['2026-12-31','2027-01-01'].map(date=>tick(date)),'2027-01-02'),{current:2,best:2});
});
test('Takvim seviyeleri: tüm yüzde sınırları ve alışkanlıksız gün', () => {
  for(const [percent,level] of [[0,0],[1,1],[33,1],[34,2],[66,2],[67,3],[99,3],[100,4]]) assert.equal(D.calendarLevel(percent),level);
  assert.equal(D.calendarLevel(100,0),0);
});
test('Geçmiş: 15 hafta, gelecek yok, arşiv seri listesine girmez ve mevsim defteri korunur', () => {
  const context=vm.createContext({RutinConfig:C,RutinDerive:D,RutinGame:G,RutinContent:content,addEventListener(){}});
  vm.runInContext(fs.readFileSync(path.join(__dirname,'views.js'),'utf8'),context);
  const {state}=fixture();state.habits.push({...habit,id:'archived',ad:'Arşiv gizli',arsiv:true});
  const html=context.RutinViews.historyPage(state,'2026-10-11');
  assert.equal((html.match(/class="calendar-cell"/g)||[]).length,105);
  assert.ok(!html.includes('2026-10-12'));assert.ok(!html.includes('Arşiv gizli'));
  assert.ok(html.includes(content.TEXT.seasons));
  const monday=context.RutinViews.historyPage(state,'2026-10-12');
  assert.equal((monday.match(/class="calendar-cell"/g)||[]).length,99);
  assert.ok(!monday.includes('data-date="2026-10-13"'));
});

async function storeCommandTests() {
  // Exercise the actual store callbacks; only the IndexedDB transaction is replaced.
  const state={equips:[{id:'e',slot:'kilic',itemId:'kilic-3',ts:G.dayStart('2026-10-06')}]};
  const context=vm.createContext({RutinConfig:C,RutinDerive:D,RutinGame:G,RutinContent:content,testState:state,crypto:require('node:crypto').webcrypto});
  let source=fs.readFileSync(path.join(__dirname,'store.js'),'utf8');
  source=source.replace('  root.RutinStore =', '  command = async (action,today,now) => action(root.testState,today,now);\n  root.RutinStore =');
  vm.runInContext(source,context);
  assert.equal(await context.RutinStore.unequip('kilic','2026-10-06',G.dayStart('2026-10-06')),true);
  assert.equal(state.equips.at(-1).ts,state.equips[0].ts+1);
  assert.equal(state.equips.at(-1).itemId,null);
  const count=state.equips.length;
  assert.equal(await context.RutinStore.unequip('kilic','2026-10-06',G.dayStart('2026-10-06')),false);
  assert.equal(state.equips.length,count);
  await assert.rejects(context.RutinStore.unequip('invalid','2026-10-06',G.dayStart('2026-10-06')));
  passed++;console.log('✓ store.unequip: monotonik olay, boş slot yoksayılır, geçersiz slot reddedilir');
}
storeCommandTests().then(()=>console.log(`\n${passed} test geçti. Saat dilimi: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`)).catch(error=>{console.error(error);process.exitCode=1;});
