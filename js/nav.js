// Sticky-nav scroll effect: toggles .is-scrolled on the header so the CSS can
// fade in a background once the user leaves the top of the page.

const SCROLL_THRESHOLD = 24; // px

// Scroll the page back to the very top from the logo. A plain `#top` anchor
// can't do this: #top sits on the sticky header, which is permanently pinned to
// the viewport top, so the browser thinks it's already in view and won't scroll.
// We scroll to 0 explicitly; the href stays as a no-JS fallback.
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

  // rAF guard: scroll fires far more often than the screen repaints, so we
  // coalesce bursts into one class update per frame.
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

  update(); // set the correct state on load (e.g. reload mid-page)
  window.addEventListener('scroll', onScroll, { passive: true });
};

const ACTIVE_LINK_CLASS = 'is-active';

// How far down the viewport the "you are here" line sits (fraction of height).
const SPY_LINE_RATIO = 0.3;

// Scrollspy: highlights the nav link of the section currently in view, so the
// navbar always agrees with the content on screen.
//
// A position check (not IntersectionObserver) is the right tool here: the active
// section is the last one whose top has scrolled above a reference line. That
// also fixes the classic edge case where a short footer at the page bottom can
// never reach a mid-viewport observer band — we just force the last link active
// once the page is scrolled to the end.
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
      current = targets[targets.length - 1]; // last section wins at page end
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
