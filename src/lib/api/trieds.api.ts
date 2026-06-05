import { apiFetch } from './client';
import type { PagedResponse, TriedDto, TriedReviewDto, TriedResumeDto } from './types';

export const triedsApi = {
  findMy: (page = 0, size = 100) =>
    apiFetch<PagedResponse<TriedDto>>(`/api/trieds/my?page=${page}&size=${size}`),
  findByStudent: (studentId: string, page = 0, size = 100, status?: string) => {
    let url = `/api/trieds?studentId=${studentId}&page=${page}&size=${size}`;
    if (status) url += `&status=${status}`;
    return apiFetch<PagedResponse<TriedDto>>(url);
  },
  findById: (triedId: string) => apiFetch<TriedDto>(`/api/trieds/${triedId}`),
  /** Reanuda un intento; el tiempo restante lo decide el servidor. */
  resume: (triedId: string) =>
    apiFetch<TriedResumeDto>(`/api/trieds/${triedId}/resume`),
  /** Registra un evento sospechoso (cambio de pestaña, etc.). */
  reportFraud: (triedId: string) =>
    apiFetch<TriedDto>(`/api/trieds/${triedId}/fraud`, { method: 'POST' }),
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
  getReview: (triedId: string) =>
    apiFetch<TriedReviewDto>(`/api/trieds/${triedId}/review`),
};