import { apiFetch } from './client';
import type {
  AiTriedDto, PagedResponse, AiStatusDto, AiStartResponseDto,
  AiQuestionDto, AiAnswerResultDto, AiHintDto
} from './types';

export const aiTriedsApi = {
  // ── Estado del módulo ─────────────────────────────────
  status: () =>
    apiFetch<AiStatusDto>('/api/ai-trieds/status'),

  // ── Historial ─────────────────────────────────────────
  findMy: (page = 0, size = 20) =>
    apiFetch<PagedResponse<AiTriedDto>>(
      `/api/ai-trieds/my?page=${page}&size=${size}`
    ),

  findById: (aiTriedId: string) =>
    apiFetch<AiTriedDto>(`/api/ai-trieds/${aiTriedId}`),

  // ── Flujo adaptativo ──────────────────────────────────
  /** Inicia sesión y devuelve la primera pregunta generada */
  start: (competenceId: string, totalQuestions: number, description?: string) =>
    apiFetch<AiStartResponseDto>('/api/ai-trieds/start', {
      method: 'POST',
      body:   JSON.stringify({ competenceId, totalQuestions, description }),
    }),

  /** Obtiene la siguiente pregunta (idempotente si ya hay una activa) */
  nextQuestion: (aiTriedId: string) =>
    apiFetch<AiQuestionDto>(`/api/ai-trieds/${aiTriedId}/next`),

  /** Envía respuesta — el servidor evalúa y adapta la dificultad */
  submitAnswer: (aiTriedId: string, questionId: string, selectedOptionId: string) =>
    apiFetch<AiAnswerResultDto>(`/api/ai-trieds/${aiTriedId}/answer`, {
      method: 'POST',
      body:   JSON.stringify({ questionId, selectedOptionId }),
    }),

  /** Solicita una pista en el nivel indicado (1, 2 o 3) */
  getHint: (aiTriedId: string, questionId: string, hintLevel: number) =>
    apiFetch<AiHintDto>(`/api/ai-trieds/${aiTriedId}/hint`, {
      method: 'POST',
      body:   JSON.stringify({ questionId, hintLevel }),
    }),

  /** Finaliza la sesión manualmente */
  finish: (aiTriedId: string, timeSpentSeconds?: number) =>
    apiFetch<AiTriedDto>(
      `/api/ai-trieds/${aiTriedId}/finish${
        timeSpentSeconds != null ? `?timeSpentSeconds=${timeSpentSeconds}` : ''
      }`,
      { method: 'PUT' }
    ),
};

// ── Pistas para tests estáticos ───────────────────────────────────────
export const aiHintApi = {
  getHint: (competenceId: string, questionId: string, hintLevel: number) =>
    apiFetch<AiHintDto>(
      `/api/ai-hint?competenceId=${competenceId}&questionId=${questionId}&hintLevel=${hintLevel}`
    ),
};