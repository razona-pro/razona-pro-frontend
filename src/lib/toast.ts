type ToastType = 'success' | 'error' | 'warning' | 'info';
interface ToastOptions {
  duration?: number;
  description?: string;
}

const ICONS: Record<ToastType, string> = {
  success: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  error:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  warning: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  info:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
};

const STYLES: Record<ToastType, { iconBg: string; iconColor: string; border: string }> = {
  success: { iconBg: '#D1FAE5', iconColor: '#059669', border: '#A7F3D0' },
  error:   { iconBg: '#FEE2E2', iconColor: '#DC2626', border: '#FECACA' },
  warning: { iconBg: '#FEF3C7', iconColor: '#D97706', border: '#FDE68A' },
  info:    { iconBg: '#DBEAFE', iconColor: '#2563EB', border: '#BFDBFE' },
};

class ToastManager {
  private container: HTMLElement | null = null;

  private getContainer(): HTMLElement {
    if (this.container) return this.container;
    this.container = document.createElement('div');
    Object.assign(this.container.style, {
      position:      'fixed',
      top:           '1.25rem',
      right:         '1.25rem',
      zIndex:        '9998',
      display:       'flex',
      flexDirection: 'column',
      gap:           '0.5rem',
      alignItems:    'flex-end',
      maxWidth:      '360px',
      width:         'calc(100vw - 2.5rem)',
      pointerEvents: 'none',
    });
    document.body.appendChild(this.container);
    return this.container;
  }

  show(message: string, type: ToastType = 'info', opts: ToastOptions = {}): void {
    const { duration = 4500, description } = opts;
    const c = this.getContainer();
    const s = STYLES[type];

    const el = document.createElement('div');
    el.style.cssText = `
      pointer-events: all;
      background: #ffffff;
      border-radius: 0.875rem;
      padding: 0.875rem 1rem;
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
      border: 1px solid ${s.border};
      transform: translateX(calc(100% + 1.5rem));
      opacity: 0;
      transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease;
      width: 100%;
      cursor: pointer;
      user-select: none;
    `;

    el.innerHTML = `
      <div style="width:32px;height:32px;border-radius:8px;background:${s.iconBg};
           color:${s.iconColor};display:flex;align-items:center;
           justify-content:center;flex-shrink:0;">${ICONS[type]}</div>
      <div style="flex:1;min-width:0;padding-top:1px;">
        <p style="font-family:var(--font-ui);font-size:0.875rem;font-weight:600;
             color:#1A1A1A;margin:0 0 ${description ? '2px' : '0'};line-height:1.3;">${message}</p>
        ${description ? `<p style="font-family:var(--font-ui);font-size:0.75rem;color:#6B7280;margin:0;line-height:1.5;">${description}</p>` : ''}
      </div>
      <button style="background:none;border:none;cursor:pointer;color:#A3A3A3;padding:2px;
              flex-shrink:0;line-height:1;font-size:16px;" aria-label="Cerrar">×</button>
    `;

    c.appendChild(el);

    // animate in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transform = 'translateX(0)';
        el.style.opacity   = '1';
      });
    });

    const dismiss = () => {
      el.style.transform = 'translateX(calc(100% + 1.5rem))';
      el.style.opacity   = '0';
      setTimeout(() => el.remove(), 350);
    };

    el.addEventListener('click', dismiss);
    setTimeout(dismiss, duration);
  }

  success(msg: string, opts?: ToastOptions) { this.show(msg, 'success', opts); }
  error(msg: string, opts?: ToastOptions)   { this.show(msg, 'error',   opts); }
  warning(msg: string, opts?: ToastOptions) { this.show(msg, 'warning', opts); }
  info(msg: string, opts?: ToastOptions)    { this.show(msg, 'info',    opts); }
}

export const toast = new ToastManager();