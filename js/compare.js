import { cars } from './data.js';
import { carArt } from './carArt.js';

const MAX_SELECTION = 2;
const OPEN_CLASS = 'is-open';

const COMPARE_ROWS = [
  { label: 'Prędkość maks.', unit: 'km/h', higherIsBetter: true, get: (c) => c.specs.topSpeed },
  { label: '0–100 km/h', unit: 's', higherIsBetter: false, get: (c) => c.specs.zeroToHundred },
  { label: 'Moc', unit: 'KM', higherIsBetter: true, get: (c) => c.specs.power },
  { label: 'Masa', unit: 'kg', higherIsBetter: false, get: (c) => c.specs.weight },
  { label: 'Docisk', unit: 'pkt', higherIsBetter: true, get: (c) => c.performance.downforce },
];

const findCar = (id) => cars.find((car) => car.id === id);

const carHeaderMarkup = (car) => `
  <article class="compare__car">
    <div class="compare__car-media" style="--car-from: ${car.colors.from}; --car-to: ${car.colors.to}">
      ${carArt(car, { className: 'compare__car-art' })}
    </div>
    <p class="compare__car-name">${car.name}</p>
    <p class="compare__car-team">${car.team}</p>
  </article>`;

const cellMarkup = (value, unit, isBetter) =>
  `<td><span class="compare__value${isBetter ? ' is-better' : ''}">${value} ${unit}</span></td>`;

const rowMarkup = (row, carA, carB) => {
  const valueA = row.get(carA);
  const valueB = row.get(carB);

  let aBetter = false;
  let bBetter = false;
  if (valueA !== valueB) {
    const aWins = row.higherIsBetter ? valueA > valueB : valueA < valueB;
    aBetter = aWins;
    bBetter = !aWins;
  }

  return `
    <tr>
      <th scope="row">${row.label}</th>
      ${cellMarkup(valueA, row.unit, aBetter)}
      ${cellMarkup(valueB, row.unit, bBetter)}
    </tr>`;
};

const comparisonMarkup = (carA, carB) => `
  <div class="compare is-visible">
    <div class="compare__cars">
      ${carHeaderMarkup(carA)}
      ${carHeaderMarkup(carB)}
    </div>
    <table class="compare__table">
      <caption class="visually-hidden">Porównanie ${carA.name} i ${carB.name}</caption>
      <thead>
        <tr>
          <th scope="col">Parametr</th>
          <th scope="col">${carA.name}</th>
          <th scope="col">${carB.name}</th>
        </tr>
      </thead>
      <tbody>${COMPARE_ROWS.map((row) => rowMarkup(row, carA, carB)).join('')}</tbody>
    </table>
  </div>`;

const getFocusable = (container) =>
  Array.from(
    container.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])')
  ).filter((el) => !el.disabled && el.offsetParent !== null);

const trapFocus = (modal, event) => {
  const focusable = getFocusable(modal);
  if (focusable.length === 0) {
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};

export const initCompare = ({ grid, openButton, countEl, modal, modalBody } = {}) => {
  if (!grid || !openButton || !modal || !modalBody) {
    return;
  }

  const checkboxes = Array.from(grid.querySelectorAll('[data-compare-checkbox]'));
  const closeEls = modal.querySelectorAll('[data-modal-close]');
  const closeButton = modal.querySelector('.modal__close');
  let selected = [];
  let lastFocused = null;

  const syncUI = () => {
    if (countEl) {
      countEl.textContent = String(selected.length);
    }
    openButton.disabled = selected.length !== MAX_SELECTION;

    const atMax = selected.length >= MAX_SELECTION;
    checkboxes.forEach((box) => {
      box.disabled = atMax && !box.checked;
    });
  };

  const openModal = () => {
    lastFocused = document.activeElement;
    modal.classList.add(OPEN_CLASS);
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    window.requestAnimationFrame(() => (closeButton ?? modal).focus());
  };

  const closeModal = () => {
    modal.classList.remove(OPEN_CLASS);
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) {
      lastFocused.focus();
    }
  };

  grid.addEventListener('change', (event) => {
    const box = event.target.closest('[data-compare-checkbox]');
    if (!box) {
      return;
    }
    if (box.checked) {
      selected.push(box.value);
    } else {
      selected = selected.filter((id) => id !== box.value);
    }
    syncUI();
  });

  openButton.addEventListener('click', () => {
    if (selected.length !== MAX_SELECTION) {
      return;
    }
    const [carA, carB] = selected.map(findCar);
    modalBody.innerHTML = comparisonMarkup(carA, carB);
    openModal();
  });

  closeEls.forEach((el) => el.addEventListener('click', closeModal));

  document.addEventListener('keydown', (event) => {
    if (!modal.classList.contains(OPEN_CLASS)) {
      return;
    }
    if (event.key === 'Escape') {
      closeModal();
    } else if (event.key === 'Tab') {
      trapFocus(modal, event);
    }
  });

  syncUI();
};
