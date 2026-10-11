(function (root, factory) {
  const config = factory();
  if (typeof module === 'object' && module.exports) module.exports = config;
  else root.RutinConfig = config;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  return Object.freeze({
    VERSION: '1.1.1',
    SCHEMA_VERSION: 2,
    TYPES: Object.freeze(['Güç', 'Zeka', 'Dayanıklılık', 'Odak']),
    DIFFICULTIES: Object.freeze({ 1: 'Kolay', 2: 'Orta', 3: 'Zor' }),
    GAME_CONFIG: Object.freeze({
      puanCarpani: 10, sezonGunu: 14, bossCanKatsayisi: 0.6, zayifTurCarpani: 1.5,
      gunlukVurus: 100 / 14, rMin: 0, rMax: 2, iyilesmeOrani: 0.5, haftalikIyilesmeTavani: 0.2,
      zaferOlcegi: 1.1, olumOlcegi: 0.9,
      kilicBonuslari: Object.freeze([0.05, 0.10, 0.15]), zirhBonuslari: Object.freeze([0.05, 0.10, 0.15]),
      tabanCan: 100, dayaniklilikCan: 5, mukemmelCan: 5, odakCan: 0.5,
      altinOdulu: 100, zaferXp: 200, olumAltinOrani: 0.25, zekaAltin: 0.02, zekaTavan: 0.30,
      seviyeTaban: 100, seviyeArtis: 50
    })
  });
});
