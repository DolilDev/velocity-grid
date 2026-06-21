const VIEWBOX = '0 30 340 110';
const ART_WIDTH = 340;
const ART_HEIGHT = 110;

export const carArt = (car, { className = 'car-card__art' } = {}) => {
  const { id, name, colors } = car;
  const gradientId = `body-${id}`;

  return `
    <svg
      class="${className}"
      viewBox="${VIEWBOX}"
      width="${ART_WIDTH}"
      height="${ART_HEIGHT}"
      role="img"
      aria-label="Stylizowana sylwetka bolidu ${name}"
    >
      <defs>
        <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${colors.from}" />
          <stop offset="100%" stop-color="${colors.to}" />
        </linearGradient>
      </defs>

      <rect x="300" y="44" width="36" height="8" rx="3" fill="${colors.to}" />
      <rect x="320" y="44" width="10" height="48" rx="3" fill="${colors.to}" />

      <rect x="6" y="104" width="46" height="7" rx="3" fill="${colors.from}" />

      <path
        d="M14 112 L14 100 C28 90 64 86 106 86 L134 74 L150 72 L198 72 C232 72 252 78 300 82 L328 86 L328 102 L320 112 Z"
        fill="url(#${gradientId})"
      />

      <path d="M150 72 Q172 52 198 72 Z" fill="${colors.to}" />

      <path
        d="M140 78 Q170 48 200 76"
        fill="none"
        stroke="#0b0b12"
        stroke-width="5"
        stroke-linecap="round"
        opacity="0.85"
      />

      <rect x="60" y="108" width="180" height="4" rx="2" fill="#ffffff" opacity="0.18" />

      <circle cx="96" cy="104" r="28" fill="#0e0e15" />
      <circle cx="96" cy="104" r="14" fill="#23232f" />
      <circle cx="96" cy="104" r="5" fill="${colors.from}" />
      <circle cx="258" cy="102" r="30" fill="#0e0e15" />
      <circle cx="258" cy="102" r="15" fill="#23232f" />
      <circle cx="258" cy="102" r="5" fill="${colors.to}" />
    </svg>`;
};
