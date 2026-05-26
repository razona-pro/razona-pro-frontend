import { apiFetch } from './client';
import type { PagedResponse, ProgramDto } from './types';

export const programsApi = {
  findActive: () => apiFetch<ProgramDto[]>('/api/programs/active'),
  findAll: () => apiFetch<ProgramDto[]>('/api/programs'),
  findById: (id: string) => apiFetch<ProgramDto>(`/api/programs/${id}`),
  create: (p: { programId: string; programName: string; description?: string }) =>
    apiFetch<ProgramDto>('/api/programs', { method: 'POST', body: JSON.stringify(p) }),
  update: (id: string, p: { programName: string; description?: string }) =>
    apiFetch<ProgramDto>(`/api/programs/${id}`, { method: 'PUT', body: JSON.stringify(p) }),
  deactivate: (id: string) =>
    apiFetch<void>(`/api/programs/${id}`, { method: 'DELETE' }),
};