import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workspace = path.resolve(root, '../..');
const expectedSha = '344a829c4c6dce122f66bd48dfa3392e2231459263749d2d270df98507517027';
const logoPath = path.join(root, 'assets/logo-aglink-ag8-champagne-v2.png');
const centralPath = path.join(workspace, 'assets/branding/aglink/AGLINK-LOGO-OFICIAL-AG8-CHAMPAGNE-V2.png');
const originalPath = path.join(workspace, 'output/AG7-LOGO-RECOVERY-20261113/LOGO-AG8-CHAMPAGNE-V2-ORIGINAL-RELEVO-PLUS.png');
const hash = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');
const html = readFileSync(path.join(root, 'index.html'), 'utf8');
const css = readFileSync(path.join(root, 'aglink-official-brand.css'), 'utf8');

test('AGLink uses only the owner-approved original PNG, byte-identical in all three locations', () => {
  for (const file of [logoPath, centralPath, originalPath]) {
    assert.equal(hash(file), expectedSha, `Logo canonical checksum mismatch: ${file}`);
    const bytes = readFileSync(file);
    assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.equal(bytes.readUInt32BE(16), 1600);
    assert.equal(bytes.readUInt32BE(20), 1241);
    assert.equal(bytes.subarray(25, 26).readUInt8(), 6, 'PNG must be RGBA (color type 6)');
  }
});

test('brand manifest points to exact AG8 V2 and never a rejected redesign', () => {
  const manifest = JSON.parse(readFileSync(path.join(workspace, 'assets/branding/aglink/official-brand.json'), 'utf8'));
  assert.equal(manifest.brand, 'AGLink');
  assert.equal(manifest.official, true);
  assert.equal(manifest.sha256, expectedSha);
  assert.match(manifest.title, /AG8 Champagne V2/);
  assert.deepEqual(manifest.dimensions, [1600, 1241]);
});

test('HTML uses image for official monogram and favicon, never Georgia AG stand-in', () => {
  assert.match(html, /class="monogram monogram--official"/);
  assert.match(html, /<img src="assets\/logo-aglink-ag8-champagne-v2\.png"/);
  assert.match(html, /href="assets\/aglink-favicon\.png"/);
  assert.doesNotMatch(html, /class="monogram"[^>]*>\s*AG\s*</);
  const favicon = readFileSync(path.join(root, 'assets/aglink-favicon.png'));
  assert.equal(favicon.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(favicon.readUInt32BE(16), 256);
  assert.equal(favicon.readUInt32BE(20), 256);
});

test('official mark keeps aspect ratio and is hidden on other account profiles', () => {
  assert.match(css, /\.monogram--official img\s*\{[^}]*object-fit:\s*contain/s);
  assert.match(css, /body\.profile-mode \.monogram--official\s*\{\s*display:\s*none/);
  assert.doesNotMatch(css, /scaleX\(|rotate\(|object-fit:\s*cover/);
  assert.match(html, /href="aglink-official-brand\.css\?v=/);
});

test('glass panel has the final smoke navy/violet tint without modifying the full-bleed portrait', () => {
  assert.match(css, /\.glass-panel\s*\{[\s\S]*?linear-gradient\(147deg, rgba\(41, 52, 78, \.83\)/);
  assert.match(css, /rgba\(53, 44, 79, \.79\)/);
  assert.match(css, /rgba\(31, 51, 81, \.86\)/);
  assert.match(css, /\.glass-panel h1\s*\{[\s\S]*?color: #f4f1f0/);
  assert.doesNotMatch(css, /\.portrait\s*\{|\.portrait-shade\s*\{/);
  assert.match(css, /prefers-reduced-transparency: reduce/);
});
