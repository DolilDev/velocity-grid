import { renderGallery } from './gallery.js';
import { renderSpecTable } from './specTable.js';
import { initStickyNav, initScrollSpy, initScrollToTop } from './nav.js';
import { initSpecBars } from './specBars.js';
import { initFilter } from './filter.js';
import { initCompare } from './compare.js';

const carGrid = document.querySelector('[data-car-grid]');
const specTable = document.querySelector('[data-spec-table]');
const siteHeader = document.querySelector('[data-site-header]');
const navBrand = document.querySelector('[data-scroll-top]');
const navLinks = document.querySelectorAll('.nav__link');
const filterButtons = document.querySelectorAll('[data-filter]');
const resultStatus = document.querySelector('[data-result-count]');

initStickyNav(siteHeader);
initScrollSpy(navLinks);
initScrollToTop(navBrand);

if (specTable) {
  renderSpecTable(specTable);
}

if (carGrid) {
  renderGallery(carGrid);

  const cards = carGrid.querySelectorAll('.car-card');
  initSpecBars(cards);
  initFilter({ buttons: filterButtons, cards, statusEl: resultStatus });
  initCompare({
    grid: carGrid,
    openButton: document.querySelector('[data-compare-open]'),
    countEl: document.querySelector('[data-compare-count]'),
    modal: document.querySelector('[data-compare-modal]'),
    modalBody: document.querySelector('[data-compare-body]'),
  });
}
