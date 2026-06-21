// Renders the card gallery and the technical-data table from the car dataset.
// Markup-building only — interactions (filtering, spec bars, comparison) live in
// their own modules.

import { cars, CATEGORIES } from './data.js';
import { carArt } from './carArt.js';

// The three animated bars shown on every card, mapped to performance scores.
const SPEC_BARS = [
  { key: 'speed', label: 'Prędkość' },
  { key: 'acceleration', label: 'Przyspieszenie' },
  { key: 'downforce', label: 'Docisk' },
];

// Cars at or above this top speed earn the "Top speed" badge.
const TOP_SPEED_BADGE_THRESHOLD = 375; // km/h

const SPEC_COLUMNS = ['Bolid', 'Zespół', 'Kategoria', 'Silnik', 'Moc', 'Masa', 'V-max', '0–100'];

const specBarMarkup = ({ label }, value) => `
  <div class="spec-bar">
    <span class="spec-bar__label">${label}</span>
    <span class="spec-bar__value">${value}</span>
    <div class="spec-bar__track">
      <div class="spec-bar__fill" style="--value: ${value}"></div>
    </div>
  </div>`;

const cardMarkup = (car) => {
  const { id, name, team, category, colors, performance, specs } = car;
  const categoryLabel = CATEGORIES[category].label;

  const topSpeedBadge =
    specs.topSpeed >= TOP_SPEED_BADGE_THRESHOLD
      ? '<span class="badge badge--top-speed">Top speed</span>'
      : '';

  const bars = SPEC_BARS.map((bar) => specBarMarkup(bar, performance[bar.key])).join('');

  return `
    <li class="car-card" data-category="${category}" data-id="${id}">
      <div class="car-card__media" style="--car-from: ${colors.from}; --car-to: ${colors.to}">
        <div class="car-card__badges">
          <span class="badge badge--category badge--${category}">${categoryLabel}</span>
          ${topSpeedBadge}
        </div>
        <label class="car-card__select compare-toggle">
          <input class="compare-toggle__input" type="checkbox" data-compare-checkbox value="${id}" />
          <span class="compare-toggle__box" aria-hidden="true">✓</span>
          <span class="visually-hidden">Dodaj ${name} do porównania</span>
        </label>
        ${carArt(car)}
      </div>
      <div class="car-card__body">
        <p class="car-card__team">${team}</p>
        <h3 class="car-card__name">${name}</h3>
        <div class="car-card__specs">${bars}</div>
        <div class="car-card__meta">
          <div class="car-card__meta-item">
            <span class="car-card__meta-label">Prędkość maks.</span>
            <span class="car-card__meta-value">${specs.topSpeed} <small>km/h</small></span>
          </div>
          <div class="car-card__meta-item">
            <span class="car-card__meta-label">0–100 km/h</span>
            <span class="car-card__meta-value">${specs.zeroToHundred} <small>s</small></span>
          </div>
        </div>
      </div>
    </li>`;
};

const rowMarkup = ({ name, team, category, specs }) => `
  <tr>
    <th scope="row">${name}</th>
    <td>${team}</td>
    <td>${CATEGORIES[category].label}</td>
    <td>${specs.engine}</td>
    <td>${specs.power} KM</td>
    <td>${specs.weight} kg</td>
    <td>${specs.topSpeed} km/h</td>
    <td>${specs.zeroToHundred} s</td>
  </tr>`;

export const renderGallery = (gridEl) => {
  gridEl.innerHTML = cars.map(cardMarkup).join('');
};

export const renderSpecTable = (tableEl) => {
  const head = SPEC_COLUMNS.map((label) => `<th scope="col">${label}</th>`).join('');
  tableEl.innerHTML = `
    <caption class="visually-hidden">Dane techniczne bolidów APEX Racing Series</caption>
    <thead>
      <tr>${head}</tr>
    </thead>
    <tbody>${cars.map(rowMarkup).join('')}</tbody>`;
};
