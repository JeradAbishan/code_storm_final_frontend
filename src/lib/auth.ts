/**
 * Authentication API Service
 * API calls for user authentication and management
 */

import { 
  User, 
  AuthResponse, 
  RegisterRequest, 
  LoginRequest, 
  GoogleOAuthCompleteRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UserProfileUpdateRequest,
  UserSession,
  ApiResponse
} from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
const API_V1_STR = '/api/v1';

class AuthApiError extends Error {
  constructor(public statusCode: number, message: string, public errorCode?: string) {
    super(message);
    this.name = 'AuthApiError';
  }
}

class AuthService {
  private baseUrl = `${API_BASE_URL}${API_V1_STR}/auth`;

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      credentials: 'include', // Important for cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new AuthApiError(
          response.status,
          errorData.detail || 'An error occurred',
          errorData.error_code
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof AuthApiError) {
        throw error;
      }
      throw new AuthApiError(500, 'Network error');
    }
  }

  // Authentication methods
  async register(data: RegisterRequest): Promise<User> {
    return this.request<User>('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/logout', {
      method: 'POST',
    });
  }

  async logoutAll(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/logout-all', {
      method: 'POST',
    });
  }

  async refreshToken(): Promise<AuthResponse> {
    return this.request<AuthResponse>('/refresh', {
      method: 'POST',
    });
  }

  // Google OAuth methods
  async getGoogleAuthUrl(state?: string): Promise<{ auth_url: string }> {
    const params = new URLSearchParams();
    if (state) params.append('state', state);
    
    return this.request<{ auth_url: string }>(`/google/authorize?${params.toString()}`);
  }

  async completeGoogleAuth(data: GoogleOAuthCompleteRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/google/complete', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Email verification methods
  async verifyEmail(token: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async resendVerification(email: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Password management methods
  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    return this.request<{ message: string }>('/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    return this.request<{ message: string }>('/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    return this.request<{ message: string }>('/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // User profile methods
  async getCurrentUser(): Promise<User> {
    return this.request<User>('/me');
  }

  async updateProfile(data: UserProfileUpdateRequest): Promise<User> {
    return this.request<User>('/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Session management methods
  async getUserSessions(): Promise<{ sessions: UserSession[]; current_session_id: string }> {
    return this.request<{ sessions: UserSession[]; current_session_id: string }>('/sessions');
  }

  async revokeSession(sessionId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  }
}

export const authService = new AuthService();
export { AuthApiError };
