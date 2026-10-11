(function (root) {
  'use strict';
  const C = root.RutinConfig, D = root.RutinDerive, G = root.RutinGame, content = root.RutinContent;
  const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const number = value => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1 }).format(value);
  const format = value => new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short' }).format(D.parseDate(value));
  const A = content.ASSETS;
  const sprite = (path, cls = '', extra = '') => { const size = content.ART_SIZES[path] || [24, 24]; return `<img class="pixel ${cls}" src="${path}" data-art="${size[0]}" data-art-height="${size[1]}" alt="" aria-hidden="true" ${extra}>`; };
  const icon = key => sprite(A.ui[key], 'small-icon');
  const effect = (key, cls = '') => sprite(A.effects[key][0], `effect ${cls}`, `data-effect="${key}"`);
  const bar = (value, maximum, label, kind = '') => `<div class="progress ${kind}" role="progressbar" aria-valuenow="${Math.max(0,value)}" aria-valuemin="0" aria-valuemax="${Math.max(1,maximum)}" aria-label="${esc(label)}" data-value="${value}" data-max="${maximum}"><span class="bar-fill"></span></div>`;
  const badge = type => `<span class="badge">${sprite(A.types[type], 'type-icon')}<span>${esc(type)}</span></span>`;
  const activeSeason = state => state.seasons.find(season => !season.sonuc);
  const activeHabits = (state, today) => state.habits.filter(habit => !habit.arsiv && habit.olusturma <= today);
  function itemEffect(item, config) { return item.slot === 'kozmetik' ? item.etki : `${item.slot === 'kilic' ? 'Hasar' : 'Koruma'} +%${number(G.gearBonus(item, item.slot, config) * 100)}`; }
  function habitCards(state, today, compact = false) {
    const season = activeSeason(state);
    const ended = season && G.evaluateSeason(state, season, today).result;
    return activeHabits(state, today).map(habit => {
      const tick = state.ticks.find(tick => tick.habitId === habit.id && tick.tarih === today);
      const locked = !state.settings.karakterAdi || state.gunler.some(day => day.tarih === today) || (tick && (!season || tick.ts < (season.baslangicTs || G.dayStart(season.baslangic)))) || (ended && ended.bitisTarihi < today);
      return `<article class="habit-card ${tick ? 'is-done' : ''}"><div>${compact ? `<span class="habit-name">${esc(habit.ad)}</span>` : `<button type="button" class="edit-habit" data-action="edit" data-id="${esc(habit.id)}" aria-label="${esc(habit.ad)} alışkanlığını düzenle"><span class="habit-name">${esc(habit.ad)}</span><span aria-hidden="true">›</span></button>`}<div class="habit-meta">${badge(habit.tur)}<span class="difficulty" aria-label="${C.DIFFICULTIES[habit.zorluk]}">${'●'.repeat(habit.zorluk)}${'○'.repeat(3 - habit.zorluk)}</span>${locked ? '<small>Sezon kaydı kilitli</small>' : ''}</div></div><button type="button" class="tick-button" data-action="tick" data-id="${esc(habit.id)}" aria-label="${esc(habit.ad)}: ${tick ? 'tiki geri al' : 'tik at'}" aria-pressed="${Boolean(tick)}" ${locked ? 'disabled' : ''}>${sprite(A.ui[tick ? 'ui_tik_dolu_v01' : 'ui_tik_bos_v01'])}</button></article>`;
    }).join('');
  }
  function dailySummary(state, today) {
    const result = D.dayProgress(activeHabits(state, today), state.ticks, today, today);
    return `<div class="daily-summary"><span>GÜNLÜK ADIMLAR</span><strong>${result.done}/${result.total}</strong>${bar(result.done, result.total, 'Günlük ilerleme')}</div>`;
  }
  function empty() { return '<div class="empty"><p class="eyebrow">BİR ADIMLA BAŞLA</p><h2>İlk alışkanlığını ekle.</h2><p>Sezonun, bir günlük alışkanlığın olduğunda başlar.</p><button type="button" class="primary wide" data-action="add">İlk alışkanlığını ekle</button></div>'; }
  function bossPage(state, today) {
    const season = activeSeason(state);
    if (!state.settings.karakterAdi) return '<p class="eyebrow">KINDLEBORN</p><h1>Her gün bir adım.</h1><div class="empty"><p>Karakterini oluştur; günlük alışkanlıklarınla bosslara karşı ilerle.</p><button type="button" class="primary wide" data-action="rename">Karakterini oluştur</button><button type="button" class="secondary wide" data-action="settings">Yedek geri yükle</button></div>';
    if (!season) return `<p class="eyebrow">${esc(state.settings.karakterAdi)} · MACERAN BAŞLIYOR</p><h1>Küçük adımlar.<br>Büyük mücadele.</h1>${empty()}`;
    const play = G.evaluateSeason(state, season, today);
    const last = play.curve.filter(row => row.kapali).at(-1);
    const live = play.curve.find(row => !row.kapali);
    const attributes = G.stats(state, today, season.ayar);
    let html = `<section class="battle-scene"><canvas id="boss-canvas" aria-hidden="true"></canvas><div class="battle-hud"><div class="hero-meta"><span>${esc(state.settings.karakterAdi)} · SV. ${attributes.seviye}</span><strong>${number(play.hp)}/${number(play.maxHp)} ${icon('ikon_kalp_v01')} CAN</strong></div>${bar(play.hp, play.maxHp, 'Karakter canı', 'hp-bar')}
      <div class="boss-heading"><p class="eyebrow">SEZON ${season.sira + 1} · GÜN ${play.gun}</p><h1>${esc(play.boss.ad)}</h1><div class="boss-details"><span>Boss canı</span><span>${number(play.bossHp)} / ${number(season.bossCan0)}</span></div></div>${bar(play.bossHp, season.bossCan0, 'Boss canı', 'boss-bar')}
      </div></section><div class="battle-footer"><p class="boss-weakness">Zayıf tür ${badge(play.boss.zayifTur)}</p>
      ${last && last.canKazanci > 0 ? effect('heal', 'heal-effect') : ''}<p class="battle-summary">Bugün ${number(live ? live.hasar : 0)} hasar, +${number(last ? last.iyilesme : 0)} iyileşti, +${number(last ? last.canKazanci : 0)} can</p><p class="field-note center">İyileşme ve can kazancı kapanmış son günden. Bugün yalnız hasar canlıdır.</p></div>`;
    if (play.result) {
      html += `<section class="result-card" role="status"><div class="result-banner">${sprite(A.ui[play.result.durum === 'yenildi' ? 'kurdele_zafer_v01' : 'kurdele_yenilgi_v01'], 'result-ribbon')}<h2>${play.result.durum === 'yenildi' ? 'Bossu yendin!' : 'Bu kez düştün.'}</h2></div><p class="eyebrow">SEZON SONUCU</p>${sprite(play.boss.portre, 'portrait')}<div class="result-effects">${play.result.durum === 'yenildi' ? effect('death') + effect('confetti') : icon('ikon_kafatasi_v01')}</div>${sprite(A.rewards.closed, 'chest')}<p>${play.result.gun}. gün · ${format(play.result.bitisTarihi)}</p><div class="reward-grid"><span>${sprite(A.rewards.gold)} ALTIN<strong>+${play.result.altin}</strong></span><span>${icon('ikon_xp_v01')} XP<strong>+${play.result.xp}</strong></span></div>${play.result.zekaBonus ? `<p>Zeka bonusu: %${number(play.result.zekaBonus * 100)}</p>` : ''}<p class="field-note">Ödül, sezonu kapattığında bakiyene eklenir. Sonraki sezon tam canla başlar.</p><button type="button" class="primary wide" data-action="close-season">Sezonu kapat</button></section>`;
    }
    html += dailySummary(state, today);
    if (activeHabits(state, today).length) html += `<div class="section-heading"><h2>Bugünün vuruşları</h2><button type="button" class="text-button" data-action="today-page">Tümü ›</button></div><div class="habit-list compact">${habitCards(state, today, true)}</div>`;
    else html += '<p class="field-note">Aktif alışkanlığın yok. Bugün ekranından ekleyebilirsin.</p><button type="button" class="secondary wide" data-action="add">Alışkanlık ekle</button>';
    return html;
  }
  function todayPage(state, today) {
    return `<p class="eyebrow">${format(today)} · BUGÜN</p><h1>Bugünün adımları.</h1><p class="subtitle">Gün 00:00’da kapanır. Geçmiş günler değişmez.</p>${activeHabits(state, today).length ? `${dailySummary(state, today)}<div class="habit-list">${habitCards(state, today)}</div><button type="button" class="primary wide add-habit" data-action="add">+ Yeni alışkanlık</button>` : empty()}<p class="footnote">Kaçınma alışkanlıklarında tik, “bugün yapmadım” demektir.</p>`;
  }
  function mePage(state, today) {
    const season = activeSeason(state), config = season ? season.ayar : state.settings.oyunAyar;
    const attributes = G.stats(state, today, config);
    const play = season && G.evaluateSeason(state, season, today);
    const gear = G.equipmentAt(state.equips, G.dayEnd(today));
    return `<p class="eyebrow">SENİN MACERAN</p><div class="section-heading"><h1>${esc(state.settings.karakterAdi || 'Yolcu')}</h1><button type="button" class="secondary" data-action="rename">Adı düzenle</button></div><div class="character-panel">${sprite(A.character, 'character-sprite')}<div><p class="level-label">SEVİYE ${attributes.seviye}</p><p>${number(attributes.xp)} toplam XP</p>${bar(attributes.kalan, attributes.esik, 'Karakter XP')}<small>${number(attributes.kalan)}/${number(attributes.esik)} · sonraki seviye</small></div></div><div class="settings-card"><div class="hero-meta"><span>CAN</span><strong>${number(play ? play.hp : G.maxHp(attributes, config))}/${number(play ? play.maxHp : G.maxHp(attributes, config))}</strong></div>${bar(play ? play.hp : G.maxHp(attributes, config), play ? play.maxHp : G.maxHp(attributes, config), 'Can', 'hp-bar')}</div>
      <h2>Özelliklerin</h2><div class="stat-grid">${C.TYPES.map((type, i) => { const stat = attributes.turler[type]; return `<section class="stat-card">${sprite(A.types[type], 'type-icon')}<h3>${type}</h3><strong>SV. ${stat.seviye}</strong>${bar(stat.kalan, stat.esik, type + ' XP')}<small>${number(stat.kalan)}/${number(stat.esik)} XP</small></section>`; }).join('')}</div>
      <h2 class="spaced">Kuşandıkların</h2><div class="equipment-grid">${Object.entries(content.SLOTS).map(([slot, label]) => `<section class="slot-card"><h3>${label}</h3><div class="equipment-slot ${gear[slot] ? 'is-equipped' : ''}">${sprite(gear[slot] ? gear[slot].sprite : A.ui[slot === 'kilic' ? 'slot_bos_kilic_v01' : slot === 'zirh' ? 'slot_bos_zirh_v01' : 'slot_bos_kozmetik_v01'])}</div>${gear[slot] ? `<strong>${gear[slot].ad}</strong><p>${icon('ikon_onay_v01')} ${itemEffect(gear[slot], config)}</p>` : '<p>Boş slot</p>'}</section>`).join('')}</div><p class="field-note">Ekipman slotlarda görünür. Kozmetikler şimdilik yalnız görünüm içindir.</p>`;
  }
  function shopPage(state, today) {
    const season = activeSeason(state), config = season ? season.ayar : state.settings.oyunAyar;
    const gear = G.equipmentAt(state.equips, G.dayEnd(today)), gold = G.balance(state);
    return `<p class="eyebrow">DÜKKAN</p><h1>Küçük bir hazırlık.</h1><div class="gold-wallet"><span>ALTININ</span><strong>${icon('ikon_altin_v01')} ${number(gold)}</strong></div><p class="field-note">Altın yalnız kapatılan sezonların ödüllerinden gelir.</p><div class="shop-grid">${content.ITEMS.map(item => {
      const owned = state.purchases.some(purchase => purchase.itemId === item.id);
      const equipped = gear[G.slotFor(item)] && gear[G.slotFor(item)].id === item.id;
      return `<article class="shop-item"><img class="pixel item-sprite" data-art="24" src="${item.sprite}" alt="${item.ad}"><p class="eyebrow">${item.slot === 'kozmetik' ? 'KOZMETİK' : `KADEME ${item.kademe}`}</p><h2>${item.ad}</h2><p>${itemEffect(item, config)}</p><strong class="item-price">${icon('ikon_altin_v01')} ${item.fiyat}</strong><button type="button" class="${owned ? 'secondary' : 'primary'} wide" data-action="${owned ? 'equip' : 'buy'}" data-id="${item.id}" aria-label="${item.ad}: ${owned ? equipped ? 'kuşanıldı' : 'kuşan' : 'satın al'}" ${equipped || (!owned && gold < item.fiyat) ? 'disabled' : ''}>${icon(owned ? 'ikon_onay_v01' : 'ikon_kilit_v01')} ${owned ? equipped ? 'Kuşanıldı' : 'Kuşan' : 'Satın al'}</button></article>`;
    }).join('')}</div>`;
  }
  function historyPage(state, today) {
    const completed = state.seasons.filter(season => season.sonuc).sort((a, b) => b.sira - a.sira);
    const habits = state.habits.map(habit => ({ ...habit, haftalikHedef: 7 }));
    const ticks = state.ticks.map(tick => ({ ...tick, snapshot: { ...tick.snapshot, haftalikHedef: 7 } }));
    return `<p class="eyebrow">DEĞİŞMEYEN ADIMLAR</p><h1>Geçmişin.</h1><h2>Sezon defteri</h2>${completed.length ? completed.map(season => `<section class="history-week"><div class="section-heading"><h3>${sprite(content.BOSSES.find(b => b.id === season.bossId).portre, 'portrait')} ${esc(content.BOSSES.find(b => b.id === season.bossId).ad)}</h3><span class="badge">${season.sonuc.durum === 'yenildi' ? 'Yendin' : 'Öldün'}</span></div><p>${format(season.baslangic)} → ${format(season.sonuc.bitisTarihi)} · ${season.sonuc.gun} gün</p><p>${sprite(A.rewards.open, 'chest')} ${icon('ikon_altin_v01')} ${season.sonuc.altin} altın · +${season.sonuc.xp} XP</p></section>`).join('') : '<p class="subtitle">İlk sezonun sonucu burada yerini alacak.</p>'}<h2 class="spaced">Son 8 hafta</h2><p class="field-note">Günlük alışkanlıklar için k/7. v0 tikleri ve snapshot’ları depoda korunur.</p>${habits.length ? D.historyWeeks(habits, ticks, today).map((week, index) => `<section class="history-week"><h3>${index === 0 ? 'Bu hafta' : format(week.start) + ' haftası'}</h3><p class="week-caption">${format(week.start)} – ${format(week.end)}</p>${week.habits.map(row => `<div class="history-row"><div class="history-row-head"><span class="history-row-name">${esc(row.habit.ad)} ${row.habit.arsiv ? '<small>Arşiv</small>' : ''}</span><span class="history-score">${row.available ? `${row.count}/7 · %${row.percent}` : '—'}</span></div>${row.available ? bar(row.count, 7, row.habit.ad + ' haftalık ilerleme') : ''}</div>`).join('')}</section>`).join('') : '<p>Henüz alışkanlık yok.</p>'}<h2 class="spaced">Kapanmış günler</h2>${state.gunler.length ? `<div class="table-scroll"><table><thead><tr><th>Gün</th><th>Puan</th><th>Kaçan</th><th>Tik</th></tr></thead><tbody>${state.gunler.slice().sort((a, b) => b.tarih.localeCompare(a.tarih)).slice(0, 56).map(row => `<tr><td>${format(row.tarih)} ${row.mukemmel ? '★' : ''}</td><td>${number(row.yapilan)}/${number(row.potansiyel)}</td><td>${number(row.kacirilan)}</td><td>${row.tikSayisi}</td></tr>`).join('')}</tbody></table></div>` : '<p class="field-note">İlk gün yerel 00:00’da kapanır.</p>'}`;
  }
  const labels = {
    puanCarpani: 'Zorluk başına puan', sezonGunu: 'Hedef sezon günü', bossCanKatsayisi: 'Boss can katsayısı', zayifTurCarpani: 'Zayıf tür çarpanı', gunlukVurus: 'Günlük ortalama vuruş', rMin: 'r alt sınırı', rMax: 'r üst sınırı', iyilesmeOrani: 'Boss iyileşme oranı', haftalikIyilesmeTavani: 'Haftalık iyileşme tavanı', zaferOlcegi: 'Zafer sonrası ölçek', olumOlcegi: 'Ölüm sonrası ölçek', tabanCan: 'Taban can', dayaniklilikCan: 'Dayanıklılık başına can', mukemmelCan: 'Mükemmel gün canı', odakCan: 'Odak başına can', altinOdulu: 'Zafer temel altını', zaferXp: 'Zafer XP', olumAltinOrani: 'Ölüm altın oranı', zekaAltin: 'Zeka altın bonusu', zekaTavan: 'Zeka bonus tavanı', seviyeTaban: 'İlk seviye eşiği', seviyeArtis: 'Seviye eşiği artışı'
  };
  function simulatorResult(simulation) {
    if (!simulation) return '';
    if (simulation.winRate !== undefined) return `<div class="settings-card" role="status"><h3>1000 sezon · aynı tohum</h3><p>Yenme: %${number(simulation.winRate * 100)} (${simulation.wins})<br>Ölüm: ${simulation.deaths}<br>${simulation.maxDays} günde hâlâ süren: ${simulation.ongoing}</p><p>Ortalama yenme günü: ${simulation.averageWinDay === null ? '—' : number(simulation.averageWinDay)}<br>Ortalama ölme günü: ${simulation.averageDeathDay === null ? '—' : number(simulation.averageDeathDay)}</p></div>`;
    const rows = simulation.curve;
    const maximum = Math.max(1, ...rows.map(row => Math.max(row.boss, row.azamiCan)));
    const points = key => rows.map((row, i) => `${Math.round(8 + i / Math.max(1, rows.length - 1) * 264)},${Math.round(110 - row[key] / maximum * 100)}`).join(' ');
    return `<section class="settings-card"><h3>Geçmiş yeniden oynatımı</h3><p>${simulation.result ? `${simulation.result.durum === 'yenildi' ? 'Yenme' : 'Ölüm'} · ${simulation.result.gun}. gün` : 'Sezon sürüyor'}</p><svg class="replay-chart" viewBox="0 0 280 120" role="img" aria-label="Gün gün boss canı (kırmızı) ve karakter canı (yeşil)"><polyline points="${points('boss')}" class="chart-boss"/><polyline points="${points('can')}" class="chart-hp"/></svg><p class="field-note">Kırmızı: boss · Yeşil: karakter</p><div class="table-scroll"><table><thead><tr><th>Gün</th><th>Boss</th><th>Can</th></tr></thead><tbody>${rows.map(row => `<tr><td>${row.gun}</td><td>${number(row.boss)}</td><td>${number(row.can)}</td></tr>`).join('')}</tbody></table></div></section>`;
  }
  function settingsPage(state, today, status) {
    const archived = state.habits.filter(habit => habit.arsiv), config = status.configDraft || state.settings.oyunAyar;
    const inputs = status.simInputs;
    return `<p class="eyebrow">KONTROL SENDE</p><h1>Ayarlar.</h1><section class="settings-card"><h2>Yedekleme</h2><p>Verilerin yalnız bu cihazda. Düzenli yedek al.</p><button type="button" class="primary wide" data-action="download">JSON yedeğini indir</button><button type="button" class="secondary wide" data-action="share">Yedeği paylaş</button><button type="button" class="secondary wide" data-action="import">JSON’dan geri yükle</button><input type="file" id="backup-file" accept=".json,application/json" hidden><p class="field-note">Geri yükleme bütün alışkanlık, tik, sezon, gün defteri ve eşya verilerini değiştirir. v0 yedekleri de kabul edilir.</p></section>
      <section class="settings-card"><h2>Cihazda saklama</h2><p class="storage-status">${esc(status.storageStatus)}</p><button type="button" class="secondary wide" data-action="persist">Kalıcı depolama iste</button><p class="field-note">${esc(status.offlineStatus)}</p></section><section class="settings-card"><h2>Arşiv (${archived.length})</h2>${archived.length ? archived.map(habit => `<div class="archive-row"><span>${esc(habit.ad)}</span><button class="secondary" type="button" data-action="edit" data-id="${esc(habit.id)}">Düzenle</button></div>`).join('') : '<p>Arşiv henüz boş.</p>'}</section>
      <details class="developer" id="developer" ${status.devOpen ? 'open' : ''}><summary>Geliştirici · denge ve simülatör</summary><p class="field-note">Bu bölüm güvenlik sınırı değildir. Değişiklikler yalnız yeni sezonlara uygulanır; süren sezon kendi ayarlarını kullanır.</p><form id="config-form"><div class="config-grid">${Object.entries(G.CONFIG_RULES).map(([key, [min, max]]) => `<label>${labels[key]}<input name="${key}" aria-label="${labels[key]}" type="number" min="${min}" max="${max}" step="any" value="${config[key]}" required></label>`).join('')}</div>${['kilicBonuslari', 'zirhBonuslari'].map(key => `<label>${key === 'kilicBonuslari' ? 'Kılıç' : 'Zırh'} bonusları (Tahta, Demir, Çelik)<input name="${key}" value="${config[key].join(', ')}" aria-label="${key}" required></label>`).join('')}<button class="primary wide" type="submit">Yeni sezon ayarlarını kaydet</button><button class="secondary wide" type="button" data-action="reset-config">Varsayılana dön</button></form><h2 class="spaced">Simülatör</h2><label for="consistency">Tutarlılık (%)</label><input id="consistency" type="number" min="0" max="100" value="${inputs.consistency}"><label for="sim-seed">Sabit tohum</label><input id="sim-seed" maxlength="80" value="${esc(inputs.seed)}"><p class="field-note">5 günlük alışkanlık, N=1000; en fazla 90 gün. Bitmeyen sezonlar ayrıca sayılır. Formdaki seçili ayarı kullanır, oyuncu verisine yazmaz.</p><button class="secondary wide" type="button" data-action="simulate" ${status.simBusy ? 'disabled' : ''}>${status.simBusy ? 'Hesaplanıyor…' : '1000 sezonu simüle et'}</button><label for="replay-season">Gerçek geçmiş</label><select id="replay-season">${state.seasons.slice().sort((a, b) => b.sira - a.sira).map(season => `<option value="${esc(season.id)}" ${inputs.seasonId === season.id ? 'selected' : ''}>Sezon ${season.sira + 1} · ${content.BOSSES.find(b => b.id === season.bossId).ad}</option>`).join('')}</select><button class="secondary wide" type="button" data-action="replay" ${!state.seasons.length || status.simBusy ? 'disabled' : ''}>Seçili sezonu yeniden oynat</button><div id="sim-result">${simulatorResult(status.simResult)}</div></details>
      <section class="settings-card"><h2>Ana ekranından kullan</h2><p>Safari → Paylaş → Ana Ekrana Ekle. İlk alışkanlık ve tikini ana ekran ikonundan oluştur. Her zaman aynı yerden aç.</p></section><div class="version"><span>Kindleborn v${C.VERSION}</span><span>Şema ${C.SCHEMA_VERSION}</span></div><button type="button" class="danger-text wide" data-action="clear">Tüm veriyi kalıcı olarak sil</button>`;
  }
  const images = new Map();
  function load(path, redraw) {
    let image = images.get(path);
    if (!image) { image = new Image(); image.src = path; images.set(path, image); }
    if (!image.complete) image.addEventListener('load', redraw, { once: true });
    return image;
  }
  function align(element) {
    element.style.transform = '';
    const dpr = root.devicePixelRatio || 1, rect = element.getBoundingClientRect();
    // CSS layout rounds lengths to 1/64 px. Correct that rounding at fractional DPR
    // so both the origin and the final bitmap dimensions land on device pixels.
    const width = element.tagName === 'CANVAS' ? element.width / dpr : parseFloat(element.style.width);
    const height = element.tagName === 'CANVAS' ? element.height / dpr : parseFloat(element.style.height);
    element.style.transformOrigin = '0 0';
    element.style.transform = `translate(${(Math.round(rect.left * dpr) - rect.left * dpr) / dpr}px, ${(Math.round(rect.top * dpr) - rect.top * dpr) / dpr}px) scale(${width / rect.width}, ${height / rect.height})`;
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
    const scale = Math.max(1, Math.floor(main.clientWidth * dpr / 120)), pixel = scale / dpr;
    document.documentElement.style.setProperty('--art-pixel', `${pixel}px`);
    document.documentElement.style.setProperty('--art-scale', scale);
    Object.entries(A.ui).forEach(([key, path]) => document.documentElement.style.setProperty(`--${key}`, `url("${path}")`));
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
      image.className = 'pixel effect hurt-effect'; image.dataset.effect = 'hurt'; image.setAttribute('aria-hidden', 'true'); image.alt = '';
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
        const header = document.querySelector('.app-header').getBoundingClientRect().height;
        const nav = document.querySelector('.bottom-nav').getBoundingClientRect().height;
        const height = Math.max(146, Math.floor((root.innerHeight - header - nav - 24) / pixel));
        canvas.width = 120 * scale; canvas.height = height * scale;
        canvas.style.width = `${canvas.width / dpr}px`; canvas.style.height = `${canvas.height / dpr}px`;
        canvas.parentElement.style.height = canvas.style.height;
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
        if (boss.complete && boss.naturalWidth) ctx.drawImage(boss, 12 + offset, 77 + extension - crop);
        if (remaining > 0) {
          const fx = load(frame(A.effects.hit, reduced ? 0 : elapsed), redraw);
          if (fx.complete && fx.naturalWidth) ctx.drawImage(fx, 48, 105 + extension - crop);
        }
        align(canvas);
      }
      document.querySelectorAll('img[data-art], .hurt-effect').forEach(align);
      if (!reduced && (elapsed < 320 || (impact && impact.until > Date.now()))) animationId = root.requestAnimationFrame(paint);
    }
    paint();
  }
  root.RutinViews = Object.freeze({ bossPage, todayPage, mePage, shopPage, historyPage, settingsPage, mount, number, itemEffect });
})(globalThis);
