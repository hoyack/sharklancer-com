import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
for (const item of ['index.html', 'robots.txt', 'sitemap.xml', 'assets', 'privacy', 'terms', 'disclosure']) {
  fs.cpSync(path.join(root, item), path.join(dist, item), { recursive: true });
}
console.log('Built deployable static artifact in dist/.');
