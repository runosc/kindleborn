(function (root, factory) {
  const game = typeof module === 'object' && module.exports
    ? factory(require('./config.js'), require('./derive.js'), require('./content.js'))
    : factory(root.RutinConfig, root.RutinDerive, root.RutinContent);
  if (typeof module === 'object' && module.exports) module.exports = game;
  else root.RutinGame = game;
})(globalThis, function (C, D, content) {
  'use strict';
  const clone = value => JSON.parse(JSON.stringify(value));
  const CONFIG_RULES = Object.freeze({
    puanCarpani: [1, 100], sezonGunu: [1, 365], bossCanKatsayisi: [0.01, 10], zayifTurCarpani: [1, 5],
    gunlukVurus: [0, 200], rMin: [0, 5], rMax: [0, 5], iyilesmeOrani: [0, 5], haftalikIyilesmeTavani: [0, 1],
    zaferOlcegi: [0.1, 2], olumOlcegi: [0.1, 2], tabanCan: [1, 10000], dayaniklilikCan: [0, 100],
    mukemmelCan: [0, 100], odakCan: [0, 20], altinOdulu: [0, 10000], zaferXp: [0, 10000],
    olumAltinOrani: [0, 1], zekaAltin: [0, 1], zekaTavan: [0, 1], seviyeTaban: [1, 10000], seviyeArtis: [0, 10000]
  });
  function validateConfig(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(content.COPY.copy150);
    if (Object.keys(value).length !== Object.keys(C.GAME_CONFIG).length) throw new Error(content.COPY.copy151);
    const result = {};
    for (const [key, [min, max]] of Object.entries(CONFIG_RULES)) {
      if (!Number.isFinite(value[key]) || value[key] < min || value[key] > max) throw new Error(content.interpolate('game001', [key, min, max]));
      result[key] = value[key];
    }
    for (const key of ['kilicBonuslari', 'zirhBonuslari']) {
      if (!Array.isArray(value[key]) || value[key].length !== 3 || value[key].some(n => !Number.isFinite(n) || n < 0 || n >= 1)) throw new Error(content.interpolate('game002', [key]));
      result[key] = value[key].slice();
    }
    if (!Number.isInteger(result.sezonGunu) || result.rMin > result.rMax) throw new Error(content.COPY.copy152);
    return result;
  }
  function seeded(seed) {
    // FNV-1a seed, Mulberry32 output: fixed input gives identical [0,1) values.
    let value = 2166136261;
    for (const char of String(seed)) { value ^= char.charCodeAt(0); value = Math.imul(value, 16777619); }
    return () => {
      value = (value + 0x6D2B79F5) | 0;
      let n = Math.imul(value ^ value >>> 15, 1 | value);
      n ^= n + Math.imul(n ^ n >>> 7, 61 | n);
      return ((n ^ n >>> 14) >>> 0) / 4294967296;
    };
  }
  function dailyR(seed, date, config = C.GAME_CONFIG) { return config.rMin + seeded(`${seed}:${date}`)() * (config.rMax - config.rMin); }
  function dayStart(date) { const time = D.parseDate(date); time.setHours(0, 0, 0, 0); return time.getTime(); }
  function dayEnd(date) { return dayStart(D.addDays(date, 1)) - 1; }
  function dayNumber(start, date) {
    // Calendar components, rather than duration / 24h, preserve DST boundaries.
    let count = 1;
    for (let d = start; d < date; d = D.addDays(d, 1)) count++;
    return count;
  }
  function level(xp, config = C.GAME_CONFIG) {
    let seviye = 1, kalan = Math.max(0, xp), esik = config.seviyeTaban;
    if (config.seviyeArtis === 0) { seviye += Math.floor(kalan / esik); kalan %= esik; }
    else {
      // Solve the arithmetic series, then correct rounding at a threshold.
      const b = config.seviyeTaban - config.seviyeArtis / 2;
      let steps = Math.max(0, Math.floor((-b + Math.sqrt(b * b + 2 * config.seviyeArtis * kalan)) / config.seviyeArtis));
      const spent = n => n * config.seviyeTaban + config.seviyeArtis * n * (n - 1) / 2;
      while (spent(steps) > kalan) steps--;
      while (spent(steps + 1) <= kalan) steps++;
      kalan -= spent(steps); seviye += steps;
      esik += steps * config.seviyeArtis;
    }
    return { seviye, kalan, esik, yuzde: Math.min(100, Math.floor(kalan / esik * 100)) };
  }
  function levelTitle() { return null; }
  function tickPoints(tick, config = C.GAME_CONFIG) { return tick.snapshot.zorluk * config.puanCarpani; }
  function stats(state, date, config = C.GAME_CONFIG, cutoff = Infinity) {
    const typeXp = Object.fromEntries(C.TYPES.map(type => [type, 0]));
    let xp = 0;
    for (const tick of state.ticks) {
      if (tick.tarih > date || (tick.tarih === date && tick.ts > cutoff)) continue;
      const owner = (state.seasons || []).find(season => tick.tarih >= season.baslangic && tick.ts >= (season.baslangicTs || dayStart(season.baslangic)) && (!season.sonuc || tick.ts <= (season.sonuc.bitisTs || dayEnd(season.sonuc.bitisTarihi))));
      const points = tickPoints(tick, owner ? owner.ayar : C.GAME_CONFIG); xp += points;
      if (Object.hasOwn(typeXp, tick.snapshot.tur)) typeXp[tick.snapshot.tur] += points;
    }
    for (const season of state.seasons || []) {
      if (season.sonuc && season.sonuc.bitisTarihi <= date && (season.sonuc.bitisTs || 0) <= cutoff) xp += season.sonuc.xp;
    }
    return { xp, ...level(xp, config), turler: Object.fromEntries(C.TYPES.map(type => [type, { xp: typeXp[type], ...level(typeXp[type], config) }])) };
  }
  function maxHp(attributes, config) { return config.tabanCan + config.dayaniklilikCan * attributes.turler[content.COPY.copy153].seviye; }
  function potential(habits, date, config = C.GAME_CONFIG) {
    return habits.filter(habit => !habit.arsiv && habit.olusturma <= date).reduce((sum, habit) => sum + habit.zorluk * config.puanCarpani, 0);
  }
  function canTickToday(habit, date, today, gunler = []) { return D.isDate(date) && date === today && !habit.arsiv && habit.olusturma <= date && !gunler.some(day => day.tarih === date); }
  function canDeleteHabit(habitId, ticks) { return !ticks.some(tick => tick.habitId === habitId); }
  function slotFor(item) { return item.slot === 'kozmetik' ? item.kozmetikSlot : item.slot; }
  function equipmentAt(equips, cutoff) {
    const latest = {};
    for (const event of equips || []) {
      if (event.ts > cutoff) continue;
      const old = latest[event.slot];
      if (!old || event.ts > old.ts || (event.ts === old.ts && event.id > old.id)) latest[event.slot] = event;
    }
    return Object.fromEntries(Object.entries(latest).map(([slot, event]) => [slot, event.itemId === null ? undefined : content.ITEMS.find(item => item.id === event.itemId)]));
  }
  function gearBonus(item, slot, config) { return item ? config[slot === 'kilic' ? 'kilicBonuslari' : 'zirhBonuslari'][item.kademe - 1] || 0 : 0; }
  function damage(ticks, boss, sword, config) {
    return ticks.reduce((sum, tick) => sum + tickPoints(tick, config) * (tick.snapshot.tur === boss.zayifTur ? config.zayifTurCarpani : 1), 0) * (1 + gearBonus(sword, 'kilic', config));
  }
  function seasonTicks(state, season, date) {
    const cutoff = season.sonuc ? season.sonuc.bitisTs || dayEnd(season.sonuc.bitisTarihi) : Infinity;
    return state.ticks.filter(tick => tick.tarih >= season.baslangic && tick.tarih <= date && tick.ts >= (season.baslangicTs || dayStart(season.baslangic)) && tick.ts <= cutoff);
  }
  function makeDay(state, season, date) {
    const ticks = seasonTicks(state, season, date).filter(tick => tick.tarih === date);
    const config = season.ayar;
    const yapilan = ticks.reduce((sum, tick) => sum + tickPoints(tick, config), 0);
    const potansiyel = potential(state.habits, date, config);
    const eligible = state.habits.filter(habit => !habit.arsiv && habit.olusturma <= date);
    return { tarih: date, sezonId: season.id, potansiyel, yapilan, kacirilan: Math.max(0, potansiyel - yapilan), tikSayisi: ticks.length, mukemmel: potansiyel > 0 && eligible.every(habit => ticks.some(tick => tick.habitId === habit.id)) };
  }
  function victoriesBefore(state, season) { return (state.seasons || []).filter(s => s.sira < season.sira && s.sonuc && s.sonuc.durum === 'yenildi').length; }
  function reward(durum, victories, intelligence, config) {
    const base = config.altinOdulu * config.zaferOlcegi ** victories;
    const bonus = Math.min(config.zekaTavan, config.zekaAltin * intelligence);
    return { altin: Math.floor(base * (durum === 'yenildi' ? 1 + bonus : config.olumAltinOrani)), xp: durum === 'yenildi' ? config.zaferXp : 0, zekaBonus: durum === 'yenildi' ? bonus : 0 };
  }
  function createSeason(state, date, now, id, seed) {
    const config = validateConfig(state.settings.oyunAyar || C.GAME_CONFIG);
    const p0 = potential(state.habits, date, config);
    if (p0 <= 0 || !state.settings.karakterAdi) return null;
    const sorted = (state.seasons || []).slice().sort((a, b) => a.sira - b.sira);
    const previous = sorted.at(-1);
    if (previous && !previous.sonuc) throw new Error(content.COPY.copy154);
    const sira = previous ? previous.sira + 1 : 0;
    const victories = sorted.filter(s => s.sonuc && s.sonuc.durum === 'yenildi').length;
    const bossCan0 = config.bossCanKatsayisi * config.sezonGunu * p0 * config.zaferOlcegi ** victories * (previous && previous.sonuc.durum === 'oldu' ? config.olumOlcegi : 1);
    if (!Number.isFinite(bossCan0)) throw new Error(content.COPY.copy155);
    return { id, sira, bossId: content.BOSSES[sira % content.BOSSES.length].id, baslangic: date, baslangicTs: now, tohum: seed, p0, bossCan0, ayar: clone(config), sonuc: null };
  }
  function evaluateSeason(state, season, today, override) {
    const config = override || season.ayar;
    const boss = content.BOSSES.find(item => item.id === season.bossId);
    const rows = (state.gunler || []).filter(row => row.sezonId === season.id && row.tarih < today).slice().sort((a, b) => a.tarih.localeCompare(b.tarih));
    const byDay = new Map();
    seasonTicks(state, season, today).forEach(tick => {
      if (!byDay.has(tick.tarih)) byDay.set(tick.tarih, []);
      byDay.get(tick.tarih).push(tick);
    });
    let bossHp = season.bossCan0;
    let hp = maxHp(stats(state, season.baslangic, config, season.baslangicTs || dayStart(season.baslangic)), config);
    let previousEmpty = false;
    let result = null;
    const weeklyHeals = new Map();
    const curve = [];
    function process(row, closed) {
      const date = row.tarih;
      const ticks = byDay.get(date) || [];
      const attributes = stats(state, date, config);
      const maximum = maxHp(attributes, config);
      hp = Math.min(hp, maximum);
      const gear = equipmentAt(state.equips, Math.min(dayEnd(date), season.sonuc ? season.sonuc.bitisTs || dayEnd(season.sonuc.bitisTarihi) : Infinity));
      const dealt = damage(ticks, boss, gear.kilic, config);
      const beforeBoss = bossHp;
      bossHp = Math.max(0, bossHp - dealt);
      let healing = 0, hit = 0, recovery = 0;
      const skipped = closed && row.tikSayisi === 0 && previousEmpty;
      if (bossHp <= 0) result = { durum: 'yenildi', bitisTarihi: date, gun: dayNumber(season.baslangic, date), ...reward('yenildi', victoriesBefore(state, season), attributes.turler.Zeka.seviye, config) };
      else if (closed && !skipped) {
        const week = D.weekStart(date);
        const used = weeklyHeals.get(week) || 0;
        healing = Math.max(0, Math.min(config.iyilesmeOrani * row.kacirilan, season.bossCan0 * config.haftalikIyilesmeTavani - used, season.bossCan0 - bossHp));
        weeklyHeals.set(week, used + healing);
        bossHp += healing;
        hit = config.gunlukVurus * dailyR(season.tohum, date, config) * (1 - gearBonus(gear.zirh, 'zirh', config));
        hp -= hit;
        if (row.mukemmel) { recovery = Math.min(config.mukemmelCan + config.odakCan * attributes.turler.Odak.seviye, Math.max(0, maximum - hp)); hp += recovery; }
        if (hp <= 0) result = { durum: 'oldu', bitisTarihi: date, gun: dayNumber(season.baslangic, date), ...reward('oldu', victoriesBefore(state, season), attributes.turler.Zeka.seviye, config) };
      }
      curve.push({ tarih: date, gun: dayNumber(season.baslangic, date), boss: bossHp, can: Math.max(0, hp), azamiCan: maximum, hasar: dealt, gercekHasar: beforeBoss - Math.max(0, beforeBoss - dealt), iyilesme: healing, vurus: hit, canKazanci: recovery, atlandi: skipped, kapali: closed });
      if (closed) previousEmpty = row.tikSayisi === 0;
    }
    for (const row of rows) { process(row, true); if (result) break; }
    if (!result && !season.sonuc && today >= season.baslangic) process(makeDay(state, season, today), false);
    return { boss, bossHp, hp: Math.max(0, hp), maxHp: maxHp(stats(state, today, config), config), result, curve, gun: dayNumber(season.baslangic, today), weeklyHeals: Object.fromEntries(weeklyHeals) };
  }
  function pendingDays(state, today) {
    const season = (state.seasons || []).find(item => !item.sonuc);
    if (!season || season.baslangic >= today) return [];
    const existing = new Map((state.gunler || []).map(day => [day.tarih, day]));
    const candidates = [];
    for (let date = season.baslangic; date < today; date = D.addDays(date, 1)) {
      if (!existing.has(date)) candidates.push(makeDay(state, season, date));
    }
    const evaluation = evaluateSeason({ ...state, gunler: [...(state.gunler || []), ...candidates] }, season, today);
    return candidates.filter(row => !evaluation.result || row.tarih <= evaluation.result.bitisTarihi);
  }
  function balance(state) { return (state.seasons || []).reduce((sum, season) => sum + (season.sonuc ? season.sonuc.altin : 0), 0) - (state.purchases || []).reduce((sum, purchase) => sum + purchase.fiyat, 0); }
  function simulateSynthetic(config, consistency, count = 1000, seed = 'rutin-simulator', maxDays = 90) {
    config = validateConfig(config);
    if (!Number.isFinite(consistency) || consistency < 0 || consistency > 1 || !Number.isInteger(count) || count < 1 || count > 1000 || !Number.isInteger(maxDays) || maxDays < 1 || maxDays > 365) throw new Error(content.COPY.copy156);
    let wins = 0, deaths = 0, winDays = 0, deathDays = 0;
    for (let run = 0; run < count; run++) {
      const date = '2026-01-05';
      const habits = Array.from({ length: 5 }, (_, i) => ({ id: `h${i}`, ad: `h${i}`, tur: C.TYPES[i % 4], zorluk: 2, olusturma: date, arsiv: false, haftalikHedef: 7 }));
      const state = { habits, ticks: [], gunler: [], seasons: [], equips: [], purchases: [], settings: { karakterAdi: content.COPY.copy157, oyunAyar: config } };
      const season = createSeason(state, date, dayStart(date), 'sim', `${seed}:${run}`);
      state.seasons.push(season);
      const random = seeded(`${seed}:ticks:${run}`);
      for (let day = 0; day < maxDays; day++) {
        const current = D.addDays(date, day);
        for (const habit of habits) if (random() < consistency) state.ticks.push({ id: `${day}:${habit.id}`, habitId: habit.id, tarih: current, ts: dayStart(current) + 1000, snapshot: D.tickSnapshot(habit) });
        state.gunler.push(makeDay(state, season, current));
      }
      const result = evaluateSeason(state, season, D.addDays(date, maxDays)).result;
      if (result && result.durum === 'yenildi') { wins++; winDays += result.gun; }
      if (result && result.durum === 'oldu') { deaths++; deathDays += result.gun; }
    }
    return { count, wins, deaths, ongoing: count - wins - deaths, winRate: wins / count, averageWinDay: wins ? winDays / wins : null, averageDeathDay: deaths ? deathDays / deaths : null, maxDays, seed };
  }
  function replay(state, season, config, today) {
    config = validateConfig(config);
    const previous = state.seasons.filter(s => s.sira < season.sira).sort((a, b) => a.sira - b.sira).at(-1);
    const scaledP0 = season.p0 * config.puanCarpani / season.ayar.puanCarpani;
    const initial = config.bossCanKatsayisi * config.sezonGunu * scaledP0 * config.zaferOlcegi ** victoriesBefore(state, season) * (previous && previous.sonuc.durum === 'oldu' ? config.olumOlcegi : 1);
    const replaySeason = { ...season, ayar: config, p0: scaledP0, bossCan0: initial };
    // The immutable ledger remains the source of potential and perfect-day declarations.
    const gunler = state.gunler.map(row => {
      if (row.sezonId !== season.id) return row;
      const scale = config.puanCarpani / season.ayar.puanCarpani;
      return { ...row, potansiyel: row.potansiyel * scale, yapilan: row.yapilan * scale, kacirilan: row.kacirilan * scale };
    });
    const end = season.sonuc ? D.addDays(season.sonuc.bitisTarihi, 1) : today;
    const snapshot = clone(state);
    if (season.sonuc) {
      const cutoff = season.sonuc.bitisTs || dayEnd(season.sonuc.bitisTarihi);
      snapshot.ticks = snapshot.ticks.filter(tick => tick.tarih < season.sonuc.bitisTarihi || (tick.tarih === season.sonuc.bitisTarihi && tick.ts <= cutoff));
      snapshot.equips = snapshot.equips.filter(event => event.ts <= cutoff);
    }
    snapshot.seasons = snapshot.seasons.map(s => s.id === season.id ? replaySeason : s);
    if (season.sonuc && !gunler.some(row => row.sezonId === season.id && row.tarih === season.sonuc.bitisTarihi)) gunler.push(makeDay(snapshot, replaySeason, season.sonuc.bitisTarihi));
    return evaluateSeason({ ...snapshot, gunler }, replaySeason, end, config);
  }
  return Object.freeze({ CONFIG_RULES, validateConfig, seeded, dailyR, dayStart, dayEnd, dayNumber, level, levelTitle, tickPoints, stats, maxHp, potential, canTickToday, canDeleteHabit, slotFor, equipmentAt, gearBonus, damage, seasonTicks, makeDay, reward, createSeason, evaluateSeason, pendingDays, balance, simulateSynthetic, replay });
});
