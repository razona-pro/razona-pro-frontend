const TOKEN_KEY = 'rp_token';
const USER_KEY  = 'rp_user';
const LOGOUT_EVENT = 'rp_logout';

export interface StoredUser {
  id: string;
  programId?: string;
  email: string;
  firstName: string;
  secondName?: string;
  firstSurname: string;
  secondSurname?: string;
  userType: 'ADMIN' | 'STUDENT';
}

function parseJwt(token: string): Record<string, unknown> {
  try { return JSON.parse(atob(token.split('.')[1])); }
  catch { return {}; }
}

export function saveSession(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  const p = parseJwt(token);
  const user: StoredUser = {
    id:           String(p.sub ?? ''),
    programId:    p.programId ? String(p.programId) : undefined,
    email:        String(p.email ?? ''),
    firstName:    '',
    firstSurname: '',
    userType:     (p.userType as 'ADMIN' | 'STUDENT') ?? 'STUDENT',
  };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function updateStoredUser(updates: Partial<StoredUser>): void {
  const current = getUser();
  if (!current) return;
  const merged = { ...current, ...updates };
  localStorage.setItem(USER_KEY, JSON.stringify(merged));
  // Notificar a otros componentes en la misma pestaña
  window.dispatchEvent(new CustomEvent('rp:user-updated', { detail: merged }));
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

export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;
  const p = parseJwt(token);
  return typeof p.exp === 'number' && p.exp * 1000 > Date.now();
}

export function tokenSecondsLeft(): number {
  const token = getToken();
  if (!token) return 0;
  const p = parseJwt(token);
  if (typeof p.exp !== 'number') return 0;
  return Math.max(0, Math.floor((p.exp * 1000 - Date.now()) / 1000));
}

export function isAdmin(): boolean   { return getUser()?.userType === 'ADMIN'; }
export function isStudent(): boolean { return getUser()?.userType === 'STUDENT'; }

/** Nombre completo con los 4 segmentos no nulos */
export function getFullName(user: StoredUser | null): string {
  if (!user) return '';
  return [user.firstName, user.secondName, user.firstSurname, user.secondSurname]
    .filter(Boolean)
    .join(' ');
}

export function getInitials(user: StoredUser): string {
  return ((user.firstName?.[0] ?? '') + (user.firstSurname?.[0] ?? '')).toUpperCase();
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  try {
    const bc = new BroadcastChannel(LOGOUT_EVENT);
    bc.postMessage({ type: 'logout' });
    bc.close();
  } catch {}
  window.location.href = '/auth';
}

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

export function getTokenPayload(): Record<string, unknown> {
  const t = getToken();
  return t ? parseJwt(t) : {};
}

export function initSessionWatcher(onExpired: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  let bc: BroadcastChannel | null = null;
  try {
    bc = new BroadcastChannel(LOGOUT_EVENT);
    bc.onmessage = (e) => { if (e.data?.type === 'logout') onExpired(); };
  } catch {}

  const onStorage = (e: StorageEvent) => {
    if (e.key === TOKEN_KEY && !e.newValue) onExpired();
  };
  window.addEventListener('storage', onStorage);

  const interval = setInterval(() => {
    if (!isAuthenticated()) onExpired();
  }, 30_000);

  return () => {
    bc?.close();
    window.removeEventListener('storage', onStorage);
    clearInterval(interval);
  };
}