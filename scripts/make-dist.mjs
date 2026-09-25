// Copies the finished site into dist/ so a host (Vercel, Netlify, GitHub Pages...) can publish just that folder,
// without node_modules, markdown sources or build scripts.
//
// Runs as the last step of `npm run build`. The site is: every .html page at the project root,
// favicon.ico, robots.txt and assets/.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

// Files that are only sources or originals and are not used by any page.
const SKIP = new Set(['assets/images/YJ.png']);

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

const pages = fs.readdirSync(root).filter((name) => name.endsWith('.html'));
for (const name of [...pages, 'favicon.ico', 'robots.txt']) {
    if (fs.existsSync(path.join(root, name))) fs.copyFileSync(path.join(root, name), path.join(dist, name));
}

fs.cpSync(path.join(root, 'assets'), path.join(dist, 'assets'), {
    recursive: true,
    filter: (src) => !SKIP.has(path.relative(root, src).split(path.sep).join('/')),
});

const count = (dir) => fs.readdirSync(dir, { withFileTypes: true }).reduce((n, e) => n + (e.isDirectory() ? count(path.join(dir, e.name)) : 1), 0);
console.log(`dist built: ${pages.length} pages, ${count(dist)} files total`);
