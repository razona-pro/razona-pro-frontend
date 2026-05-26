export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  code?: string;
  data?: T;
  errors?: Record<string, string>;
  timestamp?: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// ── Auth ──────────────────────────────────────────────────────────
export interface AuthResponse { token: string }

// ── Users ─────────────────────────────────────────────────────────
export interface StudentDto {
  studentId: string;
  programId: string;
  firstName: string;
  secondName?: string;
  firstSurname: string;
  secondSurname?: string;
  email: string;
  phone: string;
  isActive: boolean;
  emailVerified: boolean;
  identityVerified: boolean;
}

export interface AdminDto {
  adminId: string;
  firstName: string;
  secondName?: string;
  firstSurname: string;
  secondSurname?: string;
  email: string;
  phone: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt?: string;
}

// ── Programs & Competences ────────────────────────────────────────
export interface ProgramDto {
  programId: string;
  programName: string;
  description?: string;
  isActive: boolean;
}

export interface CompetenceDto {
  competenceId: string;
  competenceName: string;
  description?: string;
  isActive: boolean;
}

// ── Questions ─────────────────────────────────────────────────────
export interface OptionDto {
  optionId: string;
  optionText: string;
  isCorrect?: boolean;
}

export interface QuestionDto {
  competenceId: string;
  questionId: string;
  statement: string;
  explanation?: string;
  source?: string;
  difficultyLevel: string;
  isActive: boolean;
  options?: OptionDto[];
}

// ── Tests ─────────────────────────────────────────────────────────
export interface TestDto {
  testId: string;
  competenceId: string;
  competenceName?: string;
  testName: string;
  description?: string;
  durationSeconds: number;
  questionsToPresent?: number;
  testMode: 'PRACTICE' | 'EXAM' | 'TIMED';
  isActive: boolean;
}

// ── Trieds ────────────────────────────────────────────────────────
export interface TriedDto {
  triedId: string;
  testId: string;
  testName?: string;
  competenceId: string;
  status: 'IN_PROGRESS' | 'FINISHED' | 'ABANDONED' | 'TIMED_OUT';
  score?: number;
  totalQuestions: number;
  correctAnswers?: number;
  timeSpentSeconds?: number;
  attemptTimestamp: string;
  finishedAt?: string;
}

// ── Rankings ──────────────────────────────────────────────────────
export interface RankingDto {
  rankingId: string;
  rankingName: string;
  description?: string;
  periodType: string;
  sourceFilter: string;
  isActive: boolean;
}

export interface RankingStudentDto {
  rankingStudentId: number;
  studentId: string;
  studentName?: string;
  programId: string;
  totalScore: number;
  triedsScore: number;
  aiTriedsScore: number;
  triedsCount: number;
  aiTriedsCount: number;
}

// ── Stats ─────────────────────────────────────────────────────────
export interface HomeStatsDto {
  activeStudents: number;
  completedTrieds: number;
  activeCompetences: number;
  satisfactionRate: number;
  totalQuestions: number;
  totalTests: number;
}

// ── AI Trieds ─────────────────────────────────────────────────────
export interface AiTriedDto {
  aiTriedId: string;
  status: 'IN_PROGRESS' | 'FINISHED' | 'ABANDONED';
  score?: number;
  totalQuestions: number;
  correctAnswers?: number;
  timeSpentSeconds?: number;
  description?: string;
  attemptTimestamp: string;
  finishedAt?: string;
}