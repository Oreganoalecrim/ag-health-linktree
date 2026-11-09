import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (name) => readFileSync(path.join(root, name), 'utf8');
const html = read('index.html');
const css = read('styles.css');
const app = read('app.js');
const sandbox = { window: {} };
vm.runInNewContext(read('config.js'), sandbox);
const config = sandbox.window.LINKTREE_CONFIG;

test('preserves exactly six official destination cards', () => {
  assert.equal(config.links.length, 6);
  assert.ok(config.links.every(({ title, url }) => title && url.startsWith('https://')));
});

test('preserves four active social links and disabled Spotify', () => {
  const active = config.socials.filter((item) => !item.disabled);
  const spotify = config.socials.find((item) => item.label === 'Spotify');
  assert.equal(active.length, 4);
  assert.deepEqual(Array.from(active, (item) => item.label), ['Instagram', 'YouTube', 'WhatsApp', 'LinkedIn']);
  assert.equal(spotify?.disabled, true);
  assert.equal(spotify?.url, undefined);
});

test('keeps the approved Neurodiet description verbatim', () => {
  const neurodiet = config.links.find((item) => item.title === 'Neurodiet™');
  assert.equal(neurodiet?.description, 'Prevenção e reversão do Alzheimer');
});

test('exposes an accessible 1/6 progress indicator with the correct proportion', () => {
  assert.match(html, /role="progressbar"[^>]*aria-valuemin="1"[^>]*aria-valuemax="6"[^>]*aria-valuenow="1"/);
  assert.match(html, /<span class="progress-count">1\/6<\/span>/);
  assert.match(css, /\.progress-track span\s*\{[^}]*width:\s*16\.6667%/s);
});

test('ships responsive WebP portrait variants from the same source photo', () => {
  for (const name of ['portrait.webp', 'portrait-tablet.webp', 'portrait-mobile.webp']) {
    const file = path.join(root, 'assets', name);
    assert.ok(statSync(file).size > 20_000, `${name} should be a full-resolution portrait asset`);
    const header = readFileSync(file).subarray(0, 12).toString('ascii');
    assert.equal(header.slice(0, 4), 'RIFF');
    assert.equal(header.slice(8, 12), 'WEBP');
  }
  assert.match(app, /--portrait-image-desktop/);
  assert.match(app, /--portrait-image-tablet/);
  assert.match(app, /--portrait-image-mobile/);
});

test('keeps Voltar focused and scrolls the active container with reduced-motion support', () => {
  assert.match(app, /panel\.scrollTo\(\{ top: 0, behavior \}\)/);
  assert.match(app, /panel\.scrollHeight > panel\.clientHeight \+ 1/);
  assert.match(app, /window\.scrollTo\(\{ top: 0, behavior \}\)/);
  assert.match(app, /prefers-reduced-motion: reduce/);
  assert.match(app, /focus\(\{ preventScroll: true \}\)/);
});

test('shows the entire portrait without cover cropping on desktop and mobile', () => {
  assert.match(css, /@media \(max-width: 759px\)[\s\S]*?\.portal\s*\{[^}]*display:\s*flex/s);
  assert.match(css, /\.portrait\s*\{[^}]*background-size:\s*contain/s);
  assert.match(css, /@media \(min-width: 760px\)[\s\S]*?\.portrait\s*\{[^}]*background-size:\s*contain/s);
  assert.match(css, /@media \(max-width: 759px\)[\s\S]*?\.portrait\s*\{[^}]*background-size:\s*contain/s);
  assert.doesNotMatch(css, /background-size:\s*auto\s*230%/);
  assert.match(css, /\.glass-panel\s*\{[^}]*max-height:\s*none[^}]*overflow:\s*visible/s);
});

test('compacts tablet landscape without shrinking primary touch targets below 44px', () => {
  assert.match(css, /@media \(min-width: 760px\) and \(max-height: 800px\)/);
  assert.match(css, /\.link-card\s*\{[^}]*min-height:\s*48px/s);
  assert.match(css, /\.link-icon\s*\{[^}]*width:\s*40px[^}]*height:\s*40px/s);
  assert.match(css, /\.continue-button\s*\{[^}]*min-height:\s*48px/s);
});

test('declares the official Open Graph URL and portrait description', () => {
  assert.match(html, /property="og:url" content="https:\/\/dr-andre-gustavo\.lovable\.app\/"/);
  assert.match(html, /property="og:image" content="assets\/portrait\.webp"/);
  assert.match(html, /property="og:image:alt" content="Retrato do Dr\. André G\. Eichstaedt"/);
});

test('preserves close and continue controls', () => {
  assert.match(html, /id="back-button"/);
  assert.match(html, /id="close-button"/);
  assert.match(html, /id="continue-button"/);
  assert.equal(config.officialSite, 'https://agclinic.com.br');
  assert.ok(config.continueUrl.startsWith('https://wa.me/'));
});

test('responds to pointer and scroll with requestAnimationFrame, with reduced-motion fallback', () => {
  assert.match(app, /pointermove/);
  assert.match(app, /window\.requestAnimationFrame\(/);
  assert.match(app, /--pointer-x/);
  assert.match(app, /--pointer-y/);
  assert.match(app, /--scroll-shift/);
  assert.match(app, /prefers-reduced-motion: reduce/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /\.portrait, \.ambient \{ transform: none !important/);
  assert.match(css, /@media \(max-width: 759px\) and \(prefers-reduced-motion: reduce\)[\s\S]*?\.portrait\s*\{[^}]*translateX\(-50%\)/);
});

test('does not add analytics, tracking, or sharing', () => {
  const source = `${html}\n${app}\n${css}`.toLowerCase();
  for (const marker of ['gtag(', 'googletagmanager', 'analytics.js', 'facebook pixel', 'hotjar', 'mixpanel', 'amplitude', 'navigator.share']) {
    assert.equal(source.includes(marker), false, `unexpected feature marker: ${marker}`);
  }
  assert.doesNotMatch(html, /<script[^>]+src="https?:\/\//i);
});

test('does not request remote fonts', () => {
  assert.doesNotMatch(html, /fonts\.googleapis\.com|fonts\.gstatic\.com/i);
  assert.doesNotMatch(css, /@import\s+url\(/i);
});

test('keeps external destinations protected in new tabs', () => {
  assert.match(app, /anchor\.target = '_blank'/);
  assert.match(app, /anchor\.rel = 'noopener noreferrer'/);
  assert.match(app, /element\.target = '_blank'/);
  assert.match(app, /element\.rel = 'noopener noreferrer'/);
});
