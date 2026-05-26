const TOKEN_KEY = 'rp_token';
const USER_KEY  = 'rp_user';

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
    firstName:    String(p.sub ?? ''),
    firstSurname: '',
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

export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;
  const p = parseJwt(token);
  return typeof p.exp === 'number' && p.exp * 1000 > Date.now();
}

export function isAdmin(): boolean {
  return getUser()?.userType === 'ADMIN';
}

export function isStudent(): boolean {
  return getUser()?.userType === 'STUDENT';
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
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