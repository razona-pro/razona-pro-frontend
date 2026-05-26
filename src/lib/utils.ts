// Mapa de colores por competencia
const COMP_COLOR_MAP: Record<string, { color: string; bg: string; short: string; key: string }> = {
  CPE001: { color: '#D41224', bg: '#FEE2E2', short: 'LC', key: 'lc' },
  CPE002: { color: '#2563EB', bg: '#DBEAFE', short: 'RC', key: 'rq' },
  CPE003: { color: '#059669', bg: '#D1FAE5', short: 'CC', key: 'cc' },
  CPE004: { color: '#7C3AED', bg: '#EDE9FE', short: 'CE', key: 'ce' },
  CPE005: { color: '#D97706', bg: '#FEF3C7', short: 'IN', key: 'en' },
};

export function getCompStyle(id: string, name = '') {
  if (COMP_COLOR_MAP[id]) return COMP_COLOR_MAP[id];
  const n = name.toLowerCase();
  if (n.includes('lectura') || n.includes('crit'))    return { color: '#D41224', bg: '#FEE2E2', short: 'LC', key: 'lc' };
  if (n.includes('cuantit') || n.includes('razon'))   return { color: '#2563EB', bg: '#DBEAFE', short: 'RC', key: 'rq' };
  if (n.includes('ciudadan'))                          return { color: '#059669', bg: '#D1FAE5', short: 'CC', key: 'cc' };
  if (n.includes('escrit') || n.includes('comunicac')) return { color: '#7C3AED', bg: '#EDE9FE', short: 'CE', key: 'ce' };
  if (n.includes('ingl'))                             return { color: '#D97706', bg: '#FEF3C7', short: 'IN', key: 'en' };
  return { color: '#6B7280', bg: '#F3F4F6', short: '?', key: '' };
}

export function animCount(el: HTMLElement | null, target: number, dec = 0) {
  if (!el) return;
  let start: number | undefined;
  const dur = 900;
  const run = (ts: number) => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = dec ? (e * target).toFixed(dec) : String(Math.floor(e * target));
    if (p < 1) requestAnimationFrame(run);
  };
  requestAnimationFrame(run);
}

export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function fmtDur(secs?: number) {
  if (!secs) return '';
  return `${Math.round(secs / 60)} min`;
}