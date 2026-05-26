import { COMP_KEY_KEYWORDS, COMP_STYLES } from './constants';

export function getCompStyle(competenceId: string, name = '') {
  const n = name.toLowerCase();
  for (const [kw, style] of COMP_KEY_KEYWORDS) {
    if (n.includes(kw)) return style;
  }
  return { color: '#6B7280', bg: '#F3F4F6', short: '?', key: '' };
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