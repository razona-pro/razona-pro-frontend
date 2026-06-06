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
export interface CompetenceRef {
  competenceId: string;
  competenceName: string;
}

export interface TestDto {
  testId: string;
  testName: string;
  description?: string;
  durationSeconds: number | null;
  questionsToPresent?: number;
  testMode: 'PRACTICE' | 'EXAM' | 'TIMED';
  isActive: boolean;
  /** Competencias asociadas a la prueba (multicompetencia). */
  competences?: CompetenceRef[];
  difficultyBreakdown?: { B?: number; M?: number; A?: number };
  /** Total de preguntas asignadas (se presentan todas si questionsToPresent es null). */
  questionCount?: number;
}

// ── Trieds ────────────────────────────────────────────────────────
export interface TriedDto {
  triedId: string;
  studentId?: string;
  programId?: string;
  testId: string;
  testName?: string;
  status: 'IN_PROGRESS' | 'FINISHED' | 'ABANDONED' | 'TIMED_OUT' | 'ANULADO';
  score?: number;
  totalQuestions: number;
  correctAnswers?: number;
  timeSpentSeconds?: number;
  fraudAttempts?: number;
  attemptTimestamp: string;
  finishedAt?: string;
  questions?: any[];
  questionIds?: string[];
}

export interface TriedResumeDto {
  tried: TriedDto;
  /** Segundos restantes. null = sin tiempo (práctica). 0 = expirado. */
  remainingSeconds: number | null;
  durationSeconds: number | null;
  expired: boolean;
  closed: boolean;
  /** Modo real del test desde el servidor, no del parámetro de URL. */
  testMode?: 'PRACTICE' | 'EXAM' | 'TIMED';
  /** Respuestas previamente guardadas (questionId → optionId). null si cerrado. */
  savedAnswers?: Record<string, string>;
}

export interface TriedEligibilityDto {
  /** true si puede entrar (iniciar nuevo o reanudar uno activo). */
  allowed: boolean;
  /** Motivo cuando no se permite entrar (null si allowed). */
  reason: string | null;
  testActive: boolean;
  hasQuestions: boolean;
  /** Si != null, hay un intento activo que debe REANUDARSE en vez de iniciar uno nuevo. */
  inProgressTriedId: string | null;
}

// ── Rankings ──────────────────────────────────────────────────────
export interface RankingDto {
  rankingId: string;
  rankingName: string;
  description?: string;
  periodType: string;
  sourceFilter: string;
  competenceId?: string | null;
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
export interface OptionReview {
  optionId: string;
  optionText: string;
  isCorrect: boolean;
  wasSelected: boolean;
}

export interface QuestionReview {
  questionId: string;
  competenceId?: string;
  statement: string;
  explanation?: string;
  source?: string;
  difficultyLevel: string;
  answeredCorrectly: boolean;
  selectedOptionId?: string;
  correctOptionId?: string;
  options: OptionReview[];
}

export interface TriedReviewDto {
  triedId: string;
  testId: string;
  testName?: string;
  status: string;
  score?: number;
  totalQuestions: number;
  correctAnswers?: number;
  timeSpentSeconds?: number;
  attemptTimestamp: string;
  finishedAt?: string;
  questions: QuestionReview[];
}

export interface AiTriedDto {
  aiTriedId: string;
  studentId?: string;
  programId?: string;
  competenceId?: string;
  status: 'IN_PROGRESS' | 'FINISHED' | 'ABANDONED' | 'ANULADO';
  score?: number;
  totalQuestions: number;
  correctAnswers?: number;
  questionsGenerated?: number;
  answeredQuestions?: number;
  maxPossibleScore?: number;
  timeSpentSeconds?: number;
  description?: string;
  attemptTimestamp: string;
  finishedAt?: string;
}

export interface AiOptionDto {
  id:   string;   // "OPT0", "OPT1", etc.
  text: string;
}

export interface AiQuestionDto {
  aiQuestionId:    string;
  statement:       string;
  options:         AiOptionDto[];
  difficultyLevel: number;
  questionNumber:  number;
  totalQuestions:  number;
  hintsUsed:       number;
  selectedIndex:   number | null;   // null = no respondida
  isCorrect:       boolean | null;  // null = no respondida
  correctIndex:    number | null;   // null = no revelada (solo admin/review)
  explanation:     string | null;   // null = no revelada (solo admin/review)
}

export interface AiStartResponseDto {
  tried:          AiTriedDto;
  firstQuestion:  AiQuestionDto;
  totalGenerated: number;
}

export interface AiAnswerResultDto {
  isCorrect:       boolean;
  selectedIndex:   number;
  correctIndex:    number;
  explanation:     string;
  correctAnswers:  number;
  totalAnswered:   number;
  totalQuestions:  number;
  finished:        boolean;
  finalScore:      number | null;
  earnedPoints?:   number;
  maxPoints?:      number;
  nextDifficulty?: number;
}

export interface AiHintDto {
  hint:      string;
  hintLevel: number;
}

export interface AiStatusDto {
  enabled:   boolean;
  provider:  string;
  model:     string;
  reachable: boolean;
  message:   string;
}