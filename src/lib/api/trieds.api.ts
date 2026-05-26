import { apiFetch } from './client';
import type { PagedResponse, TriedDto } from './types';

export const triedsApi = {
  findMy: (page = 0, size = 100) =>
    apiFetch<PagedResponse<TriedDto>>(`/api/trieds/my?page=${page}&size=${size}`),
  findById: (triedId: string) => apiFetch<TriedDto>(`/api/trieds/${triedId}`),
  start: (testId: string, competenceId: string) =>
    apiFetch<TriedDto>('/api/trieds/start', {
      method: 'POST',
      body: JSON.stringify({ testId, competenceId }),
    }),
  submitAnswer: (triedId: string, questionId: string, optionId: string) =>
    apiFetch<TriedDto>(`/api/trieds/${triedId}/answer`, {
      method: 'POST',
      body: JSON.stringify({ questionId, optionId }),
    }),
  finish: (triedId: string, timeSpentSeconds?: number) =>
    apiFetch<TriedDto>(
      `/api/trieds/${triedId}/finish${timeSpentSeconds != null ? `?timeSpentSeconds=${timeSpentSeconds}` : ''}`,
      { method: 'PUT' }
    ),
};