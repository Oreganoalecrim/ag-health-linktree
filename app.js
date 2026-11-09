(() => {
  const config = window.LINKTREE_CONFIG || {};
  const linksRoot = document.querySelector('#links');
  const socialsRoot = document.querySelector('#socials');
  const portrait = document.querySelector('.portrait');
  const portraitDesktopUrl = window.__PORTRAIT_URL__ || config.portraitUrl;
  const portraitTabletUrl = window.__PORTRAIT_TABLET_URL__ || config.portraitTabletUrl || portraitDesktopUrl;
  const portraitMobileUrl = window.__PORTRAIT_MOBILE_URL__ || config.portraitMobileUrl || portraitTabletUrl;
  if (portrait) {
    if (portraitDesktopUrl) portrait.style.setProperty('--portrait-image-desktop', `url("${portraitDesktopUrl}")`);
    if (portraitTabletUrl) portrait.style.setProperty('--portrait-image-tablet', `url("${portraitTabletUrl}")`);
    if (portraitMobileUrl) portrait.style.setProperty('--portrait-image-mobile', `url("${portraitMobileUrl}")`);
    if (portraitTabletUrl || portraitDesktopUrl) portrait.style.setProperty('--portrait-image', `url("${portraitTabletUrl || portraitDesktopUrl}")`);
  }

  // Gentle depth on the existing photograph; the viewport frames the bust,
  // and reduced-motion users see the same composition without movement.
  // Request-animation-frame limits work to one update per painted frame.
  const portal = document.querySelector('.portal');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pointerDepth = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (portal && !reducedMotion.matches) {
    let pointerFrame = 0;
    let pointerX = 0;
    let pointerY = 0;
    const paintPointer = () => {
      portal.style.setProperty('--pointer-x', pointerX.toFixed(3));
      portal.style.setProperty('--pointer-y', pointerY.toFixed(3));
      pointerFrame = 0;
    };
    const requestPointerPaint = () => {
      if (!pointerFrame) pointerFrame = window.requestAnimationFrame(paintPointer);
    };
    if (pointerDepth.matches) {
      portal.addEventListener('pointermove', (event) => {
        const rect = portal.getBoundingClientRect();
        pointerX = Math.max(-1, Math.min(1, (2 * (event.clientX - rect.left) / rect.width) - 1));
        pointerY = Math.max(-1, Math.min(1, (2 * (event.clientY - rect.top) / rect.height) - 1));
        requestPointerPaint();
      }, { passive: true });
      portal.addEventListener('pointerleave', () => {
        pointerX = 0;
        pointerY = 0;
        requestPointerPaint();
      });
    }
    let scrollFrame = 0;
    const paintScroll = () => {
      const progress = Math.min(1, Math.max(0, window.scrollY / Math.max(1, window.innerHeight)));
      portal.style.setProperty('--scroll-shift', window.innerWidth < 760 ? `${(-14 * progress).toFixed(1)}px` : '0px');
      scrollFrame = 0;
    };
    window.addEventListener('scroll', () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(paintScroll);
    }, { passive: true });
    paintScroll();
  }

  const icons = {
    play: '<path d="M8 5.5v13l10-6.5-10-6.5Z" fill="currentColor" stroke="none"/>',
    book: '<path d="M3.5 5.5c3.4-1.4 6.2-.9 8.5 1.3v13c-2.3-2.2-5.1-2.7-8.5-1.3v-13Z"/><path d="M20.5 5.5c-3.4-1.4-6.2-.9-8.5 1.3v13c2.3-2.2 5.1-2.7 8.5-1.3v-13Z"/><path d="M7 8.5c1.1-.2 2.1 0 3 .5M17 8.5c-1.1-.2-2.1 0-3 .5"/>',
    brain: '<path d="M12 4.2a3.2 3.2 0 0 0-5.8 1.9A3.4 3.4 0 0 0 4.4 12a3.4 3.4 0 0 0 2.1 5.9 3.2 3.2 0 0 0 5.5 1.8V4.2Z"/><path d="M12 4.2a3.2 3.2 0 0 1 5.8 1.9 3.4 3.4 0 0 1 1.8 5.9 3.4 3.4 0 0 1-2.1 5.9 3.2 3.2 0 0 1-5.5 1.8V4.2Z"/><path d="M8 9.2c1.6 0 2.4.8 2.4 2M16 9.2c-1.6 0-2.4.8-2.4 2M8.4 15.4c1.4-.3 2.4-1 2.8-2M15.6 15.4c-1.4-.3-2.4-1-2.8-2"/>',
    dna: '<path d="M7 3c0 4.2 10 5.8 10 10s-10 5.8-10 8M17 3c0 4.2-10 5.8-10 10s10 5.8 10 8"/><path d="M8.5 6.5h7M7.2 10h9.6M7.2 14h9.6M8.5 17.5h7"/>',
    mortar: '<path d="M4 14.5h16l-1.3 4.1a2 2 0 0 1-1.9 1.4H7.2a2 2 0 0 1-1.9-1.4L4 14.5Z"/><path d="M3 12h18M8 12l2.2-4.5M13.5 8.5l3.2-3.2M15.2 4.8l2 2"/><path d="M6.5 22h11"/>',
    calendar: '<rect x="3.5" y="5.5" width="17" height="15" rx="2"/><path d="M7.5 3.5v4M16.5 3.5v4M3.5 10h17M7.5 13.5h.01M12 13.5h.01M16.5 13.5h.01M7.5 17h.01M12 17h.01"/>',
    instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.6 6.6h.01"/>',
    youtube: '<path d="M21 8.2a2.6 2.6 0 0 0-1.8-1.9C17.6 5.9 12 5.9 12 5.9s-5.6 0-7.2.4A2.6 2.6 0 0 0 3 8.2a27 27 0 0 0-.4 3.8 27 27 0 0 0 .4 3.8 2.6 2.6 0 0 0 1.8 1.9c1.6.4 7.2.4 7.2.4s5.6 0 7.2-.4a2.6 2.6 0 0 0 1.8-1.9 27 27 0 0 0 .4-3.8 27 27 0 0 0-.4-3.8Z"/><path d="m10 9 5 3-5 3V9Z" fill="currentColor" stroke="none"/>',
    whatsapp: '<path d="M20.2 11.7a8.2 8.2 0 0 1-12.1 7.2L3.5 20l1.1-4.4a8.2 8.2 0 1 1 15.6-3.9Z"/><path d="M8.2 8.2c.3-.5.6-.5.9-.5h.5c.2 0 .4.1.5.4l.8 1.8c.1.2.1.4-.1.6l-.6.7c-.2.2-.2.4-.1.6.5.9 1.2 1.6 2.1 2.1.2.1.4.1.6-.1l.7-.8c.2-.2.4-.2.6-.1l1.7.8c.3.1.4.3.4.5v.5c0 .3 0 .6-.5.9-.5.3-1.3.5-2.2.2-1-.3-2.2-1-3.3-2.1-1.1-1.1-1.8-2.3-2.1-3.3-.3-.9-.1-1.7.2-2.2Z"/>',
    linkedin: '<path d="M5 9v10M5 5.5v.01M9.5 19v-5.5a3.5 3.5 0 0 1 7 0V19M9.5 10v9"/><path d="M3.5 3.5h17v17h-17z" opacity=".85"/>',
    spotify: '<path d="M5 9.1c4.8-1.5 10.1-.9 14.2 1.8M6 12.5c3.9-1.1 8.3-.6 11.6 1.5M7 15.8c3-.8 6.4-.4 9 1.2"/>',
    arrow: '<path d="M5 12h14m-7-7 7 7-7 7"/>',
  };

  const svg = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.arrow}</svg>`;

  for (const item of config.links || []) {
    if (!item.url) continue;
    const anchor = document.createElement('a');
    anchor.className = 'link-card';
    anchor.href = item.url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.setAttribute('aria-label', `${item.title}. ${item.description}`);

    const icon = document.createElement('span');
    icon.className = `link-icon icon-${item.icon}`;
    icon.innerHTML = svg(item.icon);

    const copy = document.createElement('span');
    copy.className = 'link-copy';
    const title = document.createElement('strong');
    title.textContent = item.title;
    const description = document.createElement('small');
    description.textContent = item.description || '';
    copy.append(title, description);

    const arrow = document.createElement('span');
    arrow.className = 'link-arrow';
    arrow.innerHTML = svg('arrow');
    anchor.append(icon, copy, arrow);
    linksRoot?.append(anchor);
  }

  for (const item of config.socials || []) {
    const element = item.disabled ? document.createElement('span') : document.createElement('a');
    element.className = `social-button${item.disabled ? ' is-disabled' : ''}`;
    element.setAttribute('aria-label', item.disabled ? `${item.label} — link oficial não configurado` : item.label);
    if (item.disabled) {
      element.setAttribute('aria-disabled', 'true');
      element.title = 'Link oficial não configurado';
    } else {
      element.href = item.url;
      element.target = '_blank';
      element.rel = 'noopener noreferrer';
    }
    element.innerHTML = svg(item.icon);
    socialsRoot?.append(element);
  }

  const continueButton = document.querySelector('#continue-button');
  if (continueButton && config.continueUrl) continueButton.href = config.continueUrl;

  const panel = document.querySelector('.glass-panel');
  const openPanelButton = document.querySelector('#open-panel');
  const closePanel = () => {
    if (!panel || !openPanelButton) return;
    panel.classList.add('is-closed');
    panel.setAttribute('aria-hidden', 'true');
    openPanelButton.hidden = false;
    openPanelButton.focus();
  };
  const showPanel = () => {
    if (!panel || !openPanelButton) return;
    panel.classList.remove('is-closed');
    panel.removeAttribute('aria-hidden');
    openPanelButton.hidden = true;
    panel.querySelector('#page-title')?.focus({ preventScroll: true });
  };

  document.querySelector('#close-button')?.addEventListener('click', closePanel);
  openPanelButton?.addEventListener('click', showPanel);
  document.querySelector('#back-button')?.addEventListener('click', () => {
    if (document.referrer && window.history.length > 1) {
      window.history.back();
    } else {
      closePanel();
    }
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !openPanelButton?.hidden) return;
    if (event.key === 'Escape') closePanel();
  });

})();
