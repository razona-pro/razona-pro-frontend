export const APP_NAME = 'RazonaPro';
export const APP_TAGLINE = 'Plataforma Saber Pro · UFPSO';
export const BRAND = '#D41224';
export const BRAND_DARK = '#9B1F24';

export const COMP_STYLES: Record<string, { color: string; bg: string; short: string; key: string; name: string }> = {
  default: { color: '#6B7280', bg: '#F3F4F6', short: '?', key: '', name: 'General' },
};

// Mapa dinámico por nombre de competencia
export const COMP_KEY_KEYWORDS: Array<[string, { color: string; bg: string; short: string; key: string }]> = [
  ['lectura',      { color: '#D41224', bg: '#FEE2E2', short: 'LC', key: 'lc' }],
  ['cuantit',      { color: '#2563EB', bg: '#DBEAFE', short: 'RC', key: 'rq' }],
  ['razon',        { color: '#2563EB', bg: '#DBEAFE', short: 'RC', key: 'rq' }],
  ['ciudadan',     { color: '#059669', bg: '#D1FAE5', short: 'CC', key: 'cc' }],
  ['escrit',       { color: '#7C3AED', bg: '#EDE9FE', short: 'CE', key: 'ce' }],
  ['comunicac',    { color: '#7C3AED', bg: '#EDE9FE', short: 'CE', key: 'ce' }],
  ['ingl',         { color: '#D97706', bg: '#FEF3C7', short: 'IN', key: 'en' }],
];

export const TEST_MODE_LABEL: Record<string, string> = {
  PRACTICE: 'Práctica',
  EXAM: 'Examen',
  TIMED: 'Cronometrado',
};

export const TEST_MODE_COLOR: Record<string, string> = {
  PRACTICE: '#059669',
  EXAM: '#2563EB',
  TIMED: '#D97706',
};

export const TEST_MODE_BG: Record<string, string> = {
  PRACTICE: '#D1FAE5',
  EXAM: '#DBEAFE',
  TIMED: '#FEF3C7',
};