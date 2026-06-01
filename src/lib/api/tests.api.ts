import { apiFetch } from './client';
import type { PagedResponse, QuestionDto, TestDto } from './types';

export const testsApi = {
  findAll: (page = 0, size = 50) =>
    apiFetch<PagedResponse<TestDto>>(`/api/tests?page=${page}&size=${size}`),
  findById: (testId: string, competenceId: string) =>
    apiFetch<TestDto>(`/api/tests/${testId}/${competenceId}`),
  getQuestions: (testId: string, competenceId: string) =>
    apiFetch<QuestionDto[]>(`/api/tests/${testId}/${competenceId}/questions`),
  create: (p: {
    competenceId: string; testName: string; description?: string;
    durationSeconds: number; questionsToPresent?: number; testMode: string;
  }) => apiFetch<TestDto>('/api/tests', { method: 'POST', body: JSON.stringify(p) }),
  update: (testId: string, competenceId: string, p: {
    testName?: string; description?: string; durationSeconds?: number;
    questionsToPresent?: number; testMode?: string; isActive?: boolean;
  }) => apiFetch<TestDto>(`/api/tests/${testId}/${competenceId}`, { method: 'PUT', body: JSON.stringify(p) }),
  activate: (testId: string, competenceId: string) =>
    apiFetch<TestDto>(`/api/tests/${testId}/${competenceId}/activate`, { method: 'PUT' }),
  addQuestion: (testId: string, competenceId: string, questionId: string) =>
    apiFetch<void>(`/api/tests/${testId}/${competenceId}/questions/${questionId}`, { method: 'POST' }),
  removeQuestion: (testId: string, competenceId: string, questionId: string) =>
    apiFetch<void>(`/api/tests/${testId}/${competenceId}/questions/${questionId}`, { method: 'DELETE' }),
  deactivate: (testId: string, competenceId: string) =>
    apiFetch<void>(`/api/tests/${testId}/${competenceId}`, { method: 'DELETE' }),
};