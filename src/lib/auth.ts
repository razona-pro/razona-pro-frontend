const TOKEN_KEY = 'rp_token';
const USER_KEY  = 'rp_user';
const LOGOUT_EVENT = 'rp_logout'; // BroadcastChannel event name

export interface StoredUser {
  id: string;
  programId?: string;
  email: string;
  firstName: string;
  firstSurname: string;
  userType: 'ADMIN' | 'STUDENT';
}

function parseJwt(token: string): Record<string, unknown> {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return {};
  }
}

export function saveSession(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  const p = parseJwt(token);
  const user: StoredUser = {
    id:           String(p.sub ?? ''),
    programId:    p.programId ? String(p.programId) : undefined,
    email:        String(p.email ?? ''),
    firstName:    '',        // ← vacío, se llena desde la API
    firstSurname: '',        // ← vacío, se llena desde la API
    userType:     (p.userType as 'ADMIN' | 'STUDENT') ?? 'STUDENT',
  };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function updateStoredUser(updates: Partial<StoredUser>): void {
  const current = getUser();
  if (!current) return;
  localStorage.setItem(USER_KEY, JSON.stringify({ ...current, ...updates }));
}

export function getToken(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
}

export function getUser(): StoredUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as StoredUser; } catch { return null; }
}

/** Verifica si el token es válido y no está expirado */
export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;
  const p = parseJwt(token);
  return typeof p.exp === 'number' && p.exp * 1000 > Date.now();
}

/** Retorna los segundos restantes del token, o 0 si expiró */
export function tokenSecondsLeft(): number {
  const token = getToken();
  if (!token) return 0;
  const p = parseJwt(token);
  if (typeof p.exp !== 'number') return 0;
  return Math.max(0, Math.floor((p.exp * 1000 - Date.now()) / 1000));
}

export function isAdmin(): boolean {
  return getUser()?.userType === 'ADMIN';
}

export function isStudent(): boolean {
  return getUser()?.userType === 'STUDENT';
}

/**
 * Cierra sesión: limpia storage, notifica otras pestañas, redirige.
 * showConfirm=true muestra modal nativo de confirmación.
 */
export function logout(showConfirm = false): void {
  if (showConfirm) {
    // El modal de confirmación se maneja desde el componente que llama
    // Esta función es llamada ya con confirmación
  }
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  // Notificar otras pestañas
  try {
    const bc = new BroadcastChannel(LOGOUT_EVENT);
    bc.postMessage({ type: 'logout' });
    bc.close();
  } catch { /* BroadcastChannel no disponible */ }
  window.location.href = '/auth';
}

/** Redirects to /auth if not authenticated. Returns user or throws. */
export function requireAuth(redirect = '/auth'): StoredUser {
  if (!isAuthenticated()) {
    window.location.replace(redirect);
    throw new Error('Unauthenticated');
  }
  return getUser()!;
}

export function redirectIfAuthenticated(to = '/dashboard'): void {
  if (isAuthenticated()) window.location.replace(to);
}

export function getInitials(user: StoredUser): string {
  return ((user.firstName[0] ?? '') + (user.firstSurname[0] ?? user.firstName[1] ?? '')).toUpperCase();
}

export function getFullName(user: StoredUser): string {
  return user.firstSurname ? `${user.firstName} ${user.firstSurname}` : user.firstName;
}

export function getTokenPayload(): Record<string, unknown> {
  const t = getToken();
  return t ? parseJwt(t) : {};
}

/**
 * Inicializa el watcher de sesión:
 * - Escucha BroadcastChannel para logout entre pestañas
 * - Monitorea expiración del token en tiempo real
 * - Llama onExpired cuando el token expira o se cierra sesión
 */
export function initSessionWatcher(onExpired: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  // Escuchar logout desde otras pestañas
  let bc: BroadcastChannel | null = null;
  try {
    bc = new BroadcastChannel(LOGOUT_EVENT);
    bc.onmessage = (e) => {
      if (e.data?.type === 'logout') onExpired();
    };
  } catch { /* BroadcastChannel no disponible */ }

  // Escuchar cambios en localStorage (soporte fallback)
  const onStorage = (e: StorageEvent) => {
    if (e.key === TOKEN_KEY && !e.newValue) onExpired();
  };
  window.addEventListener('storage', onStorage);

  // Verificar expiración periódicamente
  const interval = setInterval(() => {
    if (!isAuthenticated()) onExpired();
  }, 30_000); // cada 30s

  // Cleanup
  return () => {
    bc?.close();
    window.removeEventListener('storage', onStorage);
    clearInterval(interval);
  };
}