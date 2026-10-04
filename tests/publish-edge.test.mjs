import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const headers = readFileSync('dist/_headers', 'utf8');
const redirects = readFileSync('dist/_redirects', 'utf8');
const sourceHeaders = readFileSync('netlify/_headers', 'utf8');
const sourceRedirects = readFileSync('netlify/_redirects', 'utf8');
const toml = readFileSync('netlify.toml', 'utf8');

function parseTomlPolicy(text) {
  const headers = [], redirects = [];
  let section = null, current = null;
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    if (line === '[[headers]]') { current = { for: null, values: {} }; headers.push(current); section = 'header'; continue; }
    if (line === '[headers.values]') { section = 'header-values'; continue; }
    if (line === '[[redirects]]') { current = { from: null, to: null, status: null }; redirects.push(current); section = 'redirect'; continue; }
    const match = line.match(/^([^=]+?)\s*=\s*(?:"(.*)"|(\d+))$/);
    if (!match || !current) continue;
    const key = match[1].trim(), value = match[2] ?? match[3];
    if (section === 'header') current[key] = value;
    if (section === 'header-values') current.values[key] = value;
    if (section === 'redirect') current[key] = key === 'status' ? Number(value) : value;
  }
  return { headers, redirects };
}
function parseHeaders(text) {
  const rules = []; let current = null;
  for (const raw of text.split('\n')) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    if (!raw.startsWith(' ') && raw.startsWith('/')) { current = { for: raw.trim(), values: {} }; rules.push(current); continue; }
    const match = raw.match(/^\s+([^:]+):\s*(.+)$/);
    if (match && current) current.values[match[1].trim()] = match[2].trim();
  }
  return rules;
}
function parseRedirects(text) {
  return text.split('\n').map((line) => line.trim()).filter((line) => line && !line.startsWith('#')).map((line) => {
    const [from, to, status] = line.split(/\s+/); return { from, to, status: Number(status) };
  });
}
const expected = parseTomlPolicy(toml);
function assertPolicyParity(distHeaders, distRedirects, sourceHeadersText, sourceRedirectsText) {
  assert.deepEqual(parseHeaders(sourceHeadersText), expected.headers, 'netlify/_headers must preserve every netlify.toml header rule/value');
  assert.deepEqual(parseHeaders(distHeaders), expected.headers, 'dist/_headers must preserve every netlify.toml header rule/value');
  assert.deepEqual(parseRedirects(sourceRedirectsText), expected.redirects, 'netlify/_redirects must preserve every netlify.toml redirect/path/status');
  assert.deepEqual(parseRedirects(distRedirects), expected.redirects, 'dist/_redirects must preserve every netlify.toml redirect/path/status');
}
assertPolicyParity(headers, redirects, sourceHeaders, sourceRedirects);
const siteHosts = [/compromisly\.com/i, /sharklancer\.com/i, /marijuanafactcheck/i, /netlify\.app/i, /localhost/i];
for (const [name, text] of [['_headers', headers], ['_redirects', redirects]]) {
  for (const host of siteHosts) assert.doesNotMatch(text, host, `${name} hardcodes a site host`);
  for (const match of text.matchAll(/https?:\/\/[^\s'"]+/g)) assert.ok(toml.includes(match[0]), `${name} introduces absolute URL not already in netlify.toml: ${match[0]}`);
}
function assertPairedMutationFails(label, mutateHeaders = (value) => value, mutateRedirects = (value) => value) {
  assert.throws(() => assertPolicyParity(mutateHeaders(headers), mutateRedirects(redirects), mutateHeaders(sourceHeaders), mutateRedirects(sourceRedirects)), undefined, `${label} must fail even if both copied artifacts are altered`);
}
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
for (const rule of expected.headers) for (const name of Object.keys(rule.values)) {
  assertPairedMutationFails(`remove ${rule.for} ${name}`, (value) => value.replace(new RegExp(`^\\s*${escapeRegExp(name)}:.*\\n?`, 'gm'), ''));
}
assertPairedMutationFails('weaken default-src', (value) => value.replaceAll("default-src 'self'", 'default-src *'));
assertPairedMutationFails('remove frame-ancestors', (value) => value.replaceAll("frame-ancestors 'none'; ", ''));
if (headers.includes('upgrade-insecure-requests')) assertPairedMutationFails('remove upgrade-insecure-requests', (value) => value.replaceAll('; upgrade-insecure-requests', ''));
const first = expected.redirects[0];
assertPairedMutationFails('change redirect status', undefined, (value) => value.replace(new RegExp(`(${escapeRegExp(first.from)}\\s+${escapeRegExp(first.to)}\\s+)${first.status}`), '$1302'));
console.log('Verified semantic Netlify policy parity and paired negative mutations.');
