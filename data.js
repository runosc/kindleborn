(function (root, factory) {
  const data = typeof module === 'object' && module.exports
    ? factory(require('./config.js'), require('./derive.js'), require('./game.js'), require('./content.js'))
    : factory(root.RutinConfig, root.RutinDerive, root.RutinGame, root.RutinContent);
  if (typeof module === 'object' && module.exports) module.exports = data;
  else root.RutinData = data;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (config, derive, game, content) {
  'use strict';
  const fail = message => { throw new Error(message); };
  const record = value => value && typeof value === 'object' && !Array.isArray(value);
  const id = value => typeof value === 'string' && value.length > 0 && value.length <= 100;
  const target = value => Number.isInteger(value) && value >= 1 && value <= 7;
  const difficulty = value => [1, 2, 3].includes(value);
  function validateBase(input, today) {
    if (!record(input) || !record(input.settings) || ![1, 2].includes(input.settings.schemaVersion)) fail(content.COPY.copy120);
    if (input.settings.schemaVersion === 1 && input.settings.karakterAdi !== null) fail(content.COPY.copy121);
    if (input.settings.karakterAdi !== null && (typeof input.settings.karakterAdi !== 'string' || !input.settings.karakterAdi.trim() || input.settings.karakterAdi.length > 24)) fail(content.COPY.copy122);
    if (!Array.isArray(input.habits) || !Array.isArray(input.ticks)) fail(content.COPY.copy123);
    if (input.habits.length > 10000 || input.ticks.length > 500000) fail(content.COPY.copy124);
    const habitIds = new Map();
    const tickIds = new Set();
    const days = new Set();
    const habits = input.habits.map(habit => {
      if (!record(habit) || !id(habit.id) || habitIds.has(habit.id)) fail(content.COPY.copy125);
      if (typeof habit.ad !== 'string' || !habit.ad.trim() || habit.ad.length > 80) fail(content.COPY.copy126);
      if (!config.TYPES.includes(habit.tur) || !difficulty(habit.zorluk) || !target(habit.haftalikHedef)) fail(content.COPY.copy127);
      if (!derive.isDate(habit.olusturma) || habit.olusturma > today || typeof habit.arsiv !== 'boolean') fail(content.COPY.copy128);
      const normalized = { id: habit.id, ad: habit.ad, tur: habit.tur, zorluk: habit.zorluk, haftalikHedef: habit.haftalikHedef, olusturma: habit.olusturma, arsiv: habit.arsiv };
      habitIds.set(habit.id, normalized);
      return normalized;
    });
    const ticks = input.ticks.map(tick => {
      if (!record(tick) || !id(tick.id) || tickIds.has(tick.id) || !habitIds.has(tick.habitId)) fail(content.COPY.copy129);
      if (!derive.isDate(tick.tarih) || tick.tarih > today || !Number.isSafeInteger(tick.ts) || tick.ts < 0) fail(content.COPY.copy130);
      const key = `${tick.habitId}\u0000${tick.tarih}`;
      if (days.has(key)) fail(content.COPY.copy131);
      const snapshot = tick.snapshot;
      // Historical types may outlive the current type list.
      if (!record(snapshot) || typeof snapshot.tur !== 'string' || !snapshot.tur.trim() || snapshot.tur.length > 80 || !difficulty(snapshot.zorluk) || !target(snapshot.haftalikHedef)) fail(content.COPY.copy132);
      tickIds.add(tick.id);
      days.add(key);
      return { id: tick.id, habitId: tick.habitId, tarih: tick.tarih, ts: tick.ts, snapshot: { tur: snapshot.tur, zorluk: snapshot.zorluk, haftalikHedef: snapshot.haftalikHedef } };
    });
    return { habits, ticks, settings: { schemaVersion: 2, karakterAdi: input.settings.karakterAdi, oyunAyar: game.validateConfig(input.settings.oyunAyar || config.GAME_CONFIG) } };
  }
  function validateBackup(input, today) {
    const state = validateBase(input, today);
    const extra = ['seasons', 'gunler', 'purchases', 'equips'];
    if (input.settings.schemaVersion === 1) {
      if (extra.some(key => input[key] && (!Array.isArray(input[key]) || input[key].length))) fail(content.COPY.copy133);
      return { ...state, seasons: [], gunler: [], purchases: [], equips: [] };
    }
    for (const key of extra) if (!Array.isArray(input[key]) || input[key].length > 50000) fail(content.interpolate('data001', [key]));
    const ids = new Set();
    const orders = new Set();
    const nonnegative = value => Number.isFinite(value) && value >= 0 && value <= Number.MAX_SAFE_INTEGER;
    const timestamp = value => Number.isSafeInteger(value) && value >= 0 && value <= game.dayEnd(today);
    state.seasons = input.seasons.map(season => {
      if (!record(season) || !id(season.id) || ids.has(season.id) || !Number.isInteger(season.sira) || season.sira < 0 || orders.has(season.sira)) fail(content.COPY.copy134);
      ids.add(season.id); orders.add(season.sira);
      if (!content.BOSSES.some(boss => boss.id === season.bossId) || !derive.isDate(season.baslangic) || season.baslangic < '2000-01-01' || season.baslangic > today || !id(season.tohum) || !nonnegative(season.p0) || season.p0 <= 0 || !nonnegative(season.bossCan0) || season.bossCan0 <= 0) fail(content.COPY.copy135);
      const result = { id: season.id, sira: season.sira, bossId: season.bossId, baslangic: season.baslangic, tohum: season.tohum, p0: season.p0, bossCan0: season.bossCan0, ayar: game.validateConfig(season.ayar), sonuc: null };
      if (season.baslangicTs !== undefined) {
        if (!timestamp(season.baslangicTs) || season.baslangicTs < game.dayStart(season.baslangic) || season.baslangicTs > game.dayEnd(season.baslangic)) fail(content.COPY.copy136);
        result.baslangicTs = season.baslangicTs;
      }
      if (season.sonuc !== null) {
        const end = season.sonuc;
        if (!record(end) || !['yenildi', 'oldu'].includes(end.durum) || !derive.isDate(end.bitisTarihi) || end.bitisTarihi < season.baslangic || end.bitisTarihi > today || !Number.isInteger(end.gun) || end.gun !== game.dayNumber(season.baslangic, end.bitisTarihi) || !Number.isSafeInteger(end.altin) || end.altin < 0 || !nonnegative(end.xp)) fail(content.COPY.copy137);
        result.sonuc = { durum: end.durum, bitisTarihi: end.bitisTarihi, gun: end.gun, altin: end.altin, xp: end.xp };
        if (end.bitisTs !== undefined) {
          if (!timestamp(end.bitisTs) || end.bitisTs < (result.baslangicTs || game.dayStart(season.baslangic)) || end.bitisTs > game.dayEnd(end.bitisTarihi)) fail(content.COPY.copy138);
          result.sonuc.bitisTs = end.bitisTs;
        }
      }
      return result;
    });
    const ordered = state.seasons.slice().sort((a, b) => a.sira - b.sira);
    if (ordered.length && !state.settings.karakterAdi) fail(content.COPY.copy139);
    ordered.forEach((season, index) => {
      if (season.sira !== index || season.bossId !== content.BOSSES[index % content.BOSSES.length].id || (!season.sonuc && index !== ordered.length - 1)) fail(content.COPY.copy140);
      const previous = ordered[index - 1];
      if (previous && (season.baslangic < previous.sonuc.bitisTarihi || (season.baslangicTs || game.dayStart(season.baslangic)) <= (previous.sonuc.bitisTs || game.dayEnd(previous.sonuc.bitisTarihi)))) fail(content.COPY.copy141);
      const victories = ordered.slice(0, index).filter(s => s.sonuc.durum === 'yenildi').length;
      const hp = season.ayar.bossCanKatsayisi * season.ayar.sezonGunu * season.p0 * season.ayar.zaferOlcegi ** victories * (previous && previous.sonuc.durum === 'oldu' ? season.ayar.olumOlcegi : 1);
      if (Math.abs(hp - season.bossCan0) > 1e-7 * Math.max(1, hp)) fail(content.COPY.copy142);
    });
    const dayIds = new Set();
    const seasons = new Map(state.seasons.map(season => [season.id, season]));
    state.gunler = input.gunler.map(row => {
      const season = record(row) && seasons.get(row.sezonId);
      if (!season || !derive.isDate(row.tarih) || row.tarih >= today || row.tarih < season.baslangic || (season.sonuc && row.tarih > season.sonuc.bitisTarihi) || dayIds.has(row.tarih)) fail(content.COPY.copy143);
      dayIds.add(row.tarih);
      if (![row.potansiyel, row.yapilan, row.kacirilan].every(nonnegative) || !Number.isInteger(row.tikSayisi) || row.tikSayisi < 0 || typeof row.mukemmel !== 'boolean') fail(content.COPY.copy144);
      const ticks = game.seasonTicks(state, season, row.tarih).filter(tick => tick.tarih === row.tarih);
      const points = ticks.reduce((sum, tick) => sum + game.tickPoints(tick, season.ayar), 0);
      if (row.tikSayisi !== ticks.length || Math.abs(row.yapilan - points) > 1e-7 || Math.abs(row.kacirilan - Math.max(0, row.potansiyel - points)) > 1e-7 || (row.mukemmel && (!row.potansiyel || !row.tikSayisi))) fail(content.COPY.copy145);
      return { tarih: row.tarih, sezonId: row.sezonId, potansiyel: row.potansiyel, yapilan: row.yapilan, kacirilan: row.kacirilan, tikSayisi: row.tikSayisi, mukemmel: row.mukemmel };
    });
    const purchaseIds = new Set(), bought = new Map();
    state.purchases = input.purchases.map(purchase => {
      const item = record(purchase) && content.ITEMS.find(item => item.id === purchase.itemId);
      if (!item || !id(purchase.id) || purchaseIds.has(purchase.id) || bought.has(item.id) || !timestamp(purchase.ts) || purchase.fiyat !== item.fiyat) fail(content.COPY.copy146);
      purchaseIds.add(purchase.id); bought.set(item.id, purchase);
      return { id: purchase.id, itemId: purchase.itemId, ts: purchase.ts, fiyat: purchase.fiyat };
    });
    const equipIds = new Set();
    state.equips = input.equips.map(event => {
      const item = record(event) && content.ITEMS.find(item => item.id === event.itemId);
      const removal = record(event) && event.itemId === null && Object.hasOwn(content.SLOTS, event.slot);
      if (!record(event) || !id(event.id) || equipIds.has(event.id) || !timestamp(event.ts) || (!removal && (!item || !bought.has(item.id) || event.ts < bought.get(item.id).ts || event.slot !== game.slotFor(item)))) fail(content.COPY.copy147);
      equipIds.add(event.id);
      return { id: event.id, slot: event.slot, itemId: event.itemId, ts: event.ts };
    });
    if (game.balance(state) < 0) fail(content.COPY.copy148);
    // Recompute each terminal outcome and reward; backups cannot invent rewards.
    for (const season of ordered.filter(s => s.sonuc)) {
      const end = season.sonuc;
      const ticks = state.ticks.filter(t => t.tarih < end.bitisTarihi || (t.tarih === end.bitisTarihi && t.ts <= (end.bitisTs || game.dayEnd(end.bitisTarihi))));
      const evaluationState = { ...state, ticks, equips: state.equips.filter(event => event.ts <= (end.bitisTs || game.dayEnd(end.bitisTarihi))), gunler: state.gunler.slice() };
      if (!evaluationState.gunler.some(row => row.sezonId === season.id && row.tarih === end.bitisTarihi)) evaluationState.gunler.push(game.makeDay(evaluationState, season, end.bitisTarihi));
      const calculated = game.evaluateSeason(evaluationState, { ...season, sonuc: null }, derive.addDays(end.bitisTarihi, 1)).result;
      if (!calculated || ['durum', 'bitisTarihi', 'gun', 'altin', 'xp'].some(key => calculated[key] !== end[key])) fail(content.COPY.copy149);
    }
    return state;
  }
  function makeBackup(state) {
    return JSON.stringify({ habits: state.habits, ticks: state.ticks, settings: state.settings, seasons: state.seasons || [], gunler: state.gunler || [], purchases: state.purchases || [], equips: state.equips || [] }, null, 2);
  }
  return Object.freeze({ validateBackup, makeBackup });
});
