(function (root) {
  'use strict';
  const C = root.RutinConfig, D = root.RutinDerive, G = root.RutinGame, content = root.RutinContent;
  const names = ['habits', 'ticks', 'seasons', 'gunler', 'purchases', 'equips'];
  const allStores = [...names, 'settings'];
  let db;
  function request(req) {
    return new Promise((resolve, reject) => { req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error); });
  }
  function complete(tx) {
    return new Promise((resolve, reject) => { tx.oncomplete = resolve; tx.onabort = () => reject(tx.error || new Error('Kayıt tamamlanamadı.')); tx.onerror = () => {}; });
  }
  function uid() {
    if (crypto.randomUUID) return crypto.randomUUID();
    return Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, '0')).join('');
  }
  function defaultSettings(old) { return { schemaVersion: 2, karakterAdi: old && old.karakterAdi || null, oyunAyar: G.validateConfig(old && old.oyunAyar || C.GAME_CONFIG) }; }
  async function open() {
    const req = indexedDB.open('rutin', 2);
    req.onupgradeneeded = event => {
      const database = req.result;
      if (event.oldVersion < 1) {
        database.createObjectStore('habits', { keyPath: 'id' });
        const ticks = database.createObjectStore('ticks', { keyPath: 'id' });
        ticks.createIndex('habitDay', ['habitId', 'tarih'], { unique: true });
        ticks.createIndex('habitId', 'habitId');
        database.createObjectStore('settings');
      }
      if (event.oldVersion < 2) {
        database.createObjectStore('seasons', { keyPath: 'id' }).createIndex('sira', 'sira', { unique: true });
        database.createObjectStore('gunler', { keyPath: 'tarih' });
        database.createObjectStore('purchases', { keyPath: 'id' }).createIndex('itemId', 'itemId', { unique: true });
        database.createObjectStore('equips', { keyPath: 'id' });
        const settings = req.transaction.objectStore('settings');
        const read = settings.get('main');
        read.onsuccess = () => { if (read.result) settings.put(defaultSettings(read.result), 'main'); };
      }
    };
    req.onblocked = () => root.dispatchEvent(new Event('rutin-db-blocked'));
    db = await request(req);
    db.onversionchange = () => { db.close(); root.dispatchEvent(new Event('rutin-db-blocked')); };
    const tx = db.transaction('settings', 'readonly');
    const [settings] = await Promise.all([request(tx.objectStore('settings').get('main')), complete(tx)]);
    return { firstRun: !settings };
  }
  async function ensureSettings() {
    const tx = db.transaction('settings', 'readwrite');
    const done = complete(tx), store = tx.objectStore('settings'), read = store.get('main');
    read.onsuccess = () => { if (!read.result) store.put(defaultSettings(), 'main'); };
    await done;
  }
  async function readAll() {
    const tx = db.transaction(allStores, 'readonly');
    const result = await Promise.all([...names.map(name => request(tx.objectStore(name).getAll())), request(tx.objectStore('settings').get('main')), complete(tx)]);
    return { ...Object.fromEntries(names.map((name, index) => [name, result[index]])), settings: result[names.length] };
  }
  function startIfReady(state, today, now) {
    if (state.seasons.some(season => !season.sonuc)) return;
    const previous = state.seasons.slice().sort((a, b) => a.sira - b.sira).at(-1);
    const stamp = Math.max(now, previous && previous.sonuc.bitisTs + 1 || now);
    const id = uid();
    const season = G.createSeason(state, today, stamp, id, id);
    if (season) state.seasons.push(season);
  }
  // Day closure and the requested action share one serializable transaction.
  async function command(action, today = D.localDate(new Date()), now = Date.now()) {
    const tx = db.transaction(allStores, 'readwrite');
    const done = complete(tx);
    const state = {}, before = {};
    let remaining = allStores.length, failure, result;
    for (const name of allStores) {
      const store = tx.objectStore(name);
      const req = name === 'settings' ? store.get('main') : store.getAll();
      req.onsuccess = () => {
        state[name] = req.result;
        if (--remaining) return;
        try {
          state.settings = state.settings || defaultSettings();
          for (const key of names) before[key] = new Map(state[key].map(record => [key === 'gunler' ? record.tarih : record.id, JSON.stringify(record)]));
          const oldSettings = JSON.stringify(state.settings);
          state.gunler.push(...G.pendingDays(state, today));
          result = action ? action(state, today, now) : undefined;
          startIfReady(state, today, now);
          for (const key of names) {
            const records = new Map(state[key].map(record => [key === 'gunler' ? record.tarih : record.id, record]));
            const store = tx.objectStore(key);
            for (const id of before[key].keys()) if (!records.has(id)) store.delete(id);
            for (const [id, record] of records) {
              if (before[key].get(id) === JSON.stringify(record)) continue;
              if (key === 'gunler') {
                if (before[key].has(id)) throw new Error('Kapanmış gün değiştirilemez.');
                store.add(record);
              } else store.put(record);
            }
          }
          if (oldSettings !== JSON.stringify(state.settings)) tx.objectStore('settings').put(state.settings, 'main');
        } catch (error) { failure = error; tx.abort(); }
      };
    }
    try { await done; } catch (error) { throw failure || error; }
    return result;
  }
  async function sync(today, now) { await command(null, today, now); return readAll(); }
  async function saveHabit(habit, today, now) {
    return command((state, current) => {
      const old = state.habits.find(item => item.id === habit.id);
      if (old && old.olusturma !== habit.olusturma) throw new Error('Oluşturulma tarihi değiştirilemez.');
      const validated = { ...habit, haftalikHedef: 7 };
      if (typeof validated.ad !== 'string' || !validated.ad.trim() || validated.ad.length > 80 || !C.TYPES.includes(validated.tur) || ![1, 2, 3].includes(validated.zorluk) || !D.isDate(validated.olusturma) || validated.olusturma > current || typeof validated.arsiv !== 'boolean' || typeof validated.id !== 'string' || !validated.id) throw new Error('Alışkanlık bilgileri geçersiz.');
      if (old) state.habits[state.habits.indexOf(old)] = validated;
      else state.habits.push(validated);
    }, today, now);
  }
  async function toggleTick(habitId, date, today, now) {
    return command((state, current, stamp) => {
      const habit = state.habits.find(item => item.id === habitId);
      if (!habit || !G.canTickToday(habit, date, current, state.gunler)) throw new Error('Tik yalnız kapanmamış bugün için değiştirilebilir.');
      const existing = state.ticks.find(tick => tick.habitId === habitId && tick.tarih === date);
      const season = state.seasons.find(item => !item.sonuc);
      if (!season) throw new Error('Önce karakterini oluştur ve bir alışkanlık ekle.');
      if (existing && existing.ts < (season.baslangicTs || G.dayStart(season.baslangic))) throw new Error('Bu tik önceki sezona ait; kapanmış sezon değiştirilemez.');
      const result = G.evaluateSeason(state, season, current).result;
      if (result && result.bitisTarihi < current) throw new Error('Önce tamamlanan sezonu kapat.');
      if (existing) { state.ticks.splice(state.ticks.indexOf(existing), 1); return false; }
      state.ticks.push({ id: uid(), habitId, tarih: date, ts: Math.max(stamp, season.baslangicTs || 0), snapshot: { tur: habit.tur, zorluk: habit.zorluk, haftalikHedef: 7 } });
      return true;
    }, today, now);
  }
  async function deleteHabit(id, today, now) {
    return command(state => {
      if (!G.canDeleteHabit(id, state.ticks)) throw new Error('Tiki olan alışkanlık silinemez. Arşivleyebilirsin.');
      state.habits = state.habits.filter(habit => habit.id !== id);
    }, today, now);
  }
  async function saveSettings(patch, today, now) {
    return command(state => {
      if (patch.karakterAdi !== undefined) {
        const name = patch.karakterAdi.trim();
        if (!name || name.length > 24) throw new Error('Karakter adı 1–24 karakter olmalı.');
        state.settings.karakterAdi = name;
      }
      if (patch.oyunAyar) state.settings.oyunAyar = G.validateConfig(patch.oyunAyar);
    }, today, now);
  }
  async function closeSeason(today, now) {
    return command((state, date, stamp) => {
      const season = state.seasons.find(item => !item.sonuc);
      if (!season) throw new Error('Aktif sezon bulunamadı.');
      const result = G.evaluateSeason(state, season, date).result;
      if (!result) throw new Error('Sezon henüz bitmedi.');
      season.sonuc = { durum: result.durum, bitisTarihi: result.bitisTarihi, gun: result.gun, altin: result.altin, xp: result.xp, bitisTs: result.bitisTarihi === date ? stamp : G.dayEnd(result.bitisTarihi) };
    }, today, now);
  }
  async function purchase(itemId, today, now) {
    return command((state, date, stamp) => {
      const item = content.ITEMS.find(item => item.id === itemId);
      if (!item || state.purchases.some(purchase => purchase.itemId === itemId)) throw new Error('Bu eşya zaten sende veya bulunamadı.');
      if (G.balance(state) < item.fiyat) throw new Error('Altının bu eşya için yeterli değil.');
      state.purchases.push({ id: uid(), itemId, ts: stamp, fiyat: item.fiyat });
    }, today, now);
  }
  async function equip(itemId, today, now) {
    return command((state, date, stamp) => {
      const item = content.ITEMS.find(item => item.id === itemId);
      if (!item || !state.purchases.some(purchase => purchase.itemId === itemId)) throw new Error('Önce bu eşyayı satın al.');
      const ts = Math.max(stamp, ...state.equips.map(event => event.ts + 1));
      state.equips.push({ id: uid(), itemId, slot: G.slotFor(item), ts });
    }, today, now);
  }
  async function replaceAll(data) {
    const tx = db.transaction(allStores, 'readwrite');
    const done = complete(tx);
    for (const name of names) { const store = tx.objectStore(name); store.clear(); data[name].forEach(record => store.add(record)); }
    const settings = tx.objectStore('settings'); settings.clear(); settings.put(data.settings, 'main');
    await done;
  }
  root.RutinStore = Object.freeze({ open, ensureSettings, readAll, sync, saveHabit, toggleTick, deleteHabit, saveSettings, closeSeason, purchase, equip, replaceAll, uid });
})(globalThis);
