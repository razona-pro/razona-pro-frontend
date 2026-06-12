import { apiFetch } from './client';
import type { PagedResponse, TriedDto, TriedReviewDto, TriedResumeDto, TriedEligibilityDto } from './types';

export const triedsApi = {
  /** ¿Puede el estudiante entrar a esta prueba? Indica también si hay un intento activo para reanudar. */
  eligibility: (testId: string) =>
    apiFetch<TriedEligibilityDto>(
      `/api/trieds/eligibility?testId=${encodeURIComponent(testId)}`),
  findMy: (page = 0, size = 100) =>
    apiFetch<PagedResponse<TriedDto>>(`/api/trieds/my?page=${page}&size=${size}`),
  /** Admin: historial de intentos. studentId y status son filtros opcionales. */
  findAll: (page = 0, size = 20, studentId?: string, status?: string) => {
    let url = `/api/trieds?page=${page}&size=${size}`;
    if (studentId) url += `&studentId=${encodeURIComponent(studentId)}`;
    if (status)    url += `&status=${status}`;
    return apiFetch<PagedResponse<TriedDto>>(url);
  },
  findById: (triedId: string) => apiFetch<TriedDto>(`/api/trieds/${triedId}`),
  /** Reanuda un intento; el tiempo restante lo decide el servidor. */
  resume: (triedId: string) =>
    apiFetch<TriedResumeDto>(`/api/trieds/${triedId}/resume`),
  /** Registra un evento sospechoso (cambio de pestaña, etc.). */
  reportFraud: (triedId: string) =>
    apiFetch<TriedDto>(`/api/trieds/${triedId}/fraud`, { method: 'POST' }),
  start: (testId: string) =>
    apiFetch<TriedDto>('/api/trieds/start', {
      method: 'POST',
      body: JSON.stringify({ testId }),
    }),
  submitAnswer: (triedId: string, questionId: string, optionId: string, competenceId?: string) =>
    apiFetch<TriedDto>(`/api/trieds/${triedId}/answer`, {
      method: 'POST',
      body: JSON.stringify({ questionId, optionId, competenceId }),
    }),
  finish: (triedId: string, timeSpentSeconds?: number) =>
    apiFetch<TriedDto>(
      `/api/trieds/${triedId}/finish${timeSpentSeconds != null ? `?timeSpentSeconds=${timeSpentSeconds}` : ''}`,
      { method: 'PUT' }
    ),
  /** Solo administradores: revisión completa con respuestas correctas y explicaciones. */
  getReview: (triedId: string) =>
    apiFetch<TriedReviewDto>(`/api/trieds/${triedId}/review`),
  /** El estudiante renuncia a su retroalimentación de un solo uso (al salir sin verla). */
  forfeitReview: (triedId: string) =>
    apiFetch<void>(`/api/trieds/${triedId}/forfeit-review`, { method: 'POST' }),
  /** Desglose de aciertos por competencia (sin revelar respuestas); lo puede ver el estudiante dueño. */
  getBreakdown: (triedId: string) =>
    apiFetch<{ competenceId: string; correct: number; total: number }[]>(
      `/api/trieds/${triedId}/breakdown`),
};