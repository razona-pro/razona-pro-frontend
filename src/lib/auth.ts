// src/lib/auth.ts
// Utilidades de autenticación: manejo de token JWT en localStorage

import type { AuthResponse } from './api';

const TOKEN_KEY   = 'rp_token';
const USER_KEY    = 'rp_user';

export interface StoredUser {
  id: string;
  programId?: string;
  email: string;
  firstName: string;
  firstSurname: string;
  userType: 'ADMIN' | 'STUDENT';
}

// ── Guardar sesión ────────────────────────────────────────────────────────────

export function saveSession(auth: AuthResponse): void {
  localStorage.setItem(TOKEN_KEY, auth.token);
  const user: StoredUser = {
    id: auth.id,
    programId: auth.programId,
    email: auth.email,
    firstName: auth.firstName,
    firstSurname: auth.firstSurname,
    userType: auth.userType,
  };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// ── Leer sesión ───────────────────────────────────────────────────────────────

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): StoredUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;

  // Validación básica de expiración JWT (sin librería)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function isAdmin(): boolean {
  return getUser()?.userType === 'ADMIN';
}

export function isStudent(): boolean {
  return getUser()?.userType === 'STUDENT';
}

// ── Cerrar sesión ─────────────────────────────────────────────────────────────

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.location.href = '/login';
}

// ── Guard: redirigir si no autenticado ────────────────────────────────────────

export function requireAuth(redirectTo = '/login'): StoredUser {
  if (!isAuthenticated()) {
    window.location.href = redirectTo;
    throw new Error('No autenticado');
  }
  return getUser()!;
}

// ── Guard: redirigir si ya autenticado ───────────────────────────────────────

export function redirectIfAuthenticated(redirectTo = '/dashboard'): void {
  if (isAuthenticated()) {
    window.location.href = redirectTo;
  }
}
