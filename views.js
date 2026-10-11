(function (root) {
  'use strict';
  const C = root.RutinConfig, D = root.RutinDerive, G = root.RutinGame, content = root.RutinContent;
  const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const number = content.number, format = content.formatDate, T = content.TEXT;
  const A = content.ASSETS;
  const sprite = (path, cls = '', extra = '') => { const size = content.ART_SIZES[path] || [24, 24]; return content.interpolate('views001', [cls, path, size[0], size[1], extra]); };
  const icon = key => sprite(A.ui[key], 'small-icon');
  const effect = (key, cls = '') => sprite(A.effects[key][0], `effect ${cls}`, `data-effect="${key}"`);
  const bar = (value, maximum, label, kind = '') => content.interpolate('views002', [kind, Math.max(0,value), Math.max(1,maximum), esc(label), value, maximum]);
  const badge = type => content.interpolate('views003', [sprite(A.types[type], 'type-icon'), esc(content.TYPE_LABELS[type])]);
  const activeSeason = state => state.seasons.find(season => !season.sonuc);
  const activeHabits = (state, today) => state.habits.filter(habit => !habit.arsiv && habit.olusturma <= today);
  function itemEffect(item, config) { return item.slot === 'kozmetik' ? item.etki : `${item.slot === 'kilic' ? T.damage : T.protection} +%${number(G.gearBonus(item, item.slot, config) * 100)}`; }
  function habitCards(state, today, compact = false) {
    const season = activeSeason(state);
    const ended = season && G.evaluateSeason(state, season, today).result;
    return activeHabits(state, today).map(habit => {
      const tick = state.ticks.find(tick => tick.habitId === habit.id && tick.tarih === today);
      const locked = !state.settings.karakterAdi || state.gunler.some(day => day.tarih === today) || (tick && (!season || tick.ts < (season.baslangicTs || G.dayStart(season.baslangic)))) || (ended && ended.bitisTarihi < today);
      const series = D.streak(habit, state.ticks, today);
      const pips = Array.from({ length: 3 }, (_, index) => content.interpolate('views004', [index < habit.zorluk ? ' is-filled' : ''])).join('');
      const body = content.interpolate('views005', [sprite(A.types[habit.tur], 'type-icon'), esc(habit.ad), esc(content.TYPE_LABELS[habit.tur]), content.DIFFICULTY_LABELS[habit.zorluk], pips, series.current ? content.interpolate('views006', [icon('ikon_alev_mini_v01'), number(series.current)]) : '', locked ? content.COPY.copy002 : '']);
      const nameArea = compact ? content.interpolate('views007', [body]) : content.interpolate('views008', [esc(habit.id), esc(habit.ad), body]);
      return content.interpolate('views009', [tick ? 'is-done' : '', nameArea, esc(habit.id), esc(habit.ad), tick ? content.COPY.copy003 : content.COPY.copy004, Boolean(tick), locked ? 'disabled' : '', sprite(A.ui[tick ? 'ui_tik_dolu_v01' : 'ui_tik_bos_v01'])]);
    }).join('');
  }
  function dailySummary(state, today) {
    const result = D.dayProgress(activeHabits(state, today), state.ticks, today, today);
    return content.interpolate('views010', [T.daily, number(result.done), number(result.total), bar(result.done, result.total, content.COPY.copy005)]);
  }
  function empty() { return content.COPY.copy006; }
  function bossPage(state, today) {
    const season = activeSeason(state);
    if (!state.settings.karakterAdi) return content.COPY.copy007;
    if (!season) return content.interpolate('views011', [esc(state.settings.karakterAdi), empty()]);
    const play = G.evaluateSeason(state, season, today);
    const last = play.curve.filter(row => row.kapali).at(-1);
    const live = play.curve.find(row => !row.kapali);
    const attributes = G.stats(state, today, season.ayar);
    let html = content.interpolate('views012', [T.hit, esc(state.settings.karakterAdi), number(attributes.seviye), number(play.hp), number(play.maxHp), icon('ikon_kalp_v01'), bar(play.hp, play.maxHp, content.COPY.copy008, 'hp-bar'), number(season.sira + 1), number(play.gun), esc(play.boss.ad), number(play.bossHp), number(season.bossCan0), bar(play.bossHp, season.bossCan0, content.COPY.copy009, 'boss-bar'), badge(play.boss.zayifTur), last && last.canKazanci > 0 ? effect('heal', 'heal-effect') : '', number(live ? live.hasar : 0), number(last ? last.iyilesme : 0), number(last ? last.canKazanci : 0)]);
    let resultHtml = "";
    if (play.result) {
      resultHtml = content.interpolate('views013', [sprite(A.ui[play.result.durum === 'yenildi' ? 'kurdele_zafer_v01' : 'kurdele_yenilgi_v01'], 'result-ribbon'), play.result.durum === 'yenildi' ? content.COPY.copy010 : content.COPY.copy011, sprite(play.boss.portre, 'portrait'), play.result.durum === 'yenildi' ? effect('death') + effect('confetti') : icon('ikon_kafatasi_v01'), sprite(A.rewards.closed, 'chest'), number(play.result.gun), format(play.result.bitisTarihi), sprite(A.rewards.gold), number(play.result.altin), icon('ikon_xp_v01'), number(play.result.xp), play.result.zekaBonus ? content.interpolate('views014', [number(play.result.zekaBonus * 100)]) : '']);
    }
    html += content.COPY.copy012;
    html += content.interpolate('views015', [T.todayHits, T.addHabit, dailySummary(state, today), resultHtml, habitCards(state, today)]);
    return html;
  }
  // Compatibility entry point: old today links now display the battle screen.
  const todayPage = bossPage;
  function mePage(state, today, status = {}) {
    const tab = status.meTab || 'items';
    const season = activeSeason(state), config = season ? season.ayar : state.settings.oyunAyar;
    const attributes = G.stats(state, today, config), play = season && G.evaluateSeason(state, season, today);
    const hp = play ? play.hp : G.maxHp(attributes, config), maxHp = play ? play.maxHp : G.maxHp(attributes, config);
    const gear = G.equipmentAt(state.equips, G.dayEnd(today));
    const tabs = content.interpolate('views016', [T.me, ['items','stats','history'].map(key => content.interpolate('views017', [key, key === tab, T[key]])).join('')]);
    const heading = content.interpolate('views018', [esc(state.settings.karakterAdi || T.traveler), T.rename]);
    const life = content.interpolate('views019', [T.hp, number(hp), number(maxHp), bar(hp,maxHp,T.hp,'hp-bar')]);
    let body;
    if (tab === 'stats') {
      body = content.interpolate('views020', [life, T.level, number(attributes.seviye), number(attributes.xp), T.totalXp, C.TYPES.map(type => { const stat = attributes.turler[type]; return content.interpolate('views021', [sprite(A.types[type], 'type-icon'), content.TYPE_LABELS[type], T.level, number(stat.seviye), bar(stat.kalan,stat.esik,content.TYPE_LABELS[type] + ' ' + T.xp), number(stat.kalan), number(stat.esik), T.xp]); }).join('')]);
    } else if (tab === 'history') {
      body = content.interpolate('views022', [historyPage(state,today,status)]);
    } else {
      const slot = key => {
        const item = gear[key], label = content.SLOTS[key];
        const aria = item ? `${label}: ${item.ad}, ${T.equipped}. ${T.unequipTouch}` : `${label} ${T.slot}: ${T.emptySlot}`;
        return content.interpolate('views023', [item ? ' is-equipped' : '', key, item ? item.id : '', esc(aria), sprite(item ? item.sprite : A.ui[key === 'kilic' ? 'slot_bos_kilic_v01' : key === 'zirh' ? 'slot_bos_zirh_v01' : 'slot_bos_kozmetik_v01'])]);
      };
      const owned = content.ITEMS.filter(item => state.purchases.some(p => p.itemId === item.id)).sort((a,b) => ['kilic','zirh','kozmetik'].indexOf(a.slot) - ['kilic','zirh','kozmetik'].indexOf(b.slot) || a.kademe - b.kademe);
      const cells = Array.from({length:Math.max(12,owned.length)},(_,i) => {
        const item = owned[i];
        if (!item) return content.interpolate('views024', [T.emptyInventory]);
        const equipped = gear[G.slotFor(item)]?.id === item.id;
        return content.interpolate('views025', [equipped ? ' is-equipped' : '', item.id, esc(item.ad), equipped ? T.unequipTouch : T.equipTouch, sprite(item.sprite), equipped ? icon('ikon_onay_v01') : '']);
      }).join('');
      const lastItem = content.ITEMS.find(item => item.id === status.lastItemId);
      body = content.interpolate('views026', [['tac','kolye','yuzuk'].map(slot).join(''), sprite(A.character,'character-sprite'), ['kilic','zirh','pelerin'].map(slot).join(''), T.level, number(attributes.seviye), T.xp, number(attributes.kalan), number(attributes.esik), bar(attributes.kalan,attributes.esik,T.xp), icon('ikon_altin_v01'), number(G.balance(state)), T.inventory, cells, lastItem ? esc(lastItem.ad) + content.COPY.copy013 + itemEffect(lastItem,config) : T.lastItem]);
    }
    return content.interpolate('views027', [tabs, heading, body]);
  }
  function shopPage(state, today) {
    const season = activeSeason(state), config = season ? season.ayar : state.settings.oyunAyar;
    const gear = G.equipmentAt(state.equips, G.dayEnd(today)), gold = G.balance(state);
    return content.interpolate('views028', [icon('ikon_altin_v01'), number(gold), content.ITEMS.map(item => {
      const owned = state.purchases.some(purchase => purchase.itemId === item.id);
      const equipped = gear[G.slotFor(item)] && gear[G.slotFor(item)].id === item.id;
      return content.interpolate('views029', [item.sprite, item.ad, item.slot === 'kozmetik' ? content.COPY.copy014 : content.tierLabel(item.kademe), item.ad, itemEffect(item, config), icon('ikon_altin_v01'), number(item.fiyat), owned ? 'secondary' : 'primary', owned ? 'equip' : 'buy', item.id, item.ad, owned ? equipped ? content.COPY.copy015 : content.COPY.copy016 : content.COPY.copy017, equipped || (!owned && gold < item.fiyat) ? 'disabled' : '', icon(owned ? 'ikon_onay_v01' : 'ikon_kilit_v01'), owned ? equipped ? content.COPY.copy018 : content.COPY.copy019 : content.COPY.copy020]);
    }).join('')]);
  }
  function historyPage(state, today, status = {}) {
    const selected = status.historyDate && status.historyDate <= today ? status.historyDate : today;
    const eligible = date => state.habits.filter(h => h.olusturma <= date);
    const start = D.addDays(D.weekStart(today), -14 * 7);
    const cells = Array.from({length:105},(_,i) => {
      const date = D.addDays(start,i);
      if (date > today) return '';
      const progress = D.dayProgress(eligible(date),state.ticks,date,today), level = D.calendarLevel(progress.percent,progress.total);
      const aria = content.interpolate('views030', [format(date), number(progress.done), number(progress.total), T.habits]);
      return content.interpolate('views031', [date, esc(aria), selected === date, sprite(A.ui['ui_takvim_hucre_' + level + '_v01']), date === today ? sprite(A.ui.ui_takvim_bugun_v01,'calendar-today') : '']);
    }).join('');
    const progress = D.dayProgress(eligible(selected),state.ticks,selected,today);
    const done = state.habits.filter(h => state.ticks.some(t => t.habitId === h.id && t.tarih === selected)).map(h => h.ad);
    const series = activeHabits(state,today).map(habit => ({habit,...D.streak(habit,state.ticks,today)})).sort((a,b) => b.current-a.current || b.best-a.best || content.compareNames(a.habit.ad,b.habit.ad));
    const completed = state.seasons.filter(s => s.sonuc).sort((a,b) => b.sira-a.sira);
    return content.interpolate('views032', [T.calendar, T.calendarLegend, Array.from({length:5},(_,i) => sprite(A.ui['ui_takvim_hucre_' + i + '_v01'])).join(''), T.calendar, cells, format(selected), number(progress.done), number(progress.total), T.habits, done.length ? done.map(esc).join(content.COPY.copy013) : T.noCompleted, T.streaks, series.length ? series.map(row => content.interpolate('views033', [icon(row.current ? 'ikon_alev_v01' : 'ikon_alev_sonuk_v01'), esc(row.habit.ad), number(row.current), T.days, row.best > row.current ? content.interpolate('views034', [icon('ikon_kupa_v01'), T.best, number(row.best), T.days]) : ''])).join('') : content.interpolate('views035', [T.noHabits]), T.seasons, completed.length ? completed.map(season => { const boss = content.BOSSES.find(b => b.id === season.bossId); return content.interpolate('views036', [sprite(boss.portre,'portrait'), esc(boss.ad), season.sonuc.durum === 'yenildi' ? T.won : T.died, format(season.baslangic), format(season.sonuc.bitisTarihi), number(season.sonuc.gun), T.days, sprite(A.rewards.open,'chest'), icon('ikon_altin_v01'), number(season.sonuc.altin), T.gold, number(season.sonuc.xp), T.xp]); }).join('') : content.interpolate('views037', [T.noSeasons])]);
  }
  const labels = {
    puanCarpani: content.COPY.copy021, sezonGunu: content.COPY.copy022, bossCanKatsayisi: content.COPY.copy023, zayifTurCarpani: content.COPY.copy024, gunlukVurus: content.COPY.copy025, rMin: content.COPY.copy026, rMax: content.COPY.copy027, iyilesmeOrani: content.COPY.copy028, haftalikIyilesmeTavani: content.COPY.copy029, zaferOlcegi: content.COPY.copy030, olumOlcegi: content.COPY.copy031, tabanCan: content.COPY.copy032, dayaniklilikCan: content.COPY.copy033, mukemmelCan: content.COPY.copy034, odakCan: content.COPY.copy035, altinOdulu: content.COPY.copy036, zaferXp: content.COPY.copy037, olumAltinOrani: content.COPY.copy038, zekaAltin: content.COPY.copy039, zekaTavan: content.COPY.copy040, seviyeTaban: content.COPY.copy041, seviyeArtis: content.COPY.copy042
  };
  function simulatorResult(simulation) {
    if (!simulation) return '';
    if (simulation.winRate !== undefined) return content.interpolate('views038', [number(simulation.winRate * 100), simulation.wins, simulation.deaths, simulation.maxDays, simulation.ongoing, simulation.averageWinDay === null ? content.COPY.copy043 : number(simulation.averageWinDay), simulation.averageDeathDay === null ? content.COPY.copy043 : number(simulation.averageDeathDay)]);
    const rows = simulation.curve;
    const maximum = Math.max(1, ...rows.map(row => Math.max(row.boss, row.azamiCan)));
    const points = key => rows.map((row, i) => `${Math.round(8 + i / Math.max(1, rows.length - 1) * 264)},${Math.round(110 - row[key] / maximum * 100)}`).join(' ');
    return content.interpolate('views039', [simulation.result ? content.interpolate('views040', [simulation.result.durum === 'yenildi' ? content.replayWin : content.COPY.copy044, simulation.result.gun]) : content.COPY.copy045, points('boss'), points('can'), rows.map(row => content.interpolate('views041', [row.gun, number(row.boss), number(row.can)])).join('')]);
  }
  function settingsPage(state, today, status) {
    const archived = state.habits.filter(habit => habit.arsiv), config = status.configDraft || state.settings.oyunAyar;
    const inputs = status.simInputs;
    return content.interpolate('views042', [esc(status.storageStatus), esc(status.offlineStatus), archived.length, archived.length ? archived.map(habit => content.interpolate('views043', [esc(habit.ad), esc(habit.id)])).join('') : content.COPY.copy046, status.devOpen ? 'open' : '', Object.entries(G.CONFIG_RULES).map(([key, [min, max]]) => content.interpolate('views044', [labels[key], key, labels[key], min, max, config[key]])).join(''), ['kilicBonuslari', 'zirhBonuslari'].map(key => content.interpolate('views045', [key === 'kilicBonuslari' ? content.COPY.copy047 : content.COPY.copy048, key, config[key].join(', '), key])).join(''), inputs.consistency, esc(inputs.seed), status.simBusy ? 'disabled' : '', status.simBusy ? content.COPY.copy049 : content.COPY.copy050, state.seasons.slice().sort((a, b) => b.sira - a.sira).map(season => content.interpolate('views046', [esc(season.id), inputs.seasonId === season.id ? 'selected' : '', season.sira + 1, content.BOSSES.find(b => b.id === season.bossId).ad])).join(''), !state.seasons.length || status.simBusy ? 'disabled' : '', simulatorResult(status.simResult), C.VERSION, C.SCHEMA_VERSION]);
  }
  const images = new Map();
  function load(path, redraw) {
    let image = images.get(path);
    if (!image) { image = new Image(); image.src = path; images.set(path, image); }
    if (!image.complete) image.addEventListener('load', redraw, { once: true });
    return image;
  }
  function align(element) {
    // CSS now uses a fixed integer art scale. Never scale CSS overrides twice.
    element.style.transform = '';
  }
  const frame = (paths, elapsed) => paths[Math.min(paths.length - 1, Math.floor(elapsed / 80))];
  // Scrolling at fractional DPR can shift an otherwise aligned origin off the device grid.
  root.addEventListener('scroll', () => {
    root.requestAnimationFrame(() => document.querySelectorAll('img[data-art], #boss-canvas, .hurt-effect').forEach(align));
  }, { passive: true });
  let animationId, mountId = 0;
  let previousDay = null, previousHp = null;
  function mount(state, today, impact) {
    root.cancelAnimationFrame(animationId);
    const id = ++mountId, main = document.querySelector('#main');
    const dpr = root.devicePixelRatio || 1;
    const pixel = 3, scale = pixel * dpr;
    document.documentElement.style.setProperty('--art-pixel', `${pixel}px`);
    document.documentElement.style.setProperty('--art-scale', scale);
    const area = main.querySelector('.battle-area');
    if (area) area.style.flexBasis = `${Math.floor(main.clientHeight * .4 / 3) * 3}px`;
    Object.entries(A.ui).forEach(([key, path]) => document.documentElement.style.setProperty(`--${key}`, `url("${path}")`));
    main.querySelectorAll('button:not([aria-label])').forEach(button => button.setAttribute('aria-label', button.textContent.trim()));
    document.querySelectorAll('[data-asset]').forEach(image => {
      image.src = image.dataset.asset.split('.').reduce((v, k) => v[k], A);
      const size = content.ART_SIZES[image.getAttribute('src')];
      image.dataset.art = size[0]; image.dataset.artHeight = size[1];
    });
    document.querySelectorAll('img[data-art]').forEach(image => {
      image.style.width = `${Number(image.dataset.art) * pixel}px`;
      image.style.height = `${Number(image.dataset.artHeight || image.dataset.art) * pixel}px`;
    });
    document.querySelectorAll('.progress').forEach(bar => {
      bar.style.width = '';
      const width = Math.floor(bar.clientWidth / pixel);
      bar.style.width = `${width * pixel}px`;
      bar.firstElementChild.style.width = `${Math.floor(Math.max(0, Math.min(1, Number(bar.dataset.value) / Math.max(1, Number(bar.dataset.max)))) * Math.max(0, width - 2)) * pixel}px`;
    });
    const canvas = document.querySelector('#boss-canvas'), season = activeSeason(state);
    const play = season && G.evaluateSeason(state, season, today);
    const hurt = play && previousHp !== null && previousDay !== today && play.hp < previousHp;
    if (hurt && canvas) {
      const image = document.createElement('img');
      image.className = content.COPY.copy051; image.dataset.effect = 'hurt'; image.setAttribute('aria-hidden', 'true'); image.alt = '';
      image.style.width = image.style.height = `${32 * pixel}px`; canvas.parentElement.append(image);
    }
    previousDay = today; previousHp = play ? play.hp : null;
    const reduced = root.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const started = Date.now();
    function paint() {
      if (id !== mountId) return;
      const elapsed = Date.now() - started;
      document.querySelectorAll('[data-effect]').forEach(image => {
        image.src = frame(A.effects[image.dataset.effect], reduced ? 0 : elapsed);
      });
      if (canvas && play) {
        const height = Math.max(1, Math.floor(canvas.parentElement.clientHeight / pixel));
        canvas.width = Math.round(120 * scale); canvas.height = Math.round(height * scale);
        canvas.style.width = '360px'; canvas.style.height = `${height * pixel}px`;
        const ctx = canvas.getContext('2d'); ctx.imageSmoothingEnabled = false;
        ctx.scale(scale, scale);
        const redraw = () => { if (id === mountId && canvas.isConnected) paint(); };
        const background = load(play.boss.arkaplan || A.backgrounds.fallback, redraw);
        const boss = load(play.boss.sprite, redraw);
        // Keep the boss and platform visible: crop sky, then ground, on short screens.
        const crop = Math.max(0, 178 - height), extension = Math.max(0, height - 270);
        if (background.complete && background.naturalWidth) {
          // Extend long screens using the existing top sky row, without drawing new scenery.
          if (extension) ctx.drawImage(background, 0, 0, 120, 1, 0, 0, 120, extension);
          ctx.drawImage(background, 0, extension - crop);
        }
        const remaining = impact ? impact.until - Date.now() : 0;
        const offset = remaining > 0 && !reduced ? [0, 1, 0, -1][Math.floor(elapsed / 80) % 4] : 0;
        if (boss.complete && boss.naturalWidth) ctx.drawImage(boss, 12 + offset, Math.floor((height - 96) / 2));
        if (remaining > 0) {
          const fx = load(frame(A.effects.hit, reduced ? 0 : elapsed), redraw);
          if (fx.complete && fx.naturalWidth) ctx.drawImage(fx, 48, Math.floor(height / 2));
        }
        const hitNumber = document.querySelector('.hit-number');
        if (hitNumber) { hitNumber.hidden = remaining <= 0; hitNumber.textContent = impact ? content.interpolate('views047', [number(impact.amount)]) : ''; }
        align(canvas);
      }
      document.querySelectorAll('img[data-art], .hurt-effect').forEach(align);
      if ((!reduced && elapsed < 320) || (impact && impact.until > Date.now())) animationId = root.requestAnimationFrame(paint);
    }
    paint();
  }
  root.RutinViews = Object.freeze({ bossPage, todayPage, mePage, shopPage, historyPage, settingsPage, mount, number, itemEffect });
})(globalThis);
