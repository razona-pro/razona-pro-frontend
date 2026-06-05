import { apiFetch } from './client';
import type { ApiResponse, AuthResponse, StudentDto } from './types';

export const authApi = {
  login: (email: string, password: string, code: string) =>
    apiFetch<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, code }),
    }),

  register: (payload: {
    studentId: string;
    firstName: string;
    secondName?: string;
    firstSurname: string;
    secondSurname?: string;
    email: string;
    phone: string;
    password: string;
  }) =>
    apiFetch<StudentDto>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  verifyEmail: (token: string) =>
    apiFetch<void>(`/api/auth/verify-email?token=${encodeURIComponent(token)}`),

  resendVerification: (email: string) =>
    apiFetch<{ cooldownSeconds: number }>('/api/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  forgotPassword: (email: string, code: string, phone: string) =>
    apiFetch<void>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email, code, phone }),
    }),

  resetPassword: (token: string, newPassword: string) =>
    apiFetch<void>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    }),
};