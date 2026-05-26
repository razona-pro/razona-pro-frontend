const TOKEN_KEY = 'rp_token';
const USER_KEY  = 'rp_user';

export interface StoredUser {
  id:           string;
  programId?:   string;
  email:        string;
  firstName:    string;
  firstSurname: string;
  userType:     'ADMIN' | 'STUDENT';
}

/** Parsea el JWT y guarda sesión. firstName/firstSurname se rellenan después desde /api/students/me */
export function saveSession(data: { token: string }): void {
  localStorage.setItem(TOKEN_KEY, data.token);
  try {
    const payload = JSON.parse(atob(data.token.split('.')[1]));
    const user: StoredUser = {
      id:           payload.sub ?? '',
      programId:    payload.programId ?? undefined,
      email:        payload.email ?? '',
      firstName:    payload.sub ?? '',   // temporal, se actualiza al cargar perfil
      firstSurname: '',
      userType:     (payload.userType ?? 'STUDENT') as 'ADMIN' | 'STUDENT',
    };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch { /* ignorar */ }
}

export function updateStoredUser(updates: Partial<StoredUser>): void {
  const current = getUser();
  if (!current) return;
  localStorage.setItem(USER_KEY, JSON.stringify({ ...current, ...updates }));
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): StoredUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as StoredUser; } catch { return null; }
}

export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch { return false; }
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
  window.location.href = '/login';
}

export function requireAuth(redirectTo = '/login'): StoredUser {
  if (!isAuthenticated()) {
    window.location.href = redirectTo;
    throw new Error('No autenticado');
  }
  return getUser()!;
}

export function redirectIfAuthenticated(redirectTo = '/dashboard'): void {
  if (isAuthenticated()) window.location.href = redirectTo;
}