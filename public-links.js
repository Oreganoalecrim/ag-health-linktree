(() => {
  const validProfile = /^[a-z0-9._]{1,30}$/;

  async function load(config, rawProfile) {
    const profile = String(rawProfile ?? '').trim().toLowerCase();
    if (!validProfile.test(profile)) return { ok: false, error: 'invalid_profile' };
    if (!config?.publicLinksApiUrl) return { ok: false, error: 'api_not_configured' };

    let endpoint;
    try {
      endpoint = new URL(config.publicLinksApiUrl);
      if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password) throw Error('unsafe');
      endpoint.searchParams.set('profile', profile);
    } catch {
      return { ok: false, error: 'api_not_configured' };
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    try {
      const response = await fetch(endpoint.toString(), {
        method: 'GET', credentials: 'omit', signal: controller.signal, cache: 'no-store',
      });
      if (!response.ok) return { ok: false, error: 'upstream_unavailable' };

      const data = await response.json();
      if (!data || data.profile !== profile || !Array.isArray(data.links) || data.links.length > 50) {
        return { ok: false, error: 'invalid_response' };
      }
      const links = [];
      for (const item of data.links) {
        if (!item || typeof item.title !== 'string' || typeof item.url !== 'string') {
          return { ok: false, error: 'invalid_response' };
        }
        const url = new URL(item.url);
        if (url.protocol !== 'https:' || url.username || url.password ||
          /[{}<>\s]/.test(item.url) || item.title.trim().length > 120 || !item.title.trim()) {
          return { ok: false, error: 'invalid_response' };
        }
        links.push({
          icon: 'book', title: item.title.trim(), description: '', url: item.url,
        });
      }
      return {
        ok: true,
        profile,
        displayName: typeof data.displayName === 'string'
          ? data.displayName.trim().slice(0, 120) : `@${profile}`,
        links,
      };
    } catch {
      return { ok: false, error: 'upstream_unavailable' };
    } finally {
      clearTimeout(timer);
    }
  }

  window.LINKTREE_REMOTE_LINKS = Object.freeze({ load });
})();
