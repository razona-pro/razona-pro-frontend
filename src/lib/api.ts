const BASE_URL = import.meta.env.PUBLIC_API_URL ?? 'http://localhost:8080';

// ── Tipos ─────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  code?: string;
  data?: T;
  errors?: Record<string, string>;
  timestamp?: string;
}

export interface PagedResponse<T> {
  content:       T[];
  page:          number;
  size:          number;
  totalElements: number;
  totalPages:    number;
  last:          boolean;
}

export interface AuthResponse  { token: string; }

export interface StudentDto {
  studentId:         string;
  programId:         string;
  firstName:         string;
  secondName?:       string;
  firstSurname:      string;
  secondSurname?:    string;
  email:             string;
  phone:             string;
  isActive:          boolean;
  emailVerified:     boolean;
  identityVerified:  boolean;
}

export interface AdminDto {
  adminId:       string;
  firstName:     string;
  secondName?:   string;
  firstSurname:  string;
  secondSurname?: string;
  email:         string;
  phone:         string;
  isActive:      boolean;
  lastLoginAt?:  string;
  createdAt?:    string;
}

export interface ProgramDto {
  programId:    string;
  programName:  string;
  description?: string;
  isActive:     boolean;
}

export interface CompetenceDto {
  competenceId:   string;
  competenceName: string;
  description?:   string;
  isActive:       boolean;
}

export interface TestDto {
  testId:               string;
  competenceId:         string;
  competenceName?:      string;
  testName:             string;
  description?:         string;
  durationSeconds:      number;
  questionsToPresent?:  number;
  testMode:             'PRACTICE' | 'EXAM' | 'TIMED';
  isActive:             boolean;
}

export interface TriedDto {
  triedId:            string;
  testId:             string;
  testName?:          string;
  competenceId:       string;
  status:             'IN_PROGRESS' | 'FINISHED' | 'ABANDONED' | 'TIMED_OUT';
  score?:             number;
  totalQuestions:     number;
  correctAnswers?:    number;
  timeSpentSeconds?:  number;
  attemptTimestamp:   string;
  finishedAt?:        string;
}

export interface RankingDto {
  rankingId:    string;
  rankingName:  string;
  description?: string;
  periodType:   string;
  sourceFilter: string;
  isActive:     boolean;
}

export interface RankingStudentDto {
  rankingStudentId: number;
  studentId:        string;
  studentName?:     string;
  programId:        string;
  totalScore:       number;
  triedsScore:      number;
  aiTriedsScore:    number;
  triedsCount:      number;
  aiTriedsCount:    number;
}

export interface QuestionDto {
  competenceId:   string;
  questionId:     string;
  statement:      string;
  explanation?:   string;
  source?:        string;
  difficultyLevel: string;
  isActive:       boolean;
  options?:       OptionDto[];
}

export interface OptionDto {
  optionId:  string;
  optionText: string;
  isCorrect?: boolean;
}

export interface HomeStatsDto {
  activeStudents:    number;
  completedTrieds:   number;
  activeCompetences: number;
  satisfactionRate:  number;
  totalQuestions:    number;
  totalTests:        number;
}

// ── Helper fetch ──────────────────────────────────────────────────
async function request<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url   = `${BASE_URL}${path}`;
  const token = typeof window !== 'undefined' ? localStorage.getItem('rp_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> ?? {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res  = await fetch(url, { ...options, headers });
  const json: ApiResponse<T> = await res.json();
  if (!res.ok && !json.success) throw json;
  return json;
}

// ── Auth ──────────────────────────────────────────────────────────
export type AuthRegisterPayload = {
  studentId:      string;
  firstName:      string;
  secondName?:    string;
  firstSurname:   string;
  secondSurname?: string;
  email:          string;
  phone:          string;
  password:       string;
};

export const authApi = {
  login: (email: string, password: string, code: string) =>
    request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, code }),
    }),

  register: (payload: AuthRegisterPayload) =>
    request<StudentDto>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // alias para registro.astro (mismo endpoint)
  studentRegister: (payload: AuthRegisterPayload) =>
    request<StudentDto>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  verifyEmail: (token: string) =>
    request<void>(`/api/auth/verify-email?token=${encodeURIComponent(token)}`),

  forgotPassword: (email: string, code: string, phone: string) =>
    request<void>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email, code, phone }),
    }),

  resetPassword: (token: string, newPassword: string) =>
    request<void>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    }),
};

// ── Students ──────────────────────────────────────────────────────
export const studentsApi = {
  me:       () => request<StudentDto>('/api/students/me'),
  findAll:  (page = 0, size = 20) => request<PagedResponse<StudentDto>>(`/api/students?page=${page}&size=${size}`),
  findById: (id: string) => request<StudentDto>(`/api/students/${id}`),
};

// ── Admins ────────────────────────────────────────────────────────
export const adminsApi = {
  findAll:  (page = 0, size = 20) => request<PagedResponse<AdminDto>>(`/api/admins?page=${page}&size=${size}`),
  findById: (id: string) => request<AdminDto>(`/api/admins/${id}`),
};

// ── Programs ──────────────────────────────────────────────────────
export const programsApi = {
  findActive: () => request<ProgramDto[]>('/api/programs/active'),
  findAll:    () => request<ProgramDto[]>('/api/programs'),
};

// ── Competences ───────────────────────────────────────────────────
export const competencesApi = {
  findAll:  (activeOnly = false) => request<CompetenceDto[]>(`/api/competences${activeOnly ? '?active=true' : ''}`),
  findById: (id: string) => request<CompetenceDto>(`/api/competences/${id}`),
};

// ── Tests ─────────────────────────────────────────────────────────
export const testsApi = {
  findAll:      (page = 0, size = 50) => request<PagedResponse<TestDto>>(`/api/tests?page=${page}&size=${size}`),
  findById:     (testId: string, competenceId: string) => request<TestDto>(`/api/tests/${testId}/${competenceId}`),
  getQuestions: (testId: string, competenceId: string) => request<QuestionDto[]>(`/api/tests/${testId}/${competenceId}/questions`),
};

// ── Trieds ────────────────────────────────────────────────────────
export const triedsApi = {
  findMy:  (page = 0, size = 100) => request<PagedResponse<TriedDto>>(`/api/trieds/my?page=${page}&size=${size}`),
  findById: (triedId: string) => request<TriedDto>(`/api/trieds/${triedId}`),
  start:   (testId: string, competenceId: string) =>
    request<TriedDto>('/api/trieds/start', {
      method: 'POST',
      body: JSON.stringify({ testId, competenceId }),
    }),
  submitAnswer: (triedId: string, questionId: string, optionId: string) =>
    request<TriedDto>(`/api/trieds/${triedId}/answer`, {
      method: 'POST',
      body: JSON.stringify({ questionId, optionId }),
    }),
  finish: (triedId: string, timeSpentSeconds?: number) =>
    request<TriedDto>(
      `/api/trieds/${triedId}/finish${timeSpentSeconds != null ? `?timeSpentSeconds=${timeSpentSeconds}` : ''}`,
      { method: 'PUT' }
    ),
};

// ── Rankings ──────────────────────────────────────────────────────
export const rankingsApi = {
  findAll:      (activeOnly = false) => request<RankingDto[]>(`/api/rankings${activeOnly ? '?active=true' : ''}`),
  getLeaderboard: (rankingId: string, page = 0, size = 20) =>
    request<PagedResponse<RankingStudentDto>>(`/api/rankings/${rankingId}/leaderboard?page=${page}&size=${size}`),
};

// ── Stats (público) ───────────────────────────────────────────────
export const statsApi = {
  home: () => request<HomeStatsDto>('/api/stats/home'),
};

// ── Health ────────────────────────────────────────────────────────
export const healthApi = {
  check: () => request<{ status: string; app: string; version: string }>('/api/health'),
};