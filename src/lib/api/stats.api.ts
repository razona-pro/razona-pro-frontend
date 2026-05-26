import { apiFetch } from './client';
import type { HomeStatsDto } from './types';

export const statsApi = {
  home: () => apiFetch<HomeStatsDto>('/api/stats/home'),
};