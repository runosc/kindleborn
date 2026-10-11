/* Rutin v1 — device-local tracker and deterministic RPG. */
(function () {
  'use strict';
  const C = RutinConfig;
  const D = RutinDerive;
  const S = RutinStore;
  const B = RutinData;
  const G = RutinGame, V = RutinViews;
  const $ = selector => document.querySelector(selector);
  document.querySelectorAll('[data-text]').forEach(el => { el.textContent = RutinContent.TEXT[el.dataset.text]; });
  document.querySelectorAll('[data-label]').forEach(el => { el.setAttribute('aria-label', RutinContent.TEXT[el.dataset.label]); });
  document.querySelectorAll('[data-copy]').forEach(el => { el.textContent = RutinContent.COPY[el.dataset.copy]; });
  for (const attr of ['aria-label','placeholder']) document.querySelectorAll('[data-copy-' + attr + ']').forEach(el => { el.setAttribute(attr,RutinContent.COPY[el.getAttribute('data-copy-' + attr)]); });
  const main = $('#main');
  const habitDialog = $('#habit-dialog');
  let state = emptyState();
  function emptyState() { return { habits: [], ticks: [], seasons: [], gunler: [], purchases: [], equips: [], settings: { schemaVersion: 2, karakterAdi: null, oyunAyar: G.validateConfig(C.GAME_CONFIG) } }; }
  let today = D.localDate(new Date());
  let page = 'boss', meTab = 'items', lastItemId = null, historyDate = null;
  let devOpen = false, simBusy = false, simResult = null, impact = null, configDraft = null;
  let simInputs = { consistency: 80, seed: 'rutin-v1', seasonId: null };
  let editingId = null;
  let busy = false;
  let initialized = false;
  let renderedKey = null;
  let storageStatus = RutinContent.COPY.copy052;
  let offlineStatus = RutinContent.COPY.copy053;
  let registration;
  let toastTimer;
  function esc(value) {
    return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  }
  function toast(message) {
    const element = $('#toast');
    clearTimeout(toastTimer);
    element.textContent = message;
    element.hidden = false;
    toastTimer = setTimeout(() => { element.hidden = true; }, 5000);
  }
  function errorMessage(error) {
    if (error && error.name === 'QuotaExceededError') return RutinContent.COPY.copy054;
    return error && error.message ? error.message : RutinContent.COPY.copy055;
  }
  function refreshDate() {
    const next = D.localDate(new Date());
    const changed = next !== today;
    today = next;
    return changed;
  }
  async function reload() { refreshDate(); state = await S.sync(today, Date.now()); render(); }
  function render() {
    const key = page + ':' + (page === 'me' ? meTab : '');
    const scrolls = renderedKey === key ? ['#main','.me-content','.habit-scroll','.streak-list','.season-list'].map(selector => [selector, document.querySelector(selector)?.scrollTop || 0]) : [];
    main.setAttribute('aria-busy', String(busy));
    document.querySelectorAll('[data-page]').forEach(button => {
      if (button.dataset.page === page) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    const status = { meTab, lastItemId, historyDate, storageStatus, offlineStatus, devOpen, simBusy, simResult, configDraft, simInputs };
    const views = { boss: V.bossPage, today: V.todayPage, me: V.mePage, shop: V.shopPage, history: V.historyPage, settings: V.settingsPage };
    main.className = page === 'boss' ? 'main-battle' : page === 'me' ? 'main-me' : 'page-scroll';
    main.innerHTML = views[page](state, today, status);
    V.mount(state, today, impact);
    scrolls.forEach(([selector, top]) => { const element = document.querySelector(selector); if (element) element.scrollTop = top; });
    renderedKey = key;
  }
  function renderSettings() { render(); }
  function openCharacter() {
    $('#character-name').value = state.settings.karakterAdi || '';
    $('#character-error').textContent = '';
    if (!$('#character-dialog').open) $('#character-dialog').showModal();
  }
  function selectedConfig() {
    const form = $('#config-form');
    if (!form.reportValidity()) throw new Error(RutinContent.COPY.copy056);
    const config = {};
    for (const key of Object.keys(C.GAME_CONFIG)) {
      const input = form.elements.namedItem(key);
      config[key] = Array.isArray(C.GAME_CONFIG[key]) ? input.value.split(',').map(value => Number(value.trim())) : Number(input.value);
    }
    return G.validateConfig(config);
  }
  async function runSimulator(mode) {
    if (simBusy) return;
    try {
      const config = selectedConfig();
      const consistency = Number($('#consistency').value) / 100;
      const seed = $('#sim-seed').value;
      if (!seed.trim() || consistency < 0 || consistency > 1 || !Number.isFinite(consistency)) throw new Error(RutinContent.COPY.copy057);
      const season = state.seasons.find(item => item.id === $('#replay-season').value);
      if (mode === 'replay' && !season) throw new Error(RutinContent.COPY.copy058);
      const worker = new Worker('./simulator.js');
      configDraft = config;
      simInputs = { consistency: consistency * 100, seed, seasonId: season ? season.id : null };
      simBusy = true; render();
      const result = await new Promise((resolve, reject) => {
        worker.onmessage = event => { worker.terminate(); event.data.error ? reject(new Error(event.data.error)) : resolve(event.data.result); };
        worker.onerror = () => { worker.terminate(); reject(new Error(RutinContent.COPY.copy059)); };
        worker.postMessage({ mode, config, consistency, seed, state, season, today });
      });
      simResult = result;
    } catch (error) { toast(errorMessage(error)); }
    finally { simBusy = false; if (page === 'settings') render(); }
  }
  async function mutate(work, success) {
    if (busy) return false;
    busy = true;
    main.setAttribute('aria-busy', 'true');
    const focusAction = document.activeElement && document.activeElement.dataset.action;
    const focusId = document.activeElement && document.activeElement.dataset.id;
    const buttons = [...main.querySelectorAll('button'), ...habitDialog.querySelectorAll('button')];
    const enabled = buttons.filter(button => !button.disabled);
    enabled.forEach(button => { button.disabled = true; });
    try {
      refreshDate();
      state = await S.sync(today, Date.now());
      const result = await work();
      await reload();
      if (success) toast(typeof success === 'function' ? success(result) : success);
      if (focusAction) [...main.querySelectorAll('button')].find(button => button.dataset.action === focusAction && button.dataset.id === focusId)?.focus({ preventScroll: true });
      return true;
    } catch (error) {
      toast(errorMessage(error));
      return false;
    } finally {
      busy = false;
      main.setAttribute('aria-busy', 'false');
      enabled.forEach(button => { button.disabled = false; });
    }
  }
  function openHabit(id) {
    if (busy) return;
    const habit = state.habits.find(item => item.id === id);
    editingId = habit ? id : null;
    $('#habit-title').textContent = habit ? RutinContent.COPY.copy060 : RutinContent.COPY.copy061;
    $('#habit-name').value = habit ? habit.ad : '';
    $('#habit-type').value = habit ? habit.tur : C.TYPES[0];
    $('#habit-difficulty').value = habit ? habit.zorluk : 2;
    $('#save-habit').textContent = habit ? RutinContent.COPY.copy062 : RutinContent.COPY.copy063;
    $('#habit-actions').hidden = !habit;
    $('#archive-habit').textContent = habit && habit.arsiv ? RutinContent.COPY.copy064 : RutinContent.COPY.copy065;
    $('#delete-habit').hidden = Boolean(habit && !G.canDeleteHabit(habit.id, state.ticks));
    $('#habit-error').textContent = '';
    habitDialog.showModal();
  }
  function confirmAction(title, description, label) {
    const dialog = $('#confirm-dialog');
    $('#confirm-title').textContent = title;
    $('#confirm-description').textContent = description;
    $('#confirm-yes').textContent = label;
    dialog.returnValue = 'cancel';
    return new Promise(resolve => {
      dialog.addEventListener('close', () => resolve(dialog.returnValue === 'confirm'), { once: true });
      dialog.showModal();
    });
  }
  function backupFile() {
    return new File([B.makeBackup(state)], `kindleborn-yedek-${today}.json`, { type: 'application/json' });
  }
  function downloadBackup() {
    const file = backupFile();
    const url = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = file.name;
    document.body.append(anchor); anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    toast(RutinContent.COPY.copy066);
  }
  async function shareBackup() {
    const file = backupFile();
    if (!navigator.canShare || !navigator.canShare({ files: [file] }) || !navigator.share) {
      toast(RutinContent.COPY.copy067);
      return;
    }
    try { await navigator.share({ files: [file], title: RutinContent.COPY.copy068 }); }
    catch (error) { if (error.name !== 'AbortError') toast(RutinContent.COPY.copy069); }
  }
  async function importBackup(file) {
    if (!file || busy) return;
    try {
      if (file.size > 25 * 1024 * 1024) throw new Error(RutinContent.COPY.copy070);
      refreshDate();
      const restored = B.validateBackup(JSON.parse(await file.text()), today);
      if (!await confirmAction(RutinContent.COPY.copy071, RutinContent.interpolate('app001', [restored.habits.length, restored.ticks.length, restored.seasons.length]), RutinContent.COPY.copy072)) return;
      if (await mutate(() => S.replaceAll(restored), RutinContent.COPY.copy073)) { simResult = null; configDraft = null; if (!state.settings.karakterAdi) openCharacter(); }
    } catch (error) { toast(error instanceof SyntaxError ? RutinContent.COPY.copy074 : errorMessage(error)); }
  }
  async function updateStorageStatus(ask = false) {
    try {
      if (!navigator.storage || !navigator.storage.persisted) storageStatus = RutinContent.COPY.copy075;
      else {
        let persisted = await navigator.storage.persisted();
        if (ask && !persisted && navigator.storage.persist) persisted = await navigator.storage.persist();
        storageStatus = persisted ? RutinContent.COPY.copy076 : RutinContent.COPY.copy077;
      }
    } catch (_) { storageStatus = RutinContent.COPY.copy078; }
    if (initialized && page === 'settings') render();
  }
  async function setupWorker() {
    if (!('serviceWorker' in navigator)) {
      offlineStatus = RutinContent.COPY.copy079;
      return;
    }
    const showWaiting = () => {
      if (registration.waiting && navigator.serviceWorker.controller) $('#update-banner').hidden = false;
    };
    let hasControlled = Boolean(navigator.serviceWorker.controller);
    let reloading = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (hasControlled && !reloading) { reloading = true; location.reload(); }
      hasControlled = true;
    });
    try {
      registration = await navigator.serviceWorker.register('./sw.js', { scope: './', updateViaCache: 'none' });
      showWaiting();
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        if (worker) worker.addEventListener('statechange', () => {
          if (worker.state === 'installed') showWaiting();
          if (worker.state === 'redundant') {
            offlineStatus = RutinContent.COPY.copy080;
            if (initialized && page === 'settings') render();
          }
        });
      });
      await navigator.serviceWorker.ready;
      offlineStatus = RutinContent.COPY.copy081;
    } catch (_) { offlineStatus = RutinContent.COPY.copy082; }
    if (initialized && page === 'settings') render();
  }
  $('#habit-type').innerHTML = C.TYPES.map(type => RutinContent.interpolate('app002', [type])).join('');
  $('#habit-difficulty').innerHTML = Object.entries(RutinContent.DIFFICULTY_LABELS).map(([value, name]) => RutinContent.interpolate('app003', [value, name, value])).join('');
  $('#close-habit').addEventListener('click', () => { if (!busy) habitDialog.close(); });
  habitDialog.addEventListener('cancel', event => { if (busy) event.preventDefault(); });
  $('#habit-form').addEventListener('submit', async event => {
    event.preventDefault();
    if (busy) return;
    const ad = $('#habit-name').value.trim();
    if (!ad) { $('#habit-error').textContent = RutinContent.COPY.copy083; $('#habit-name').focus(); return; }
    refreshDate();
    const old = state.habits.find(habit => habit.id === editingId);
    const habit = {
      id: old ? old.id : S.uid(), ad, tur: $('#habit-type').value,
      zorluk: Number($('#habit-difficulty').value), haftalikHedef: 7,
      olusturma: old ? old.olusturma : today, arsiv: old ? old.arsiv : false
    };
    if (await mutate(() => S.saveHabit(habit, D.localDate(new Date()), Date.now()), old ? RutinContent.COPY.copy084 : RutinContent.COPY.copy085)) habitDialog.close();
  });
  $('#archive-habit').addEventListener('click', async () => {
    const habit = state.habits.find(item => item.id === editingId);
    if (!habit || busy) return;
    if (await mutate(() => S.saveHabit({ ...habit, arsiv: !habit.arsiv }, D.localDate(new Date()), Date.now()), habit.arsiv ? RutinContent.COPY.copy086 : RutinContent.COPY.copy087)) habitDialog.close();
  });
  $('#delete-habit').addEventListener('click', async () => {
    const habit = state.habits.find(item => item.id === editingId);
    if (!habit || busy) return;
    if (!await confirmAction(RutinContent.COPY.copy088, RutinContent.interpolate('app004', [habit.ad]), RutinContent.COPY.copy089)) return;
    if (await mutate(() => S.deleteHabit(habit.id, D.localDate(new Date()), Date.now()), RutinContent.COPY.copy090)) habitDialog.close();
  });
  main.addEventListener('click', async event => {
    const button = event.target.closest('button[data-action]');
    if (!button || button.disabled || busy || !initialized) return;
    const action = button.dataset.action;
    const id = button.dataset.id;
    refreshDate();
    if (action === 'add') openHabit();
    if (action === 'edit') openHabit(id);
    if (action === 'tick') {
      const season = state.seasons.find(item => !item.sonuc);
      const before = season ? G.evaluateSeason(state, season, today).bossHp : 0;
      await mutate(async () => {
        const added = await S.toggleTick(id, D.localDate(new Date()), D.localDate(new Date()), Date.now());
        const fresh = await S.readAll();
        const current = fresh.seasons.find(item => !item.sonuc);
        const after = current ? G.evaluateSeason(fresh, current, today).bossHp : before;
        if (added) impact = { amount: Math.max(0, before - after), until: Date.now() + 650 };
        else impact = null;
        return added;
      }, added => added ? RutinContent.COPY.copy091 : RutinContent.COPY.copy092);
    }
    if (action === 'calendar-day') { historyDate = button.dataset.date; render(); main.querySelector(`[data-date="${historyDate}"]`)?.focus({preventScroll:true}); }
    if (action === 'me-tab') { meTab = button.dataset.tab; render(); main.querySelector(`[data-tab="${meTab}"]`)?.focus({ preventScroll: true }); }
    if (action === 'inventory' || action === 'unequip') {
      const item = RutinContent.ITEMS.find(item => item.id === id);
      const slot = action === 'unequip' ? button.dataset.slot : item && G.slotFor(item);
      const gear = G.equipmentAt(state.equips, G.dayEnd(today));
      if (item) lastItemId = item.id;
      const removal = action === 'unequip' || gear[slot]?.id === id;
      if (removal && !gear[slot]) return;
      await mutate(() => removal ? S.unequip(slot,today,Date.now()) : S.equip(id,today,Date.now()), removal ? RutinContent.TEXT.unequippedToast : RutinContent.TEXT.equippedToast);
    }
    if (action === 'rename') openCharacter();
    if (action === 'today-page') { page = 'boss'; render(); }
    if (action === 'settings') { page = 'settings'; render(); }
    if (action === 'close-season') await mutate(() => S.closeSeason(D.localDate(new Date()), Date.now()), RutinContent.COPY.copy093);
    if (action === 'buy') await mutate(() => S.purchase(id, D.localDate(new Date()), Date.now()), RutinContent.COPY.copy094);
    if (action === 'equip') await mutate(() => S.equip(id, D.localDate(new Date()), Date.now()), RutinContent.TEXT.equippedToast);
    if (action === 'reset-config') await mutate(async () => { await S.saveSettings({ oyunAyar: G.validateConfig(C.GAME_CONFIG) }); configDraft = null; }, RutinContent.COPY.copy095);
    if (action === 'simulate') await runSimulator('synthetic');
    if (action === 'replay') await runSimulator('replay');
    if (action === 'download') { await reload(); downloadBackup(); }
    if (action === 'share') await shareBackup(); // Keep the file share within the user gesture (iOS).
    if (action === 'import') $('#backup-file').click();
    if (action === 'persist') { await updateStorageStatus(true); toast(storageStatus); }
    if (action === 'clear' && await confirmAction(RutinContent.COPY.copy096, RutinContent.COPY.copy097, RutinContent.COPY.copy098)) {
      if (await mutate(() => S.replaceAll(emptyState()), RutinContent.COPY.copy099)) { simResult = null; configDraft = null; page = 'boss'; render(); openCharacter(); }
    }
  });
  main.addEventListener('change', event => {
    if (event.target.id !== 'backup-file') return;
    const file = event.target.files[0];
    event.target.value = '';
    importBackup(file);
  });
  document.querySelectorAll('[data-page]').forEach(button => button.addEventListener('click', async () => {
    if (!initialized || busy || page === button.dataset.page) return;
    const target = button.dataset.page;
    page = target === 'today' ? 'boss' : target === 'history' ? 'me' : target;
    if (target === 'history') meTab = 'history';
    await reload();
    window.scrollTo({ top: 0, behavior: 'instant' });
    main.focus({ preventScroll: true });
  }));
  $('#update-button').addEventListener('click', () => {
    if (busy || !registration || !registration.waiting) return;
    $('#update-button').disabled = true;
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  });
  window.addEventListener('rutin-db-blocked', () => toast(RutinContent.COPY.copy100));
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState !== 'visible' || !initialized || busy) return;
    refreshDate();
    try { await reload(); } catch (error) { toast(errorMessage(error)); }
    if (registration && navigator.onLine) registration.update().catch(() => {});
  });
  setInterval(async () => {
    if (initialized && !busy && refreshDate()) {
      try { await reload(); toast(RutinContent.COPY.copy101); }
      catch (error) { toast(errorMessage(error)); }
    }
  }, 1000);
  main.addEventListener('toggle', event => { if (event.target.id === 'developer') devOpen = event.target.open; }, true);
  main.addEventListener('submit', async event => {
    if (event.target.id !== 'config-form') return;
    event.preventDefault();
    try { const config = selectedConfig(); await mutate(async () => { await S.saveSettings({ oyunAyar: config }); configDraft = null; }, RutinContent.COPY.copy102); }
    catch (error) { toast(errorMessage(error)); }
  });
  $('#character-dialog').addEventListener('cancel', event => { if (!state.settings.karakterAdi || busy) event.preventDefault(); });
  $('#character-form').addEventListener('submit', async event => {
    event.preventDefault();
    const name = $('#character-name').value.trim();
    if (!name) { $('#character-error').textContent = RutinContent.COPY.copy103; return; }
    if (await mutate(() => S.saveSettings({ karakterAdi: name }), RutinContent.COPY.copy104)) $('#character-dialog').close();
  });
  $('#onboard-import').addEventListener('click', () => { $('#character-dialog').close(); page = 'settings'; render(); });
  window.addEventListener('resize', () => { if (initialized) V.mount(state, today, impact); });
  document.fonts.ready.then(() => { if (initialized) V.mount(state, today, impact); });
  async function start() {
    try {
      const { firstRun } = await S.open();
      // Request persistence on the first opening; denial never blocks usage.
      await updateStorageStatus(firstRun);
      await S.ensureSettings();
      state = await S.sync(today, Date.now());
      initialized = true;
      render();
      if (!state.settings.karakterAdi) openCharacter();
    } catch (error) {
      main.setAttribute('aria-busy', 'false');
      main.innerHTML = RutinContent.interpolate('app005', [esc(errorMessage(error))]);
      $('#retry-open').addEventListener('click', () => location.reload());
    }
    setupWorker();
  }
  start();
})();
