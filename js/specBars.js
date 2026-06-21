const VISIBLE_CLASS = 'is-visible';

const OBSERVER_OPTIONS = {
  rootMargin: '0px 0px -10% 0px',
  threshold: 0.25,
};

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const initSpecBars = (cards) => {
  const items = Array.from(cards);
  if (items.length === 0) {
    return;
  }

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
      obs.unobserve(entry.target);
    });
  }, OBSERVER_OPTIONS);

  items.forEach((card) => observer.observe(card));
};
