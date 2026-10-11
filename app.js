/* Rutin v1 — device-local tracker and deterministic RPG. */
(function () {
  'use strict';
  const C = RutinConfig;
  const D = RutinDerive;
  const S = RutinStore;
  const B = RutinData;
  const G = RutinGame, V = RutinViews;
  const $ = selector => document.querySelector(selector);
  const main = $('#main');
  const habitDialog = $('#habit-dialog');
  let state = emptyState();
  function emptyState() { return { habits: [], ticks: [], seasons: [], gunler: [], purchases: [], equips: [], settings: { schemaVersion: 2, karakterAdi: null, oyunAyar: G.validateConfig(C.GAME_CONFIG) } }; }
  let today = D.localDate(new Date());
  let page = 'boss';
  let devOpen = false, simBusy = false, simResult = null, impact = null, configDraft = null;
  let simInputs = { consistency: 80, seed: 'rutin-v1', seasonId: null };
  let editingId = null;
  let busy = false;
  let initialized = false;
  let storageStatus = 'Depolama durumu kontrol ediliyor.';
  let offlineStatus = 'Çevrimdışı hazırlık sürüyor.';
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
    if (error && error.name === 'QuotaExceededError') return 'Cihaz depolaması dolu. Bir yedek alıp yer açmayı dene.';
    return error && error.message ? error.message : 'İşlem tamamlanamadı. Tekrar dene.';
  }
  function refreshDate() {
    const next = D.localDate(new Date());
    const changed = next !== today;
    today = next;
    return changed;
  }
  async function reload() { refreshDate(); state = await S.sync(today, Date.now()); render(); }
  function render() {
    main.setAttribute('aria-busy', String(busy));
    document.querySelectorAll('[data-page]').forEach(button => {
      if (button.dataset.page === page) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    const status = { storageStatus, offlineStatus, devOpen, simBusy, simResult, configDraft, simInputs };
    const views = { boss: V.bossPage, today: V.todayPage, me: V.mePage, shop: V.shopPage, history: V.historyPage, settings: V.settingsPage };
    main.innerHTML = views[page](state, today, status);
    V.mount(state, today, impact);
  }
  function renderSettings() { render(); }
  function openCharacter() {
    $('#character-name').value = state.settings.karakterAdi || '';
    $('#character-error').textContent = '';
    if (!$('#character-dialog').open) $('#character-dialog').showModal();
  }
  function selectedConfig() {
    const form = $('#config-form');
    if (!form.reportValidity()) throw new Error('Denge alanlarını kontrol et.');
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
      if (!seed.trim() || consistency < 0 || consistency > 1 || !Number.isFinite(consistency)) throw new Error('Tutarlılık 0–100 arasında, tohum dolu olmalı.');
      const season = state.seasons.find(item => item.id === $('#replay-season').value);
      if (mode === 'replay' && !season) throw new Error('Henüz sezon yok.');
      const worker = new Worker('./simulator.js');
      configDraft = config;
      simInputs = { consistency: consistency * 100, seed, seasonId: season ? season.id : null };
      simBusy = true; render();
      const result = await new Promise((resolve, reject) => {
        worker.onmessage = event => { worker.terminate(); event.data.error ? reject(new Error(event.data.error)) : resolve(event.data.result); };
        worker.onerror = () => { worker.terminate(); reject(new Error('Simülatör açılamadı. Yeniden dene.')); };
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
    $('#habit-title').textContent = habit ? 'Alışkanlığı düzenle' : 'Yeni alışkanlık';
    $('#habit-name').value = habit ? habit.ad : '';
    $('#habit-type').value = habit ? habit.tur : C.TYPES[0];
    $('#habit-difficulty').value = habit ? habit.zorluk : 2;
    $('#save-habit').textContent = habit ? 'Değişiklikleri kaydet' : 'Alışkanlığı ekle';
    $('#habit-actions').hidden = !habit;
    $('#archive-habit').textContent = habit && habit.arsiv ? 'Arşivden çıkar' : 'Arşivle';
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
    toast('Yedek dosyası hazır. İndirmeler / Dosyalar bölümünü kontrol et.');
  }
  async function shareBackup() {
    const file = backupFile();
    if (!navigator.canShare || !navigator.canShare({ files: [file] }) || !navigator.share) {
      toast('Bu tarayıcı dosya paylaşımını desteklemiyor. JSON yedeğini indir.');
      return;
    }
    try { await navigator.share({ files: [file], title: 'Kindleborn yedeği' }); }
    catch (error) { if (error.name !== 'AbortError') toast('Paylaşım açılamadı. JSON yedeğini indir.'); }
  }
  async function importBackup(file) {
    if (!file || busy) return;
    try {
      if (file.size > 25 * 1024 * 1024) throw new Error('Yedek dosyası 25 MB’tan küçük olmalıdır.');
      refreshDate();
      const restored = B.validateBackup(JSON.parse(await file.text()), today);
      if (!await confirmAction('Yedeği geri yükle?', `${restored.habits.length} alışkanlık, ${restored.ticks.length} tik ve ${restored.seasons.length} sezon yüklenecek. Alışkanlıklar, tikler, sezonlar, gün defteri ve eşyalar dahil mevcut verilerin tamamı silinip bu yedekle değiştirilecek.`, 'Veriyi değiştir')) return;
      if (await mutate(() => S.replaceAll(restored), 'Yedek geri yüklendi.')) { simResult = null; configDraft = null; if (!state.settings.karakterAdi) openCharacter(); }
    } catch (error) { toast(error instanceof SyntaxError ? 'Dosya geçerli bir JSON yedeği değil.' : errorMessage(error)); }
  }
  async function updateStorageStatus(ask = false) {
    try {
      if (!navigator.storage || !navigator.storage.persisted) storageStatus = 'Bu tarayıcı depolama durumunu bildirmiyor.';
      else {
        let persisted = await navigator.storage.persisted();
        if (ask && !persisted && navigator.storage.persist) persisted = await navigator.storage.persist();
        storageStatus = persisted ? 'Kalıcı depolama izni verildi.' : 'Kalıcı depolama izni verilmedi. Yedek almayı unutma.';
      }
    } catch (_) { storageStatus = 'Depolama durumu okunamadı. Yedek almayı unutma.'; }
    if (initialized && page === 'settings') render();
  }
  async function setupWorker() {
    if (!('serviceWorker' in navigator)) {
      offlineStatus = 'Bu tarayıcı çevrimdışı uygulama desteği sunmuyor.';
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
            offlineStatus = 'Çevrimdışı hazırlık tamamlanamadı. İnternete bağlanıp yeniden aç.';
            if (initialized && page === 'settings') render();
          }
        });
      });
      await navigator.serviceWorker.ready;
      offlineStatus = 'Uygulama kabuğu hazır. Çevrimdışı açabilirsin.';
    } catch (_) { offlineStatus = 'Çevrimdışı hazırlık tamamlanamadı. HTTPS veya localhost üzerinden aç.'; }
    if (initialized && page === 'settings') render();
  }
  $('#habit-type').innerHTML = C.TYPES.map(type => `<option>${type}</option>`).join('');
  $('#habit-difficulty').innerHTML = Object.entries(C.DIFFICULTIES).map(([value, name]) => `<option value="${value}">${name} (${value})</option>`).join('');
  $('#close-habit').addEventListener('click', () => { if (!busy) habitDialog.close(); });
  habitDialog.addEventListener('cancel', event => { if (busy) event.preventDefault(); });
  $('#habit-form').addEventListener('submit', async event => {
    event.preventDefault();
    if (busy) return;
    const ad = $('#habit-name').value.trim();
    if (!ad) { $('#habit-error').textContent = 'Bir alışkanlık adı yaz.'; $('#habit-name').focus(); return; }
    refreshDate();
    const old = state.habits.find(habit => habit.id === editingId);
    const habit = {
      id: old ? old.id : S.uid(), ad, tur: $('#habit-type').value,
      zorluk: Number($('#habit-difficulty').value), haftalikHedef: 7,
      olusturma: old ? old.olusturma : today, arsiv: old ? old.arsiv : false
    };
    if (await mutate(() => S.saveHabit(habit, D.localDate(new Date()), Date.now()), old ? 'Değişiklikler kaydedildi. Eski tiklerin bilgisi korundu.' : 'Yeni alışkanlığın hazır.')) habitDialog.close();
  });
  $('#archive-habit').addEventListener('click', async () => {
    const habit = state.habits.find(item => item.id === editingId);
    if (!habit || busy) return;
    if (await mutate(() => S.saveHabit({ ...habit, arsiv: !habit.arsiv }, D.localDate(new Date()), Date.now()), habit.arsiv ? 'Alışkanlık arşivden çıkarıldı.' : 'Arşivlendi. Geçmiş tiklerin korundu.')) habitDialog.close();
  });
  $('#delete-habit').addEventListener('click', async () => {
    const habit = state.habits.find(item => item.id === editingId);
    if (!habit || busy) return;
    if (!await confirmAction('Alışkanlık kalıcı olarak silinsin mi?', `“${habit.ad}” ve ona ait tüm tikler silinecek. Bu işlem geri alınamaz.`, 'Kalıcı olarak sil')) return;
    if (await mutate(() => S.deleteHabit(habit.id, D.localDate(new Date()), Date.now()), 'Alışkanlık ve tikleri silindi.')) habitDialog.close();
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
      }, added => added ? 'Tik kaydedildi. Boss hasar aldı.' : 'Tik geri alındı. Hasar geri çevrildi.');
    }
    if (action === 'rename') openCharacter();
    if (action === 'today-page') { page = 'today'; render(); }
    if (action === 'settings') { page = 'settings'; render(); }
    if (action === 'close-season') await mutate(() => S.closeSeason(D.localDate(new Date()), Date.now()), 'Sezon kapandı. Yeni mücadele tam canla başlıyor.');
    if (action === 'buy') await mutate(() => S.purchase(id, D.localDate(new Date()), Date.now()), 'Eşya satın alındı. Dilediğinde kuşanabilirsin.');
    if (action === 'equip') await mutate(() => S.equip(id, D.localDate(new Date()), Date.now()), 'Eşya kuşanıldı.');
    if (action === 'reset-config') await mutate(async () => { await S.saveSettings({ oyunAyar: G.validateConfig(C.GAME_CONFIG) }); configDraft = null; }, 'Varsayılan ayarlar yeni sezonlara uygulanacak.');
    if (action === 'simulate') await runSimulator('synthetic');
    if (action === 'replay') await runSimulator('replay');
    if (action === 'download') { await reload(); downloadBackup(); }
    if (action === 'share') await shareBackup(); // Keep the file share within the user gesture (iOS).
    if (action === 'import') $('#backup-file').click();
    if (action === 'persist') { await updateStorageStatus(true); toast(storageStatus); }
    if (action === 'clear' && await confirmAction('Tüm veriyi sil?', 'Bu cihazdaki bütün alışkanlıklar, tikler, sezonlar, gün defteri ve eşyalar kalıcı olarak silinecek. Geri almak için JSON yedeğin gerekir.', 'Tüm veriyi sil')) {
      if (await mutate(() => S.replaceAll(emptyState()), 'Bütün veriler silindi.')) { simResult = null; configDraft = null; page = 'boss'; render(); openCharacter(); }
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
    page = button.dataset.page;
    await reload();
    window.scrollTo({ top: 0, behavior: 'instant' });
    main.focus({ preventScroll: true });
  }));
  $('#update-button').addEventListener('click', () => {
    if (busy || !registration || !registration.waiting) return;
    $('#update-button').disabled = true;
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  });
  window.addEventListener('rutin-db-blocked', () => toast('Diğer Kindleborn sekmelerini kapatıp bu sayfayı yeniden aç.'));
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState !== 'visible' || !initialized || busy) return;
    refreshDate();
    try { await reload(); } catch (error) { toast(errorMessage(error)); }
    if (registration && navigator.onLine) registration.update().catch(() => {});
  });
  setInterval(async () => {
    if (initialized && !busy && refreshDate()) {
      try { await reload(); toast('Yeni gün başladı. Önceki gün deftere kapandı.'); }
      catch (error) { toast(errorMessage(error)); }
    }
  }, 1000);
  main.addEventListener('toggle', event => { if (event.target.id === 'developer') devOpen = event.target.open; }, true);
  main.addEventListener('submit', async event => {
    if (event.target.id !== 'config-form') return;
    event.preventDefault();
    try { const config = selectedConfig(); await mutate(async () => { await S.saveSettings({ oyunAyar: config }); configDraft = null; }, 'Ayarlar yalnız yeni sezonlara uygulanacak.'); }
    catch (error) { toast(errorMessage(error)); }
  });
  $('#character-dialog').addEventListener('cancel', event => { if (!state.settings.karakterAdi || busy) event.preventDefault(); });
  $('#character-form').addEventListener('submit', async event => {
    event.preventDefault();
    const name = $('#character-name').value.trim();
    if (!name) { $('#character-error').textContent = 'Bir karakter adı yaz.'; return; }
    if (await mutate(() => S.saveSettings({ karakterAdi: name }), 'Karakterin hazır.')) $('#character-dialog').close();
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
      main.innerHTML = `<div class="empty"><h1>Veriler açılamadı.</h1><p>${esc(errorMessage(error))}</p><p>Safari’nin normal modunda, HTTPS veya localhost üzerinden yeniden aç.</p><button type="button" class="primary wide" id="retry-open">Tekrar dene</button></div>`;
      $('#retry-open').addEventListener('click', () => location.reload());
    }
    setupWorker();
  }
  start();
})();
