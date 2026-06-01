import { apiFetch } from './client';
import type { CompetenceDto, QuestionDto, PagedResponse } from './types';

export const competencesApi = {
  findAll: (activeOnly = false) =>
    apiFetch<CompetenceDto[]>(`/api/competences${activeOnly ? '?active=true' : ''}`),
  findById: (id: string) => apiFetch<CompetenceDto>(`/api/competences/${id}`),
  create: (p: { competenceName: string; description?: string }) =>
    apiFetch<CompetenceDto>('/api/competences', { method: 'POST', body: JSON.stringify(p) }),
  update: (id: string, p: { competenceName: string; description?: string }) =>
    apiFetch<CompetenceDto>(`/api/competences/${id}`, { method: 'PUT', body: JSON.stringify(p) }),
  activate:   (id: string) => apiFetch<CompetenceDto>(`/api/competences/${id}/activate`, { method: 'PUT' }),
  deactivate: (id: string) => apiFetch<void>(`/api/competences/${id}`, { method: 'DELETE' }),

  getQuestions: (competenceId: string, page = 0, size = 50) =>
    apiFetch<PagedResponse<QuestionDto>>(
      `/api/competences/${competenceId}/questions?page=${page}&size=${size}`
    ),
  createQuestion: (
    competenceId: string,
    q: { statement: string; explanation?: string; source?: string; difficultyLevel: string; options: { optionText: string; isCorrect: boolean }[] }
  ) => apiFetch<QuestionDto>(`/api/competences/${competenceId}/questions`, { method: 'POST', body: JSON.stringify(q) }),
  updateQuestion: (
    competenceId: string, questionId: string,
    q: { statement: string; explanation?: string; source?: string; difficultyLevel: string }
  ) => apiFetch<QuestionDto>(`/api/competences/${competenceId}/questions/${questionId}`,
        { method: 'PUT', body: JSON.stringify(q) }),
  activateQuestion: (competenceId: string, questionId: string) =>
    apiFetch<QuestionDto>(`/api/competences/${competenceId}/questions/${questionId}/activate`, { method: 'PUT' }),
  deactivateQuestion: (competenceId: string, questionId: string) =>
    apiFetch<void>(`/api/competences/${competenceId}/questions/${questionId}`, { method: 'DELETE' }),
};