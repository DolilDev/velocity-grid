// Entry point: wires the feature modules to the DOM. Each module owns one
// concern; main.js only finds the mount points and hands them over.

import { renderGallery, renderSpecTable } from './gallery.js';

const carGrid = document.querySelector('[data-car-grid]');
const specTable = document.querySelector('[data-spec-table]');

if (carGrid) {
  renderGallery(carGrid);
}

if (specTable) {
  renderSpecTable(specTable);
}
