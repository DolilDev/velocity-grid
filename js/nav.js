const SCROLL_THRESHOLD = 24;

export const initScrollToTop = (triggerEl) => {
  if (!triggerEl) {
    return;
  }

  triggerEl.addEventListener('click', (event) => {
    event.preventDefault();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
};

export const initStickyNav = (headerEl) => {
  if (!headerEl) {
    return;
  }

  const update = () => {
    headerEl.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) {
      return;
    }
    ticking = true;
    window.requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
};

const ACTIVE_LINK_CLASS = 'is-active';

const SPY_LINE_RATIO = 0.3;

export const initScrollSpy = (navLinks) => {
  const links = Array.from(navLinks);
  const targets = links
    .map((link) => {
      const id = (link.getAttribute('href') || '').replace('#', '');
      const section = id ? document.getElementById(id) : null;
      return section ? { link, section } : null;
    })
    .filter(Boolean);

  if (targets.length === 0) {
    return;
  }

  const setActive = (activeLink) => {
    links.forEach((link) => {
      const isActive = link === activeLink;
      link.classList.toggle(ACTIVE_LINK_CLASS, isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const update = () => {
    const atBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

    let current = null;
    if (atBottom) {
      current = targets[targets.length - 1];
    } else {
      const line = window.innerHeight * SPY_LINE_RATIO;
      targets.forEach((target) => {
        if (target.section.getBoundingClientRect().top <= line) {
          current = target;
        }
      });
    }

    setActive(current ? current.link : null);
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) {
      return;
    }
    ticking = true;
    window.requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
};
