(function (root, factory) {
  const derive = factory();
  if (typeof module === 'object' && module.exports) module.exports = derive;
  else root.RutinDerive = derive;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  // Calendar arithmetic deliberately uses local noon, never UTC parsing or ISO conversion.
  function localDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  function parseDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('Geçersiz tarih.');
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day, 12);
    if (year < 1000 || localDate(date) !== value) throw new Error('Geçersiz tarih.');
    return date;
  }
  function isDate(value) {
    try { parseDate(value); return true; } catch (_) { return false; }
  }
  function addDays(value, amount) {
    const date = parseDate(value);
    date.setDate(date.getDate() + amount);
    return localDate(date);
  }
  function weekStart(value) {
    const date = parseDate(value);
    return addDays(value, -((date.getDay() + 6) % 7));
  }
  function canTick(habit, date, today) {
    return isDate(date) && isDate(today) && !habit.arsiv && date <= today;
  }
  function tickSnapshot(habit) {
    return { tur: habit.tur, zorluk: habit.zorluk, haftalikHedef: habit.haftalikHedef };
  }
  function weekProgress(habit, ticks, date, throughDate = date) {
    const start = weekStart(date);
    const end = addDays(start, 6);
    const inWeek = ticks.filter(tick => tick.habitId === habit.id && tick.tarih >= start && tick.tarih <= end && tick.tarih <= throughDate);
    // One day counts once, even when inspecting untrusted data outside the importer.
    const count = new Set(inWeek.map(tick => tick.tarih)).size;
    const latest = inWeek.slice().sort((a, b) => b.tarih.localeCompare(a.tarih) || b.ts - a.ts)[0];
    const target = latest ? latest.snapshot.haftalikHedef : habit.haftalikHedef;
    return { start, end, count, target, percent: Math.min(100, Math.round(count / target * 100)) };
  }
  function historyWeeks(habits, ticks, today, amount = 8) {
    const current = weekStart(today);
    return Array.from({ length: amount }, (_, index) => {
      const start = addDays(current, -7 * index);
      const end = addDays(start, 6);
      return {
        start, end,
        habits: habits.map(habit => {
          const progress = weekProgress(habit, ticks, start, today);
          return { habit, available: habit.olusturma <= end || progress.count > 0, ...progress };
        })
      };
    });
  }
  function dayProgress(habits, ticks, date, today) {
    const eligible = habits.filter(habit => canTick(habit, date, today));
    const done = eligible.filter(habit => ticks.some(tick => tick.habitId === habit.id && tick.tarih === date)).length;
    return { done, total: eligible.length, percent: eligible.length ? Math.round(done / eligible.length * 100) : 0 };
  }
  return Object.freeze({ localDate, parseDate, isDate, addDays, weekStart, canTick, tickSnapshot, weekProgress, historyWeeks, dayProgress });
});
