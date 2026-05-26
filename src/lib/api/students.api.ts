import { apiFetch } from './client';
import type { PagedResponse, StudentDto } from './types';

export const studentsApi = {
  me: () => apiFetch<StudentDto>('/api/students/me'),
  findAll: (page = 0, size = 20) =>
    apiFetch<PagedResponse<StudentDto>>(`/api/students?page=${page}&size=${size}`),
  findById: (id: string) => apiFetch<StudentDto>(`/api/students/${id}`),
  update: (
    id: string,
    p: { firstName?: string; firstSurname?: string; phone?: string; isActive?: boolean }
  ) => apiFetch<StudentDto>(`/api/students/${id}`, { method: 'PUT', body: JSON.stringify(p) }),
  deactivate: (id: string) =>
    apiFetch<void>(`/api/students/${id}`, { method: 'DELETE' }),
};