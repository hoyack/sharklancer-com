import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const headers = readFileSync('dist/_headers', 'utf8');
const redirects = readFileSync('dist/_redirects', 'utf8');
const toml = readFileSync('netlify.toml', 'utf8');

assert.equal(headers, readFileSync('netlify/_headers', 'utf8'), 'dist/_headers must match the committed source copy');
assert.equal(redirects, readFileSync('netlify/_redirects', 'utf8'), 'dist/_redirects must match the committed source copy');

const siteHosts = [/compromisly\.com/i, /sharklancer\.com/i, /marijuanafactcheck/i, /netlify\.app/i, /localhost/i];
for (const [name, text] of [['_headers', headers], ['_redirects', redirects]]) {
  for (const host of siteHosts) assert.doesNotMatch(text, host, `${name} hardcodes a site host`);
  for (const match of text.matchAll(/https?:\/\/[^\s'"]+/g)) {
    assert.ok(toml.includes(match[0]), `${name} introduces absolute URL not already in netlify.toml: ${match[0]}`);
  }
}

const rules = redirects.split('\n').map((line) => line.trim()).filter((line) => line && !line.startsWith('#'));
assert.deepEqual(rules, ['/book   /book/   301']);
for (const rule of rules) {
  const [from, to] = rule.split(/\s+/);
  assert.match(from, /^\//, `${rule}: from must be a path`);
  assert.match(to, /^\//, `${rule}: to must be a path`);
  assert.doesNotMatch(to, /:\/\//, `${rule}: redirect target must not be an absolute URL`);
}
assert.match(headers, /form-action 'self' https:\/\/calendly\.com/);
assert.doesNotMatch(redirects, /calendly\.com/);
console.log('Verified portable dist/_headers and dist/_redirects (not hosted acceptance).');
