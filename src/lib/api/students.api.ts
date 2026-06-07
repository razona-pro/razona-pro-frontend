import { apiFetch } from './client';
import type { PagedResponse, StudentDto } from './types';

export const studentsApi = {
  me: () => apiFetch<StudentDto>('/api/students/me'),
  /** El estudiante edita su propio perfil (nombres y celular). */
  updateMe: (p: { firstName?: string; secondName?: string; firstSurname?: string; secondSurname?: string; phone?: string }) =>
    apiFetch<StudentDto>('/api/students/me', { method: 'PUT', body: JSON.stringify(p) }),
  findAll: (page = 0, size = 20, search?: string, programId?: string, status?: string) => {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (search)    params.set('search',    search);
    if (programId) params.set('programId', programId);
    if (status)    params.set('status',    status);
    return apiFetch<PagedResponse<StudentDto>>(`/api/students?${params}`);
  },
  findById: (id: string) => apiFetch<StudentDto>(`/api/students/${id}`),
  update: (
    id: string,
    p: { firstName?: string; secondName?: string; firstSurname?: string; secondSurname?: string; email?: string; phone?: string; isActive?: boolean }
  ) => apiFetch<StudentDto>(`/api/students/${id}`, { method: 'PUT', body: JSON.stringify(p) }),
  activate: (id: string) =>
    apiFetch<StudentDto>(`/api/students/${id}/activate`, { method: 'PUT' }),
  deactivate: (id: string) =>
    apiFetch<void>(`/api/students/${id}`, { method: 'DELETE' }),
};