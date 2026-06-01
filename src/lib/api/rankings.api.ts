import { apiFetch } from './client';
import type { PagedResponse, RankingDto, RankingStudentDto } from './types';

export const rankingsApi = {
  findAll: (activeOnly = false) =>
    apiFetch<RankingDto[]>(`/api/rankings${activeOnly ? '?active=true' : ''}`),
  getLeaderboard: (rankingId: string, page = 0, size = 20) =>
    apiFetch<PagedResponse<RankingStudentDto>>(
      `/api/rankings/${rankingId}/leaderboard?page=${page}&size=${size}`
    ),
  create: (p: { rankingName: string; description?: string; periodType: string; sourceFilter: string }) =>
    apiFetch<RankingDto>('/api/rankings', { method: 'POST', body: JSON.stringify(p) }),
  update: (id: string, p: { rankingName?: string; description?: string; periodType?: string; sourceFilter?: string }) =>
    apiFetch<RankingDto>(`/api/rankings/${id}`, { method: 'PUT', body: JSON.stringify(p) }),
  activate:   (id: string) => apiFetch<RankingDto>(`/api/rankings/${id}/activate`, { method: 'PUT' }),
  deactivate: (id: string) => apiFetch<void>(`/api/rankings/${id}`, { method: 'DELETE' }),
};