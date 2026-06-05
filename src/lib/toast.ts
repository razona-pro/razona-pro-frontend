type ToastType = 'success' | 'error' | 'warning' | 'info';
interface ToastOptions {
  duration?: number;
  description?: string;
}

// Barra lateral izquierda coloreada por tipo (como notificaciones de IDE)
const TYPE_ACCENT: Record<ToastType, string> = {
  success: '#059669',
  error:   '#DC2626',
  warning: '#D97706',
  info:    '#2563EB',
};

const ICONS: Record<ToastType, string> = {
  success: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  error:   `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  warning: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  info:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
};

class ToastManager {
  private container: HTMLElement | null = null;
  // Evita que aparezcan más de 4 a la vez
  private queue: HTMLElement[] = [];

  private getContainer(): HTMLElement {
    if (this.container) return this.container;
    this.container = document.createElement('div');
    Object.assign(this.container.style, {
      position:      'fixed',
      bottom:        '1.25rem',
      right:         '1.25rem',
      zIndex:        '9998',
      display:       'flex',
      flexDirection: 'column-reverse',   // más recientes arriba
      gap:           '6px',
      alignItems:    'flex-end',
      maxWidth:      '320px',
      width:         'calc(100vw - 2.5rem)',
      pointerEvents: 'none',
    });
    document.body.appendChild(this.container);
    return this.container;
  }

  show(message: string, type: ToastType = 'info', opts: ToastOptions = {}): void {
    const duration = opts.duration ?? 5000;
    const description = opts.description;
    const c = this.getContainer();
    const accent = TYPE_ACCENT[type];

    // Limitar a 4 toasts visibles
    if (this.queue.length >= 4) {
      const oldest = this.queue[0];
      this.dismiss(oldest);
    }

    const el = document.createElement('div');
    el.style.cssText = [
      'pointer-events:all',
      `background:var(--ui-card,#fff)`,
      'border-radius:10px',
      `padding:10px 12px 10px 14px`,
      'display:flex',
      'align-items:flex-start',
      'gap:9px',
      `box-shadow:0 4px 16px rgba(0,0,0,0.10),0 1px 4px rgba(0,0,0,0.06)`,
      `border:1px solid var(--ui-border,#E5E5E5)`,
      `border-left:3px solid ${accent}`,
      'transform:translateY(8px)',
      'opacity:0',
      'transition:transform 0.22s cubic-bezier(0.34,1.4,0.64,1),opacity 0.18s ease',
      'width:100%',
      'cursor:pointer',
      'user-select:none',
      'min-height:0',
    ].join(';');

    const iconEl = document.createElement('div');
    iconEl.style.cssText = `color:${accent};flex-shrink:0;padding-top:1px;line-height:0`;
    iconEl.innerHTML = ICONS[type];

    const textWrap = document.createElement('div');
    textWrap.style.cssText = 'flex:1;min-width:0';

    const msgEl = document.createElement('p');
    msgEl.style.cssText = `font-family:var(--font-ui);font-size:0.8125rem;font-weight:600;color:var(--ui-text-1,#1A1A1A);margin:0;line-height:1.4`;
    msgEl.textContent = message;
    textWrap.appendChild(msgEl);

    if (description) {
      const descEl = document.createElement('p');
      descEl.style.cssText = `font-family:var(--font-ui);font-size:0.75rem;color:var(--ui-text-3,#A3A3A3);margin:2px 0 0;line-height:1.45`;
      descEl.textContent = description;
      textWrap.appendChild(descEl);
    }

    const closeBtn = document.createElement('button');
    closeBtn.style.cssText = 'background:none;border:none;cursor:pointer;color:var(--ui-text-3,#A3A3A3);padding:0 0 0 4px;flex-shrink:0;line-height:0;font-size:14px;opacity:0.6';
    closeBtn.setAttribute('aria-label', 'Cerrar');
    closeBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

    el.appendChild(iconEl);
    el.appendChild(textWrap);
    el.appendChild(closeBtn);
    c.appendChild(el);
    this.queue.push(el);

    // Animate in
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.transform = 'translateY(0)';
      el.style.opacity   = '1';
    }));

    const timer = setTimeout(() => this.dismiss(el), duration);
    const dismiss = () => { clearTimeout(timer); this.dismiss(el); };
    el.addEventListener('click', dismiss);
    closeBtn.addEventListener('click', e => { e.stopPropagation(); dismiss(); });
  }

  private dismiss(el: HTMLElement) {
    if (!el.parentNode) return;
    el.style.transform = 'translateY(6px)';
    el.style.opacity   = '0';
    setTimeout(() => {
      el.remove();
      this.queue = this.queue.filter(e => e !== el);
    }, 200);
  }

  success(msg: string, opts?: ToastOptions) { this.show(msg, 'success', opts); }
  error(msg: string, opts?: ToastOptions)   { this.show(msg, 'error',   opts); }
  warning(msg: string, opts?: ToastOptions) { this.show(msg, 'warning', opts); }
  info(msg: string, opts?: ToastOptions)    { this.show(msg, 'info',    opts); }
}

export const toast = new ToastManager();
