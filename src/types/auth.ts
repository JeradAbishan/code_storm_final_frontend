/**
 * Authentication Types
 * TypeScript types for authentication and user management
 */

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  profile_picture_url?: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending_email_verification';
  is_email_verified: boolean;
  auth_provider: 'email' | 'google';
  theme_preference: 'light' | 'dark' | 'system';
  timezone: string;
  language: string;
  created_at: string;
  last_login_at?: string;
  login_count: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface UserSession {
  id: string;
  device_info?: string;
  user_agent?: string;
  ip_address?: string;
  location?: string;
  is_active: boolean;
  created_at: string;
  last_used_at: string;
  expires_at: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface GoogleOAuthCompleteRequest {
  google_token: string;
  date_of_birth: string;
  first_name?: string;
  last_name?: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface UserProfileUpdateRequest {
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  timezone?: string;
  language?: string;
  theme_preference?: 'light' | 'dark' | 'system';
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  detail: string;
  error_code?: string;
  success: boolean;
}

// Authentication Context Types
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  updateProfile: (data: UserProfileUpdateRequest) => Promise<void>;
  refreshToken: () => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
}

// Form validation types
export interface ValidationErrors {
  [key: string]: string[];
}

export interface FormState {
  isSubmitting: boolean;
  errors: ValidationErrors;
  message?: string;
}

// Theme types
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  resolvedTheme: 'light' | 'dark';
}
