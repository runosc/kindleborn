// Local preview only. Not part of the PWA; no dependencies or build step.
'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const port = Number(process.env.RUTIN_PORT || 8080);
const content = require('./content.js');
const flatten = value => typeof value === 'string' ? [value] : Object.values(value).flatMap(flatten);
const assetPaths = new Set([...flatten(content.ASSETS), ...content.BOSSES.map(b => b.sprite), ...content.ITEMS.map(i => i.sprite), './assets/fonts/PressStart2P-Regular.ttf'].map(p => p.slice(2)));
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.ttf': 'font/ttf' };
http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch (_) { res.writeHead(400).end(); return; }
  if (pathname === '/') { res.writeHead(302, { Location: '/rutin/' }).end(); return; }
  if (!pathname.startsWith('/rutin/')) { res.writeHead(404).end(); return; }
  const relative = pathname.slice('/rutin/'.length) || 'index.html';
  const file = path.resolve(root, relative);
  const allow = new Set(['index.html', 'style.css', 'config.js', 'app.js', 'derive.js', 'content.js', 'game.js', 'data.js', 'store.js', 'views.js', 'simulator.js', 'sw.js', 'manifest.webmanifest', 'icons/apple-touch-icon.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png']);
  const asset = assetPaths.has(relative);
  if ((!allow.has(relative) && !asset) || !file.startsWith(root + path.sep)) { res.writeHead(404).end(); return; }
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  });
}).listen(port, '127.0.0.1', () => console.log(`Rutin hazır: http://localhost:${port}/rutin/ (Ctrl+C ile durdur)`));
