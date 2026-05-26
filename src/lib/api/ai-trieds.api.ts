import { apiFetch } from './client';
import type { AiTriedDto, PagedResponse } from './types';

export const aiTriedsApi = {
  findMy: (page = 0, size = 20) =>
    apiFetch<PagedResponse<AiTriedDto>>(`/api/ai-trieds/my?page=${page}&size=${size}`),
  findById: (aiTriedId: string) => apiFetch<AiTriedDto>(`/api/ai-trieds/${aiTriedId}`),
  start: (competenceId: string, totalQuestions: number, description?: string) =>
    apiFetch<AiTriedDto>('/api/ai-trieds/start', {
      method: 'POST',
      body: JSON.stringify({ competenceId, totalQuestions, description }),
    }),
  submitAnswer: (
    aiTriedId: string,
    p: {
      questionText: string;
      studentAnswer: string;
      correctAnswer: string;
      isCorrect: boolean;
      competenceId: string;
    }
  ) =>
    apiFetch<AiTriedDto>(`/api/ai-trieds/${aiTriedId}/answer`, {
      method: 'POST',
      body: JSON.stringify(p),
    }),
  finish: (aiTriedId: string, timeSpentSeconds?: number) =>
    apiFetch<AiTriedDto>(
      `/api/ai-trieds/${aiTriedId}/finish${timeSpentSeconds != null ? `?timeSpentSeconds=${timeSpentSeconds}` : ''}`,
      { method: 'PUT' }
    ),
};