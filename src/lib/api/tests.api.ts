import { apiFetch } from './client';
import type { PagedResponse, QuestionDto, TestDto } from './types';

export const testsApi = {
  findAll: (page = 0, size = 50) =>
    apiFetch<PagedResponse<TestDto>>(`/api/tests?page=${page}&size=${size}`),
  findById: (testId: string) =>
    apiFetch<TestDto>(`/api/tests/${testId}`),
  getQuestions: (testId: string) =>
    apiFetch<QuestionDto[]>(`/api/tests/${testId}/questions`),
  create: (p: {
    testName: string; description?: string;
    durationSeconds: number | null; questionsToPresent?: number; testMode: string;
    notifyStudents?: boolean;
  }) => apiFetch<TestDto>('/api/tests', { method: 'POST', body: JSON.stringify(p) }),
  update: (testId: string, p: {
    testName?: string; description?: string; durationSeconds?: number | null;
    questionsToPresent?: number; testMode?: string; isActive?: boolean;
  }) => apiFetch<TestDto>(`/api/tests/${testId}`, { method: 'PUT', body: JSON.stringify(p) }),
  activate: (testId: string) =>
    apiFetch<TestDto>(`/api/tests/${testId}/activate`, { method: 'PUT' }),
  // La competencia es la de la PREGUNTA (una prueba es multicompetencia).
  addQuestion: (testId: string, competenceId: string, questionId: string) =>
    apiFetch<void>(`/api/tests/${testId}/questions/${competenceId}/${questionId}`, { method: 'POST' }),
  removeQuestion: (testId: string, competenceId: string, questionId: string) =>
    apiFetch<void>(`/api/tests/${testId}/questions/${competenceId}/${questionId}`, { method: 'DELETE' }),
  deactivate: (testId: string) =>
    apiFetch<void>(`/api/tests/${testId}`, { method: 'DELETE' }),
};
