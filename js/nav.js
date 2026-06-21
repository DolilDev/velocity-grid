// Sticky-nav scroll effect: toggles .is-scrolled on the header so the CSS can
// fade in a background once the user leaves the top of the page.

const SCROLL_THRESHOLD = 24; // px

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
