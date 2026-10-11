'use strict';
importScripts('./config.js', './content.js', './derive.js', './game.js');
self.onmessage = event => {
  try {
    const task = event.data;
    const result = task.mode === 'synthetic'
      ? RutinGame.simulateSynthetic(task.config, task.consistency, 1000, task.seed)
      : RutinGame.replay(task.state, task.season, task.config, task.today);
    self.postMessage({ result });
  } catch (error) { self.postMessage({ error: error.message }); }
};
