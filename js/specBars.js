// Animates the performance bars: each card's bars fill up the first time the
// card scrolls into view. One shared IntersectionObserver handles every card,
// which is far cheaper than a scroll listener doing getBoundingClientRect math.

const VISIBLE_CLASS = 'is-visible';

const OBSERVER_OPTIONS = {
  // Trigger slightly before the card is fully on screen.
  rootMargin: '0px 0px -10% 0px',
  threshold: 0.25,
};

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const initSpecBars = (cards) => {
  const items = Array.from(cards);
  if (items.length === 0) {
    return;
  }

  // Reduced-motion or no observer support: reveal everything at once, no
  // animation. The CSS still fills the bars — it just doesn't tween.
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    items.forEach((card) => card.classList.add(VISIBLE_CLASS));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      entry.target.classList.add(VISIBLE_CLASS);
      obs.unobserve(entry.target); // fill once, then stop watching
    });
  }, OBSERVER_OPTIONS);

  items.forEach((card) => observer.observe(card));
};
