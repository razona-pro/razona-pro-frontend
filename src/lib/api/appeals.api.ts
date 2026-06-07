import { apiFetch } from './client';
import type { PagedResponse } from './types';

export interface AccountStatusDto {
  active: boolean;
  deactivationReason?: 'FRAUD' | 'MANUAL' | null;
  hasPendingAppeal: boolean;
  lastAppealStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | null;
  lastAdminResponse?: string | null;
}

export interface AppealDto {
  appealId: string;
  studentId: string;
  programId: string;
  studentName?: string;
  deactivationReason?: 'FRAUD' | 'MANUAL' | null;
  message: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminResponse?: string | null;
  resolvedBy?: string | null;
  createdAt: string;
  resolvedAt?: string | null;
}

export const appealsApi = {
  /** Público: estado de la cuenta (re-valida credenciales). */
  accountStatus: (code: string, email: string, password: string) =>
    apiFetch<AccountStatusDto>('/api/appeals/account-status', {
      method: 'POST',
      body: JSON.stringify({ code, email, password }),
    }),

  /** Público: enviar apelación. */
  submit: (code: string, email: string, password: string, message: string) =>
    apiFetch<AppealDto>('/api/appeals/submit', {
      method: 'POST',
      body: JSON.stringify({ code, email, password, message }),
    }),

  /** Admin: listar apelaciones (filtro opcional por estado). */
  list: (status?: string, page = 0, size = 20) => {
    let url = `/api/appeals?page=${page}&size=${size}`;
    if (status) url += `&status=${status}`;
    return apiFetch<PagedResponse<AppealDto>>(url);
  },

  /** Admin: resolver (aprobar reactiva la cuenta). */
  resolve: (appealId: string, approve: boolean, response?: string) =>
    apiFetch<AppealDto>(`/api/appeals/${appealId}/resolve`, {
      method: 'PUT',
      body: JSON.stringify({ approve, response }),
    }),
};
