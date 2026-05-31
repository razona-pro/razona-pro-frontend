import { apiFetch } from './client';
import type {
  AiTriedDto, PagedResponse, AiStatusDto, AiStartResponseDto,
  AiQuestionDto, AiAnswerResultDto, AiHintDto
} from './types';

export const aiTriedsApi = {
  // Estado del módulo IA
  status: () =>
    apiFetch<AiStatusDto>('/api/ai-trieds/status'),

  // Historial del estudiante
  findMy: (page = 0, size = 20) =>
    apiFetch<PagedResponse<AiTriedDto>>(
      `/api/ai-trieds/my?page=${page}&size=${size}`
    ),

  findById: (aiTriedId: string) =>
    apiFetch<AiTriedDto>(`/api/ai-trieds/${aiTriedId}`),

  // Iniciar sesión — genera batch completo y devuelve primera pregunta
  start: (competenceId: string, totalQuestions: number, description?: string) =>
    apiFetch<AiStartResponseDto>('/api/ai-trieds/start', {
      method: 'POST',
      body:   JSON.stringify({ competenceId, totalQuestions, description }),
    }),

  // Listar todas las preguntas del intento (para navegación)
  listQuestions: (aiTriedId: string) =>
    apiFetch<AiQuestionDto[]>(`/api/ai-trieds/${aiTriedId}/questions`),

  // Revisión con respuestas correctas reveladas
  getReview: (aiTriedId: string) =>
    apiFetch<AiQuestionDto[]>(`/api/ai-trieds/${aiTriedId}/review`),

  // Responder — body: { aiQuestionId, selectedIndex }
  submitAnswer: (aiTriedId: string, aiQuestionId: string, selectedIndex: number) =>
    apiFetch<AiAnswerResultDto>(`/api/ai-trieds/${aiTriedId}/answer`, {
      method: 'POST',
      body:   JSON.stringify({ aiQuestionId, selectedIndex }),
    }),

  // Pista progresiva — body: { aiQuestionId, hintLevel }
  getHint: (aiTriedId: string, aiQuestionId: string, hintLevel: number) =>
    apiFetch<AiHintDto>(`/api/ai-trieds/${aiTriedId}/hint`, {
      method: 'POST',
      body:   JSON.stringify({ aiQuestionId, hintLevel }),
    }),

  // Finalizar manualmente
  finish: (aiTriedId: string, timeSpentSeconds?: number) =>
    apiFetch<AiTriedDto>(
      `/api/ai-trieds/${aiTriedId}/finish${
        timeSpentSeconds != null ? `?timeSpentSeconds=${timeSpentSeconds}` : ''
      }`,
      { method: 'PUT' }
    ),
};

// Pistas para preguntas del banco estático
export const aiHintApi = {
  getHint: (competenceId: string, questionId: string, hintLevel: number) =>
    apiFetch<AiHintDto>(
      `/api/ai-hint?competenceId=${competenceId}&questionId=${questionId}&hintLevel=${hintLevel}`
    ),
};