const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const src = fs.readFileSync(path.join(__dirname, '..', 'public-links.js'), 'utf8');
function fixture(fetchImpl) {
  const window = {};
  vm.runInNewContext(src, { window, URL, AbortController, setTimeout, clearTimeout, fetch: fetchImpl });
  return window.LINKTREE_REMOTE_LINKS.load;
}
const config = { publicLinksApiUrl: 'https://example.supabase.co/functions/v1/instagram-public-bio' };
const response = (profile, links) => ({ ok: true, json: async () => ({ profile, displayName: 'Teste', links }) });
const valid = [{ title: 'Livro', url: 'https://loja.example.com/livro' }];
test('profile must be validated before any request', async () => {
  let requests = 0;
  const load = fixture(async () => { requests++; return response('ok', valid); });
  const result = await load(config, '../another-account');
  assert.equal(result.ok, false);
  assert.equal(requests, 0);
});
test('loads only the requested account, with a public HTTPS API', async () => {
  const load = fixture(async (url, opts) => {
    assert.equal(new URL(url).searchParams.get('profile'), 'revertendo.alzheimer');
    assert.equal(opts.credentials, 'omit');
    return response('revertendo.alzheimer', valid);
  });
  const result = await load(config, 'Revertendo.Alzheimer');
  assert.equal(result.ok, true);
  assert.equal(result.links.length, 1);
  assert.equal(result.links[0].url, valid[0].url);
});
test('never mixes another account responses or unsafe URLs', async () => {
  assert.equal((await fixture(async () => response('other', valid))(config, 'account')).ok, false);
  assert.equal((await fixture(async () => response('account', [{title:'Unsafe',url:'javascript:alert(1)'}]))(config,'account')).ok,false);
});
test('server failure fails closed without static fallback', async () => {
  const load = fixture(async () => ({ ok: false, status: 503 }));
  const result = await load(config, 'account');
  assert.equal(result.ok, false);
  assert.equal(result.error, 'upstream_unavailable');
});
test('empty published list is valid and not replaced by another profile links', async () => {
  const load = fixture(async () => response('account', []));
  const result = await load(config, 'account');
  assert.equal(result.ok, true);
  assert.equal(result.links.length, 0);
});
