'use strict';
// Curated publication files: no backups, raw art, previews, prompts or QA artifacts.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const context = { self: { registration: { scope: 'https://kindleborn.test/' }, addEventListener() {} }, URL };
vm.runInNewContext(fs.readFileSync(path.join(root, 'sw.js'), 'utf8') + '\nglobalThis.shell = SHELL;', context);
const files = [...new Set([...Array.from(context.shell).map(p => p === './' ? 'index.html' : p.replace(/^\.\//, '')),
  'sw.js', '.gitignore', '.nojekyll', 'README.md', 'notes/rutin-v1-2-rapor.md', 'tests.js', 'serve.js',
  'tools/release-files.cjs', 'assets/fonts/OFL.txt', 'assets/paletler/endesga-32.hex',
  'assets/uygulama_ikonu/hazir/icon-192.png', 'assets/uygulama_ikonu/hazir/icon-512.png',
  'assets/uygulama_ikonu/hazir/apple-touch-icon-180.png',
  'assets/ui/ui_kiti_v01.json', 'assets/ui/README.md'])].sort();
for (const file of files) {
  const absolute = path.resolve(root, file);
  if (!absolute.startsWith(root + path.sep) || /_x6|zemin_kontrol|(?:^|\/)ham\/|atlas|prompt|(?:^|\/)tmp\/|(?:^|\/)\.qa\/|yedek/i.test(file)) throw new Error(`Yayına uygun olmayan dosya: ${file}`);
  if (!fs.statSync(absolute).isFile()) throw new Error(`Dosya bulunamadı: ${file}`);
}
if (process.argv.includes('--stage')) {
  execFileSync('git', ['add', '--', ...files], { cwd: root, stdio: 'inherit', windowsHide: true });
  const staged = execFileSync('git', ['diff', '--cached', '--name-only', '-z'], { cwd: root, encoding: 'utf8', windowsHide: true }).split('\0').filter(Boolean);
  for (const file of staged) if (!files.includes(file)) throw new Error(`Beklenmeyen staged dosya; commit yapmadan kontrol et: ${file}`);
  console.log(`${staged.length} yayın dosyası Git için hazır.`);
} else if (process.argv.includes('--json')) {
  console.log(JSON.stringify(files));
} else {
  console.log(`${files.length} yayın dosyası, ${files.reduce((n,f) => n + fs.statSync(path.join(root,f)).size, 0)} bayt.`);
}
