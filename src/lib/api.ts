// src/lib/api.ts
// Cliente HTTP para consumir el backend de RazonaPro
// Los tipos de import.meta.env se declaran en src/env.d.ts

const BASE_URL = import.meta.env.PUBLIC_API_URL ?? 'http://localhost:8080';

// ── Tipos base ────────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string>;
  timestamp: string;
}

export interface AuthResponse {
  token: string;
  userType: 'ADMIN' | 'STUDENT';
  id: string;
  programId?: string;
  email: string;
  firstName: string;
  firstSurname: string;
}

export interface StudentDto {
  studentId: string;
  programId: string;
  programName?: string;
  firstName: string;
  secondName?: string;
  firstSurname: string;
  secondSurname?: string;
  email: string;
  phone: string;
  isActive: boolean;
  emailVerified: boolean;
  identityVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface ProgramDto {
  programId: string;
  programName: string;
  description?: string;
  isActive: boolean;
}

// ── Helper fetch ──────────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${path}`;

  const token = typeof window !== 'undefined'
    ? localStorage.getItem('rp_token')
    : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> ?? {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });
  const json: ApiResponse<T> = await res.json();

  if (!res.ok && !json.success) {
    throw json; // lanzamos el ApiResponse completo para manejar errors
  }

  return json;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export const authApi = {
  adminLogin: (email: string, password: string) =>
    request<AuthResponse>('/api/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  studentLogin: (email: string, password: string) =>
    request<AuthResponse>('/api/auth/student/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  studentRegister: (payload: {
    firstName: string;
    secondName?: string;
    firstSurname: string;
    secondSurname?: string;
    email: string;
    phone: string;
    password: string;
    programId: string;
  }) =>
    request<StudentDto>('/api/auth/student/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  verifyEmail: (token: string) =>
    request<void>(`/api/auth/verify-email?token=${encodeURIComponent(token)}`),
};

// ── Programas (público) ───────────────────────────────────────────────────────

export const programsApi = {
  findActive: () => request<ProgramDto[]>('/api/programs/active'),
};

// ── Health ────────────────────────────────────────────────────────────────────

export const healthApi = {
  check: () => request<{ status: string; app: string; version: string }>('/api/health'),
};