// Entry point: wires the feature modules to the DOM. Each module owns one
// concern; main.js only finds the mount points and hands them over.

import { renderGallery, renderSpecTable } from './gallery.js';
import { initStickyNav } from './nav.js';
import { initSpecBars } from './specBars.js';

const carGrid = document.querySelector('[data-car-grid]');
const specTable = document.querySelector('[data-spec-table]');
const siteHeader = document.querySelector('[data-site-header]');

initStickyNav(siteHeader);

if (specTable) {
  renderSpecTable(specTable);
}

if (carGrid) {
  renderGallery(carGrid);
  // Spec bars need the cards in the DOM, so observe them right after render.
  initSpecBars(carGrid.querySelectorAll('.car-card'));
}
