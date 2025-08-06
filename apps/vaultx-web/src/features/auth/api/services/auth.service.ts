import type {
  LoginApiRequest,
  LoginApiResponse,
  RegisterApiRequest,
  RefreshTokenApiRequest,
  RefreshTokenApiResponse,
  ResetPasswordApiRequest,
  ResetPasswordApiResponse,
  ChangePasswordApiRequest,
  ChangePasswordApiResponse,
  UserApiModel,
  SessionApiModel,
  ValidationApiResponse,
} from '../models/auth.model';

import type { ApiResponse } from '@vaultx/shared';

import {
  mockUsers,
  mockTokens,
  mockAdminTokens,
  mockSessions,
  mockCredentials,
  mockApiDelays,
  mockErrorMessages,
  mockSuccessMessages,
} from '../mockData/auth.mockData';

// Utility function to simulate API delay
const simulateDelay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Utility function to generate mock token
const generateMockToken = (userId: string, role: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: userId,
      role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    })
  );
  return `${header}.${payload}.mock-signature-${Date.now()}`;
};

// Authentication Service Class
export class AuthService {
  /**
   * Login user with email and password
   */
  static async login(
    credentials: LoginApiRequest
  ): Promise<ApiResponse<LoginApiResponse>> {
    await simulateDelay(mockApiDelays.login);

    try {
      // Validate credentials
      const user = mockUsers.find(u => u.email === credentials.email);

      if (!user) {
        return {
          success: false,
          error: mockErrorMessages.userNotFound,
          statusCode: 404,
        };
      }

      // Check password (mock validation)
      const isValidPassword =
        (credentials.email === mockCredentials.validUser.email &&
          credentials.password === mockCredentials.validUser.password) ||
        (credentials.email === mockCredentials.validAdmin.email &&
          credentials.password === mockCredentials.validAdmin.password);

      if (!isValidPassword) {
        return {
          success: false,
          error: mockErrorMessages.invalidCredentials,
          statusCode: 401,
        };
      }

      // Check if email is verified
      if (!user.emailVerified) {
        return {
          success: false,
          error: mockErrorMessages.emailNotVerified,
          statusCode: 403,
        };
      }

      // Generate tokens
      const tokens = user.role === 'admin' ? mockAdminTokens : mockTokens;
      const updatedTokens = {
        ...tokens,
        accessToken: generateMockToken(user.id, user.role),
      };

      // Update last login
      const updatedUser = {
        ...user,
        lastLoginAt: new Date().toISOString(),
      };

      return {
        success: true,
        data: {
          user: updatedUser,
          tokens: updatedTokens,
          expiresIn: 3600,
          sessionId: `session_${Date.now()}`,
        },
        message: mockSuccessMessages.loginSuccess,
        statusCode: 200,
      };
    } catch (error) {
      return {
        success: false,
        error: mockErrorMessages.serverError,
        statusCode: 500,
      };
    }
  }

  /**
   * Register new user
   */
  static async register(
    userData: RegisterApiRequest
  ): Promise<ValidationApiResponse> {
    await simulateDelay(mockApiDelays.register);

    try {
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === userData.email);
      if (existingUser) {
        return {
          success: false,
          error: mockErrorMessages.emailAlreadyExists,
          statusCode: 409,
        };
      }

      // Validate password match
      if (userData.password !== userData.confirmPassword) {
        return {
          success: false,
          error: 'Passwords do not match',
          statusCode: 400,
          validationErrors: [
            {
              field: 'confirmPassword',
              message: 'Passwords do not match',
              code: 'PASSWORD_MISMATCH',
            },
          ],
        };
      }

      // Create new user
      const newUser: UserApiModel = {
        id: `user_${Date.now()}`,
        email: userData.email,
        name: userData.name,
        role: 'user',
        emailVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        preferences: {
          theme: 'system',
          language: 'en',
          timezone: 'UTC',
          notifications: {
            email: true,
            push: false,
            security: true,
          },
          twoFactorEnabled: false,
        },
      };

      // Generate tokens
      const tokens = {
        ...mockTokens,
        accessToken: generateMockToken(newUser.id, newUser.role),
      };

      return {
        success: true,
        data: {
          user: newUser,
          tokens,
          message: mockSuccessMessages.registerSuccess,
        },
        message: mockSuccessMessages.registerSuccess,
        statusCode: 201,
      };
    } catch (error) {
      return {
        success: false,
        error: mockErrorMessages.serverError,
        statusCode: 500,
      };
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<ApiResponse> {
    await simulateDelay(mockApiDelays.logout);

    try {
      return {
        success: true,
        message: mockSuccessMessages.logoutSuccess,
        statusCode: 200,
      };
    } catch (error) {
      return {
        success: false,
        error: mockErrorMessages.serverError,
        statusCode: 500,
      };
    }
  }

  /**
   * Refresh authentication token
   */
  static async refreshToken(
    request: RefreshTokenApiRequest
  ): Promise<ApiResponse<RefreshTokenApiResponse>> {
    await simulateDelay(mockApiDelays.refreshToken);

    try {
      // Validate refresh token (mock validation)
      if (!request.refreshToken || request.refreshToken.length < 10) {
        return {
          success: false,
          error: mockErrorMessages.invalidToken,
          statusCode: 401,
        };
      }

      // Generate new tokens
      const newTokens = {
        ...mockTokens,
        accessToken: generateMockToken('user_1', 'user'),
        refreshToken: `rt_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 11)}`,
      };

      return {
        success: true,
        data: {
          tokens: newTokens,
          expiresIn: 3600,
        },
        statusCode: 200,
      };
    } catch (error) {
      return {
        success: false,
        error: mockErrorMessages.serverError,
        statusCode: 500,
      };
    }
  }

  /**
   * Get current authenticated user
   */
  static async getCurrentUser(): Promise<ApiResponse<UserApiModel>> {
    await simulateDelay(mockApiDelays.getCurrentUser);

    try {
      // Return first user as current user (mock)
      const currentUser = mockUsers[0];

      return {
        success: true,
        data: currentUser,
        statusCode: 200,
      };
    } catch (error) {
      return {
        success: false,
        error: mockErrorMessages.serverError,
        statusCode: 500,
      };
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(
    request: ResetPasswordApiRequest
  ): Promise<ApiResponse<ResetPasswordApiResponse>> {
    await simulateDelay(mockApiDelays.resetPassword);

    try {
      // Check if user exists
      const user = mockUsers.find(u => u.email === request.email);
      if (!user) {
        return {
          success: false,
          error: mockErrorMessages.userNotFound,
          statusCode: 404,
        };
      }

      return {
        success: true,
        data: {
          message: mockSuccessMessages.passwordResetSent,
          resetToken: `reset_${Date.now()}_${Math.random()
            .toString(36)
            .substring(2, 11)}`,
        },
        message: mockSuccessMessages.passwordResetSent,
        statusCode: 200,
      };
    } catch (error) {
      return {
        success: false,
        error: mockErrorMessages.serverError,
        statusCode: 500,
      };
    }
  }

  /**
   * Change password
   */
  static async changePassword(
    request: ChangePasswordApiRequest
  ): Promise<ApiResponse<ChangePasswordApiResponse>> {
    await simulateDelay(mockApiDelays.changePassword);

    try {
      // Validate current password (mock validation)
      if (request.currentPassword !== 'password123') {
        return {
          success: false,
          error: 'Current password is incorrect',
          statusCode: 400,
        };
      }

      // Validate new password match
      if (request.newPassword !== request.confirmPassword) {
        return {
          success: false,
          error: 'New passwords do not match',
          statusCode: 400,
        };
      }

      return {
        success: true,
        data: {
          message: mockSuccessMessages.passwordChanged,
          requiresReauth: false,
        },
        message: mockSuccessMessages.passwordChanged,
        statusCode: 200,
      };
    } catch (error) {
      return {
        success: false,
        error: mockErrorMessages.serverError,
        statusCode: 500,
      };
    }
  }

  /**
   * Get user sessions
   */
  static async getUserSessions(): Promise<ApiResponse<SessionApiModel[]>> {
    await simulateDelay(500);

    try {
      return {
        success: true,
        data: mockSessions,
        statusCode: 200,
      };
    } catch (error) {
      return {
        success: false,
        error: mockErrorMessages.serverError,
        statusCode: 500,
      };
    }
  }

  /**
   * Revoke session
   */
  static async revokeSession(sessionId: string): Promise<ApiResponse> {
    await simulateDelay(300);

    try {
      const session = mockSessions.find(s => s.id === sessionId);
      if (!session) {
        return {
          success: false,
          error: 'Session not found',
          statusCode: 404,
        };
      }

      return {
        success: true,
        message: 'Session revoked successfully',
        statusCode: 200,
      };
    } catch (error) {
      return {
        success: false,
        error: mockErrorMessages.serverError,
        statusCode: 500,
      };
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    updates: Partial<UserApiModel>
  ): Promise<ApiResponse<UserApiModel>> {
    await simulateDelay(mockApiDelays.updateProfile);

    try {
      const currentUser = mockUsers[0];
      const updatedUser = {
        ...currentUser,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      return {
        success: true,
        data: updatedUser,
        message: mockSuccessMessages.profileUpdated,
        statusCode: 200,
      };
    } catch (error) {
      return {
        success: false,
        error: mockErrorMessages.serverError,
        statusCode: 500,
      };
    }
  }

  /**
   * Verify email
   */
  static async verifyEmail(token: string): Promise<ApiResponse> {
    await simulateDelay(800);

    try {
      if (!token || token.length < 10) {
        return {
          success: false,
          error: mockErrorMessages.invalidToken,
          statusCode: 400,
        };
      }

      return {
        success: true,
        message: mockSuccessMessages.emailVerified,
        statusCode: 200,
      };
    } catch (error) {
      return {
        success: false,
        error: mockErrorMessages.serverError,
        statusCode: 500,
      };
    }
  }
}

// Export individual service functions for convenience
export const authService = {
  login: AuthService.login,
  register: AuthService.register,
  logout: AuthService.logout,
  refreshToken: AuthService.refreshToken,
  getCurrentUser: AuthService.getCurrentUser,
  resetPassword: AuthService.resetPassword,
  changePassword: AuthService.changePassword,
  getUserSessions: AuthService.getUserSessions,
  revokeSession: AuthService.revokeSession,
  updateProfile: AuthService.updateProfile,
  verifyEmail: AuthService.verifyEmail,
};

// Export default
export default AuthService;
