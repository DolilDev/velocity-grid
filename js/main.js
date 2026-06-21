// Entry point: wires the feature modules to the DOM. Each module owns one
// concern; main.js only finds the mount points and hands them over.

import { renderGallery, renderSpecTable } from './gallery.js';
import { initStickyNav } from './nav.js';
import { initSpecBars } from './specBars.js';
import { initFilter } from './filter.js';

const carGrid = document.querySelector('[data-car-grid]');
const specTable = document.querySelector('[data-spec-table]');
const siteHeader = document.querySelector('[data-site-header]');
const filterButtons = document.querySelectorAll('[data-filter]');
const resultStatus = document.querySelector('[data-result-count]');

initStickyNav(siteHeader);

if (specTable) {
  renderSpecTable(specTable);
}

if (carGrid) {
  renderGallery(carGrid);
  // Cards exist only after render, so observe and wire them up now.
  const cards = carGrid.querySelectorAll('.car-card');
  initSpecBars(cards);
  initFilter({ buttons: filterButtons, cards, statusEl: resultStatus });
}
