// HydraHunt Frontend Types - Updated for Versioning and Normalization
// These types mirror the normalized PostgreSQL schema for seamless data flow.

export interface Experience {
  id: string;
  company: string;
  /** Primary field name matching the DB schema. */
  title: string;
  /** Legacy alias for `title` — kept for backwards compatibility with older components. */
  role?: string;
  location?: string | null;
  startDate: string;
  endDate: string;
  description: string;
  order: number;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field?: string | null;
  startDate?: string | null;
  endDate: string;
  gpa?: string | null;
  order: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number; // 1-5
  order: number;
}

export enum SubscriptionTier {
  SCOUT = 'SCOUT',
  HUNTER = 'HUNTER',
  HYDRA = 'HYDRA',
}

export enum TemplateId {
  CLASSIC = 'classic',
  MODERN = 'modern',
  CREATIVE = 'creative',
  EXECUTIVE = 'executive',
  TECHNICAL = 'technical',
  CYBER = 'cyber',
  MINIMAL = 'minimal',
  BOLD = 'bold',
  TERMINAL = 'terminal',
  BRUTALIST = 'brutalist',
  NEON = 'neon',
  QUANTUM = 'quantum',
  GRID = 'grid',
  SWISS = 'swiss',
}

export interface Template {
  id: TemplateId;
  name: string;
  description: string;
  colors: string[];
}

export interface ResumeVersion {
  id: string;
  resumeId: string;
  versionNumber: number;
  /** Version label, e.g. "Optimized for Google". Optional in DB (String?). */
  title?: string | null;
  isCurrent: boolean;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website?: string | null;
  summary: string;
  templateId: string;
  lethalityScore: number;
  atsScore?: number | null;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  createdAt: string;
  updatedAt: string;
}

export interface Resume {
  id: string;
  userId: string;
  title: string;
  folderId?: string | null;
  folderName?: string;
  currentVersionId?: string;
  versionCount?: number;
  currentVersion?: ResumeVersion | null;
  versions?: ResumeVersion[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
  subscriptionTier: SubscriptionTier;
}

export interface JobStrike {
  id: string;
  userId: string;
  resumeId?: string;
  jobTitle: string;
  company: string;
  location: string;
  jobUrl?: string;
  description?: string;
  status: 'PENDING' | 'CONFIRMED' | 'TERMINATED' | 'INTERVIEWING' | 'OFFER';
  matchScore?: number;
  appliedAt: string;
  notes?: string;
}

export interface JobTarget {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  jobUrl: string;
  source?: string;
  matchScore?: number;
  missingSkills?: string[];
  status: 'NEW' | 'APPLIED' | 'SKIPPED';
  isArchived: boolean;
}

export interface AnalysisReport {
  score: number;
  critique: string;
  improvements: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface GeneralAnalysis {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface ATSAnalysis {
  score: number;
  passAts: boolean;
  keywords: { found: string[]; missing: string[] };
  issues: string[];
  suggestions: string[];
}

export interface TransitionAnalysis {
  feasibility: number; // 0-100
  gaps: string[];
  strengths: string[];
  roadmap: string[];
  courses: string[];
}

export interface JobListing {
  title: string;
  company: string;
  location: string;
  salary?: string;
  url: string;
  matchScore: number;
}

// UI State Types
export type View =
  | 'landing'
  | 'dashboard'
  | 'editor'
  | 'templates'
  | 'pricing'
  | 'login'
  | 'converter';

export type EditorTab = 'personal' | 'experience' | 'education' | 'skills' | 'intel';

export type AiStep =
  | 'input'
  | 'analyzing'
  | 'report'
  | 'fixing'
  | 'fix_success'
  | 'suggesting_roles'
  | 'roles_result'
  | 'transition_input'
  | 'transition_analyzing'
  | 'transition_report'
  | 'job_hunt_input'
  | 'job_hunt_scanning'
  | 'job_hunt_results'
  | 'chat'
  | 'input_job_fit'
  | 'initial_scan'
  | 'initial_results'
  | 'ats_scanning'
  | 'ats_results';

/** ResumeData is an alias for Resume — used in hooks and components. */
export type ResumeData = Resume;
