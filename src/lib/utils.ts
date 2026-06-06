import { COMP_KEY_KEYWORDS } from './constants';

// Paleta modular: cualquier competencia recibe un color estable (no "quemado").
// El mismo competenceId siempre cae en el mismo color, en admin y en estudiante.
const COMP_PALETTE: { color: string; bg: string }[] = [
  { color: '#D41224', bg: '#FEE2E2' },
  { color: '#2563EB', bg: '#DBEAFE' },
  { color: '#059669', bg: '#D1FAE5' },
  { color: '#7C3AED', bg: '#EDE9FE' },
  { color: '#D97706', bg: '#FEF3C7' },
  { color: '#0891B2', bg: '#CFFAFE' },
  { color: '#DB2777', bg: '#FCE7F3' },
  { color: '#65A30D', bg: '#ECFCCB' },
  { color: '#9333EA', bg: '#F3E8FF' },
  { color: '#EA580C', bg: '#FFEDD5' },
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function compInitials(name: string, fallback: string): string {
  const words = (name || '').trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (fallback || '?').slice(0, 2).toUpperCase();
}

/**
 * Estilo de competencia. El color/bg son deterministas por competenceId (modulares),
 * el `key` se sigue derivando del nombre para conservar el ruteo /tests/{key}.
 */
export function getCompStyle(competenceId: string, name = '') {
  const n = (name || '').toLowerCase();
  let key = '';
  for (const [kw, style] of COMP_KEY_KEYWORDS) {
    if (n.includes(kw)) { key = style.key; break; }
  }
  const seed = competenceId || name || 'default';
  const pal  = COMP_PALETTE[hashString(seed) % COMP_PALETTE.length];
  return { color: pal.color, bg: pal.bg, short: compInitials(name, competenceId), key, name };
}

export function animCount(el: HTMLElement | null, target: number, dec = 0) {
  if (!el) return;
  let start: number | null = null;
  const dur = 900;
  const step = (ts: number) => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = dec
      ? (ease * target).toFixed(dec)
      : String(Math.floor(ease * target));
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = dec ? target.toFixed(dec) : String(target);
  };
  requestAnimationFrame(step);
}

export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CO', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  });
}

export function fmtDuration(secs?: number): string {
  if (!secs) return '';
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  if (m === 0) return `${s}s`;
  return s > 0 ? `${m}m ${s}s` : `${m} min`;
}

export function fmtTimer(secs: number): string {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function scoreColor(score?: number): string {
  if (score == null) return '#6B7280';
  if (score >= 80) return '#059669';
  if (score >= 60) return '#D97706';
  return '#D41224';
}

export function clsx(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}