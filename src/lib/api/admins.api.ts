import { apiFetch } from './client';
import type { AdminDto, PagedResponse } from './types';

export const adminsApi = {
  me: () => apiFetch<AdminDto>('/api/admins/me'),

  findAll: (page = 0, size = 20, search?: string, status?: string) => {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    return apiFetch<PagedResponse<AdminDto>>(`/api/admins?${params}`);
  },

  findById: (id: string) =>
    apiFetch<AdminDto>(`/api/admins/${id}`),

  create: (payload: {
    firstName: string;
    secondName?: string;
    firstSurname: string;
    secondSurname?: string;
    email: string;
  }) =>
    apiFetch<AdminDto>('/api/admins', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: {
    firstName?: string;
    secondName?: string;
    firstSurname?: string;
    secondSurname?: string;
    email?: string;
    phone?: string;
    isActive?: boolean;
  }) =>
    apiFetch<AdminDto>(`/api/admins/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  deactivate: (id: string) =>
    apiFetch<void>(`/api/admins/${id}`, { method: 'DELETE' }),
};