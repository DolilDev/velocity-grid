// Category filtering. Buttons carry data-filter, cards carry data-category.
// Non-matching cards animate out and then collapse from the grid; matching
// cards drop back in and animate in. A status region announces the result count
// to screen readers.

const ACTIVE_CLASS = 'is-active';
const ENTER_CLASS = 'car-card--enter';
const EXIT_CLASS = 'car-card--exit';
const ALL = 'all';

// Keyframe names, matched against event.animationName so a cancelled animation's
// stale listener can never act on the wrong transition.
const ANIM_IN = 'card-in';
const ANIM_OUT = 'card-out';

const CARD_FORMS = ['bolid', 'bolidy', 'bolidów'];

// Polish has three plural forms — pick the right one for the count.
const polishPlural = (n, [one, few, many]) => {
  if (n === 1) {
    return one;
  }
  const lastDigit = n % 10;
  const lastTwo = n % 100;
  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwo < 12 || lastTwo > 14)) {
    return few;
  }
  return many;
};

const matches = (card, filter) => filter === ALL || card.dataset.category === filter;

const finishEnter = (event) => {
  if (event.animationName !== ANIM_IN) {
    return;
  }
  const card = event.currentTarget;
  card.classList.remove(ENTER_CLASS);
  card.removeEventListener('animationend', finishEnter);
};

const finishExit = (event) => {
  if (event.animationName !== ANIM_OUT) {
    return;
  }
  const card = event.currentTarget;
  card.hidden = true;
  card.classList.remove(EXIT_CLASS);
  card.removeEventListener('animationend', finishExit);
};

const showCard = (card) => {
  // Cancel any in-flight exit so its listener can't hide the card later.
  card.classList.remove(EXIT_CLASS);
  card.removeEventListener('animationend', finishExit);
  if (!card.hidden) {
    return;
  }
  card.hidden = false;
  card.classList.add(ENTER_CLASS);
  card.addEventListener('animationend', finishEnter);
};

const hideCard = (card) => {
  card.classList.remove(ENTER_CLASS);
  card.removeEventListener('animationend', finishEnter);
  if (card.hidden) {
    return;
  }
  card.classList.add(EXIT_CLASS);
  card.addEventListener('animationend', finishExit);
};

const announce = (statusEl, count) => {
  if (!statusEl) {
    return;
  }
  statusEl.textContent = `Pokazano ${count} ${polishPlural(count, CARD_FORMS)}.`;
};

export const initFilter = ({ buttons, cards, statusEl } = {}) => {
  const buttonList = Array.from(buttons ?? []);
  const cardList = Array.from(cards ?? []);
  if (buttonList.length === 0 || cardList.length === 0) {
    return;
  }

  const apply = (filter) => {
    let visible = 0;
    cardList.forEach((card) => {
      if (matches(card, filter)) {
        showCard(card);
        visible += 1;
      } else {
        hideCard(card);
      }
    });
    announce(statusEl, visible);
  };

  buttonList.forEach((button) => {
    button.addEventListener('click', () => {
      buttonList.forEach((other) => {
        const isActive = other === button;
        other.classList.toggle(ACTIVE_CLASS, isActive);
        other.setAttribute('aria-pressed', String(isActive));
      });
      apply(button.dataset.filter);
    });
  });
};
