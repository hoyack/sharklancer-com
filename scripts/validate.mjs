import fs from 'node:fs';
import path from 'node:path';
import { HtmlValidate } from 'html-validate';

const root = path.resolve(process.cwd(), process.argv[2] ?? '.');
const pages = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', '.lighthouseci', 'playwright-report', 'test-results', 'dist'].includes(entry.name)) continue;
    const item = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(item);
    else if (entry.name.endsWith('.html')) pages.push(item);
  }
};
walk(root);

const validator = new HtmlValidate({
  extends: ['html-validate:recommended'],
  rules: { 'no-inline-style': 'error', 'wcag/h37': 'error', 'require-sri': 'off' },
});
const errors = [];
for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8');
  const report = await validator.validateString(html, page);
  if (!report.valid) {
    errors.push(...report.results.flatMap((result) => result.messages.map(
      (message) => `${path.relative(root, page)}:${message.line}:${message.column} ${message.message}`,
    )));
  }
  for (const match of html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)) {
    const url = match[1];
    if (/^(https?:|mailto:|tel:|data:)/.test(url) || url === '/book') continue;
    let target = url.startsWith('/') ? path.join(root, url) : path.resolve(path.dirname(page), url);
    if (url.endsWith('/')) target = path.join(target, 'index.html');
    if (!fs.existsSync(target)) errors.push(`${path.relative(root, page)} broken local reference: ${url}`);
  }
}
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const checks = [
  ['one H1', (home.match(/<h1(?:\s|>)/g) || []).length === 1],
  ['locked CTA', home.includes('Book a Thunderstaff pilot call')],
  ['inbound positioning', home.includes('inbound')],
  ['Hoyack ownership', home.includes('© 2026 Hoyack')],
  ['source metadata', home.includes('utm_source=sharklancer')],
  ['no inline styles', !home.includes('style=')],
];
for (const [name, ok] of checks) if (!ok) errors.push(`required check failed: ${name}`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Validated ${pages.length} HTML pages, local references, and ${checks.length} locked requirements.`);
