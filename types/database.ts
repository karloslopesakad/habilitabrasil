// ===========================================
// FastCNH - Types do Banco de Dados
// ===========================================

// Enums
export type StepType = 'link' | 'theoretical_class' | 'simulation' | 'practical';
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';
export type PackageStatus = 'active' | 'expired' | 'cancelled';
export type VehicleType = 'manual' | 'automatic';
export type ClassStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';
export type UserRole = 'user' | 'admin' | 'instructor';
export type QuestionCategory = 'legislacao' | 'direcao_defensiva' | 'primeiros_socorros' | 'meio_ambiente' | 'mecanica';
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

// ===========================================
// Entidades Principais
// ===========================================

export interface State {
  id: string;
  name: string;
  abbreviation: string;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  name: string | null;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  state_id: string | null;
  created_at: string;
  updated_at: string;
  // Relacionamento
  state?: State;
}

export interface Package {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string | null;
  features: string[];
  practical_hours: number;
  theoretical_classes_included: number;
  simulations_included: number;
  has_whatsapp_support: boolean;
  has_instructor_support: boolean;
  is_highlighted: boolean;
  highlight_label: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Step {
  id: string;
  type: StepType;
  title: string;
  subtitle: string | null;
  description: string | null;
  instructions: string | null;
  external_link: string | null;
  whatsapp_message: string | null;
  icon: string | null;
  display_order: number;
  is_active: boolean;
  requires_payment: boolean;
  min_package_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Instructor {
  id: string;
  user_id: string | null;
  name: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  specialization: string | null;
  vehicle_types: VehicleType[];
  bio: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TheoreticalClass {
  id: string;
  step_id: string | null;
  instructor_id: string | null;
  title: string;
  description: string | null;
  scheduled_at: string;
  duration_minutes: number;
  meeting_link: string | null;
  max_participants: number;
  is_recorded: boolean;
  recording_url: string | null;
  is_active: boolean;
  created_at: string;
  // Relacionamentos
  instructor?: Instructor;
  step?: Step;
  registrations_count?: number;
}

export interface PracticalClass {
  id: string;
  step_id: string | null;
  instructor_id: string | null;
  user_id: string;
  scheduled_at: string;
  duration_minutes: number;
  vehicle_type: VehicleType;
  location: string | null;
  status: ClassStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Relacionamentos
  instructor?: Instructor;
  step?: Step;
  user?: Profile;
}

export interface UserPackage {
  id: string;
  user_id: string;
  package_id: string;
  status: PackageStatus;
  practical_hours_used: number;
  theoretical_classes_used: number;
  simulations_used: number;
  purchased_at: string;
  expires_at: string | null;
  payment_id: string | null;
  created_at: string;
  // Relacionamento
  package?: Package;
}

export interface UserProgress {
  id: string;
  user_id: string;
  step_id: string;
  status: ProgressStatus;
  started_at: string | null;
  completed_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Relacionamento
  step?: Step;
}

export interface SimulationQuestion {
  id: string;
  question: string;
  options: string[]; // [A, B, C, D]
  correct_answer: 'A' | 'B' | 'C' | 'D';
  category: QuestionCategory;
  explanation: string | null;
  difficulty: QuestionDifficulty;
  created_at: string;
}

export interface SimulationAttempt {
  id: string;
  user_id: string;
  step_id: string;
  score: number; // 0-30
  percentage: number; // 0-100
  passed: boolean;
  time_spent_seconds: number;
  answers: Record<string, string>; // { question_id: answer }
  question_ids: string[];
  started_at: string;
  completed_at: string | null;
  created_at: string;
  // Relacionamentos
  step?: Step;
  questions?: SimulationQuestion[];
}

export interface ClassRegistration {
  id: string;
  user_id: string;
  theoretical_class_id: string;
  registered_at: string;
  attended: boolean;
  feedback: string | null;
  rating: number | null;
  // Relacionamento
  theoretical_class?: TheoreticalClass;
}

export interface Setting {
  id: string;
  key: string;
  value: Record<string, any>;
  description: string | null;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  package_id: string;
  stripe_payment_intent_id: string | null;
  stripe_checkout_session_id: string | null;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed' | 'refunded';
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  // Relacionamentos
  user?: Profile;
  package?: Package;
}

// ===========================================
// Types para Formulários
// ===========================================

export interface PackageFormData {
  name: string;
  slug: string;
  price: number;
  description: string;
  features: string[];
  practical_hours: number;
  theoretical_classes_included: number;
  simulations_included: number;
  has_whatsapp_support: boolean;
  has_instructor_support: boolean;
  is_highlighted: boolean;
  highlight_label: string;
  display_order: number;
  is_active: boolean;
}

export interface StepFormData {
  type: StepType;
  title: string;
  subtitle: string;
  description: string;
  instructions: string;
  external_link: string;
  whatsapp_message: string;
  icon: string;
  display_order: number;
  is_active: boolean;
  requires_payment: boolean;
  min_package_id: string | null;
}

export interface TheoreticalClassFormData {
  step_id: string | null;
  instructor_id: string | null;
  title: string;
  description: string;
  scheduled_at: string;
  duration_minutes: number;
  meeting_link: string;
  max_participants: number;
  is_recorded: boolean;
  recording_url: string;
  is_active: boolean;
}

export interface PracticalClassFormData {
  step_id: string | null;
  instructor_id: string | null;
  user_id: string;
  scheduled_at: string;
  duration_minutes: number;
  vehicle_type: VehicleType;
  location: string;
  status: ClassStatus;
  notes: string;
}

export interface InstructorFormData {
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  specialization: string;
  vehicle_types: VehicleType[];
  bio: string;
  avatar_url: string;
  is_active: boolean;
}

// ===========================================
// Types para Contexto de Usuário
// ===========================================

export interface UserContext {
  user: {
    id: string;
    email: string;
  } | null;
  profile: Profile | null;
  userPackage: UserPackage | null;
  isLoading: boolean;
  isPaying: boolean;
  hasWhatsappSupport: boolean;
  hasInstructorSupport: boolean;
  practicalHoursRemaining: number;
  theoreticalClassesRemaining: number;
  simulationsRemaining: number;
}

// ===========================================
// Types para API Responses
// ===========================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ===========================================
// WhatsApp Settings
// ===========================================

export interface WhatsAppSettings {
  number: string;
  default_message: string;
}

export interface SiteSettings {
  name: string;
  tagline: string;
  support_email: string;
}

