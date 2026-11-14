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

test('preserves branded identity while removing unwanted navigation chrome', () => {
  assert.match(html, /DR\. ANDRÉ G\./);
  assert.match(html, /EICHSTAEDT/);
  assert.match(html, /Explore meus<br \/>conteúdos e projetos/);
  assert.doesNotMatch(html, /id="back-button"|id="close-button"|id="open-panel"/);
  assert.doesNotMatch(html, /progress-count|role="progressbar"|top-controls/);
  assert.match(html, /href="reference\.css\?v=/);
});

test('uses the latest user-approved panoramic sunset portrait, without abrupt edges', () => {
  const name = 'portrait-sunset-wide-20261113.webp';
  const file = path.join(root, 'assets', name);
  assert.ok(statSync(file).size > 25_000);
  const header = readFileSync(file).subarray(0, 12).toString('ascii');
  assert.equal(header.slice(0, 4), 'RIFF');
  assert.equal(header.slice(8, 12), 'WEBP');
  assert.equal(config.portraitUrl, `assets/${name}?v=20261113-glass`);
  assert.equal(config.portraitTabletUrl, config.portraitUrl);
  assert.equal(config.portraitMobileUrl, config.portraitUrl);
  assert.ok(statSync(path.join(root, 'assets', 'portrait-sunset-wide-20261113.png')).size > 100_000);
  assert.doesNotMatch(`${html}\n${css}\n${read('reference.css')}\n${read('config.js')}`, /assets\/(?:portrait-budget-hero|portrait-approved|portrait-mobile|portrait-tablet)\.webp/);
  assert.match(app, /--portrait-image-desktop/);
  assert.match(app, /--portrait-image-tablet/);
  assert.match(app, /--portrait-image-mobile/);
});

test('does not bind the removed navigation controls', () => {
  assert.doesNotMatch(app, /#back-button|#close-button|#open-panel|closePanel|showPanel/);
  assert.match(app, /prefers-reduced-motion: reduce/);
});

test('full-bleed photo and mobile panel overlap, with translucent smoke Liquid Glass', () => {
  const reference = read('reference.css');
  assert.match(reference, /\.portrait\s*\{[^}]*background-size:\s*cover/s);
  assert.match(reference, /\.portrait\s*\{[^}]*mask-image:\s*none/s);
  assert.match(reference, /@media \(max-width: 759px\)[\s\S]*?\.portrait\s*\{[^}]*background-size:\s*cover/s);
  assert.match(reference, /@media \(max-width: 759px\)[\s\S]*?\.portal\s*\{[^}]*padding:\s*clamp\(174px, 25svh, 252px\)/s);
  assert.match(reference, /\.glass-panel\s*\{[^}]*backdrop-filter:\s*blur/s);
  assert.match(reference, /:root\s*\{[^}]*color-scheme:\s*light/s);
  assert.match(reference, /\.continue-button\s*\{[^}]*backdrop-filter/s);
  assert.match(reference, /prefers-reduced-transparency: reduce/);
  assert.doesNotMatch(reference, /margin:\s*min\(54svh/);
});

test('compacts tablet landscape without shrinking primary touch targets below 44px', () => {
  assert.match(css, /@media \(min-width: 760px\) and \(max-height: 800px\)/);
  assert.match(css, /\.link-card\s*\{[^}]*min-height:\s*48px/s);
  assert.match(css, /\.link-icon\s*\{[^}]*width:\s*40px[^}]*height:\s*40px/s);
  assert.match(css, /\.continue-button\s*\{[^}]*min-height:\s*48px/s);
});

test('declares the official Open Graph URL and portrait description', () => {
  assert.match(html, /property="og:url" content="https:\/\/dr-andre-gustavo\.lovable\.app\/"/);
  assert.match(html, /property="og:image" content="assets\/portrait-sunset-wide-20261113\.png"/);
  assert.match(html, /property="og:image:alt" content="Retrato do Dr\. André G\. Eichstaedt"/);
});

test('preserves working consultation CTA', () => {
  assert.match(html, /id="continue-button"/);
  assert.ok(config.continueUrl.startsWith('https://wa.me/'));
});

test('isolates porcelain parallax to the glass panel, never moving the photograph', () => {
  const porcelain = read('porcelain-links.css');
  assert.match(html, /href="porcelain-links\.css\?v=/);
  assert.match(app, /panel\.addEventListener\('pointermove'/);
  assert.match(app, /panel\.addEventListener\('pointerleave'/);
  assert.match(app, /panel\.addEventListener\('scroll'/);
  assert.match(app, /window\.addEventListener\('scroll'/);
  assert.match(app, /window\.requestAnimationFrame\(/);
  for (const name of ['--panel-shift-x', '--panel-shift-y', '--panel-tilt-x', '--panel-tilt-y', '--panel-scroll-y']) {
    assert.ok(app.includes(name));
    assert.ok(porcelain.includes(name));
  }
  assert.doesNotMatch(app, /portal\.addEventListener\('pointermove'|portal\.style\.setProperty\('--scroll-shift'/);
  assert.match(read('reference.css'), /\.portrait\s*\{[^}]*transform:\s*none/s);
  assert.match(app, /prefers-reduced-motion: reduce/);
  assert.match(porcelain, /@media \(prefers-reduced-motion:reduce\)/);
  assert.match(porcelain, /\.glass-panel\s*\{transform: none !important/);
});

test('sculpts a porcelain cove with raised 3D link tiles and inset icon relief', () => {
  const porcelain = read('porcelain-links.css');
  assert.match(porcelain, /\.link-list\s*\{[^}]*inset 8px 10px 19px rgba\(0,0,0,\.72\)/s);
  assert.match(porcelain, /\.link-card,[\s\S]*?0 8px 0 #a99780/s);
  assert.match(porcelain, /\.link-icon\s*\{[^}]*inset 5px 6px 9px rgba\(0,0,0,\.79\)/s);
  assert.match(porcelain, /\.link-icon svg\s*\{[^}]*color:\s*#fffefa/s);
  assert.match(porcelain, /\.link-card:active\s*\{[^}]*inset 6px 8px 13px/s);
  assert.match(porcelain, /\.link-card:hover/);
  assert.match(porcelain, /\.continue-button\s*\{[^}]*0 8px 0 #a99780/s);
});

test('preserves the original panorama while the links panel uses a pale gray frosted glass', () => {
  const reference = read('reference.css');
  const porcelain = read('porcelain-links.css');
  assert.match(html, /name="theme-color" content="#292e30"/);
  assert.match(html, /reference\.css\?v=20261114-frosted-gray-1/);
  assert.match(html, /porcelain-links\.css\?v=20261114-smoke-porcelain-1/);
  assert.match(reference, /html, body \{ background: #ca8ca1/);
  assert.match(reference, /background: linear-gradient\(140deg, #ae7c9d, #e68e9c 52%, #ffad79\)/);
  assert.match(reference, /rgba\(41, 20, 36, \.03\) 8%, transparent 45%, rgba\(55, 28, 57, \.10\)/);
  assert.doesNotMatch(reference, /\.portrait-shade::after|mix-blend-mode:\s*color/);
  assert.match(reference, /rgba\(202, 208, 208, \.60\)/);
  assert.match(reference, /rgba\(164, 174, 177, \.52\)/);
  assert.match(reference, /backdrop-filter:\s*blur\(25px\) saturate\(24%\)/);
  assert.match(reference, /\.heading-wrap h1\s*\{[^}]*color:\s*#283135/s);
  assert.doesNotMatch(reference, /rgba\(49,54,55,\.84\)|rgba\(29,34,36,\.73\)/);
  assert.match(porcelain, /#eadcc7 47%,#cdbba5 100%/);
  assert.doesNotMatch(porcelain, /rgba\(165,125,138|#f4eae6|#e5d7d6|#7d596d/);
});

test('does not add analytics, tracking, or sharing', () => {
  const source = `${html}\n${app}\n${css}\n${read('reference.css')}\n${read('porcelain-links.css')}`.toLowerCase();
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
