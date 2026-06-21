import { cars, CATEGORIES } from './data.js';

const DIR_ASC = 1;
const ARIA_ASC = 'ascending';
const ARIA_DESC = 'descending';
const ARIA_NONE = 'none';

const COLUMNS = [
  { key: 'name', label: 'Bolid', type: 'text', rowHeader: true, get: (c) => c.name },
  { key: 'team', label: 'Zespół', type: 'text', get: (c) => c.team },
  { key: 'category', label: 'Kategoria', type: 'text', get: (c) => CATEGORIES[c.category].label },
  { key: 'engine', label: 'Silnik', type: 'text', get: (c) => c.specs.engine },
  { key: 'power', label: 'Moc', type: 'number', unit: 'KM', get: (c) => c.specs.power },
  { key: 'weight', label: 'Masa', type: 'number', unit: 'kg', get: (c) => c.specs.weight },
  { key: 'topSpeed', label: 'V-max', type: 'number', unit: 'km/h', get: (c) => c.specs.topSpeed },
  {
    key: 'zeroToHundred',
    label: '0–100',
    type: 'number',
    unit: 's',
    get: (c) => c.specs.zeroToHundred,
  },
];

const formatCell = (column, car) => {
  const value = column.get(car);
  return column.unit ? `${value} ${column.unit}` : value;
};

const compareBy = (column, direction) => (a, b) => {
  const valueA = column.get(a);
  const valueB = column.get(b);
  const result =
    column.type === 'number' ? valueA - valueB : String(valueA).localeCompare(String(valueB), 'pl');
  return result * direction;
};

const headMarkup = () =>
  COLUMNS.map(
    (column) => `
      <th scope="col" aria-sort="${ARIA_NONE}" data-sort-key="${column.key}">
        <button type="button" class="spec-table__sort">
          <span>${column.label}</span>
          <span class="spec-table__sort-icon" aria-hidden="true"></span>
        </button>
      </th>`
  ).join('');

const bodyMarkup = (rows) =>
  rows
    .map(
      (car) =>
        `<tr>${COLUMNS.map((column) =>
          column.rowHeader
            ? `<th scope="row">${formatCell(column, car)}</th>`
            : `<td>${formatCell(column, car)}</td>`
        ).join('')}</tr>`
    )
    .join('');

export const renderSpecTable = (tableEl) => {
  if (!tableEl) {
    return;
  }

  tableEl.innerHTML = `
    <caption class="visually-hidden">
      Dane techniczne bolidów Velocity Grid. Kliknij nagłówek kolumny, aby posortować.
    </caption>
    <thead>
      <tr>${headMarkup()}</tr>
    </thead>
    <tbody>${bodyMarkup(cars)}</tbody>`;

  const tbody = tableEl.querySelector('tbody');
  const headers = Array.from(tableEl.querySelectorAll('th[data-sort-key]'));
  let activeKey = null;
  let direction = DIR_ASC;

  const sortByColumn = (column, headerEl) => {
    direction = activeKey === column.key ? -direction : DIR_ASC;
    activeKey = column.key;

    tbody.innerHTML = bodyMarkup([...cars].sort(compareBy(column, direction)));

    headers.forEach((header) => header.setAttribute('aria-sort', ARIA_NONE));
    headerEl.setAttribute('aria-sort', direction === DIR_ASC ? ARIA_ASC : ARIA_DESC);
  };

  headers.forEach((header) => {
    const column = COLUMNS.find((col) => col.key === header.dataset.sortKey);
    header
      .querySelector('.spec-table__sort')
      .addEventListener('click', () => sortByColumn(column, header));
  });
};
