/**
 * @file: auth.controller.spec.ts
 * @version: 0.0.0
 * @author: Raul Daramus
 * @date: 2025
 * Copyright (C) 2025 VaultX by Raul Daramus
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/
 * or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
 *
 * You are free to:
 *   - Share — copy and redistribute the material in any medium or format
 *   - Adapt — remix, transform, and build upon the material
 *
 * Under the following terms:
 *   - Attribution — You must give appropriate credit, provide a link to the license,
 *     and indicate if changes were made.
 *   - NonCommercial — You may not use the material for commercial purposes.
 *   - ShareAlike — If you remix, transform, or build upon the material, you must
 *     distribute your contributions under the same license as the original.
 */

import type { OAuthProvider } from '@vaultx/shared';
import type { Request } from 'express';

import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { AuthService } from '../services/auth.service';

import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
    getProfile: jest.fn(),
    updateProfile: jest.fn(),
    changePassword: jest.fn(),
    requestPasswordReset: jest.fn(),
    confirmPasswordReset: jest.fn(),
    listSessions: jest.fn(),
    revokeSession: jest.fn(),
    verifyEmail: jest.fn(),
    resendVerification: jest.fn(),
    initiateOAuth: jest.fn(),
    handleOAuthCallback: jest.fn(),
  } as jest.Mocked<AuthService>;

  const mockRequest = {
    ip: '127.0.0.1',
    headers: {
      'user-agent': 'test-agent',
    },
    connection: {
      remoteAddress: '127.0.0.1',
    },
  } as unknown as Request;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Create controller instance with mocked service
    authService = mockAuthService;
    controller = new AuthController(authService);
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'Test123!@#',
        displayName: 'Test User',
      };

      const mockResult = {
        user: {
          id: '1',
          email: registerDto.email,
          displayName: registerDto.displayName,
        },
        requiresVerification: true,
      };

      mockAuthService.register.mockResolvedValue(mockResult);

      const result = await controller.register(registerDto, mockRequest);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResult);
      expect(result.message).toBe('User registered successfully');
      expect(mockAuthService.register).toHaveBeenCalledWith(
        registerDto,
        expect.objectContaining({
          ipAddress: expect.any(String),
          userAgent: 'test-agent',
        })
      );
    });
  });

  describe('POST /auth/login', () => {
    it('should login a user and return tokens', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'Test123!@#',
        rememberMe: false,
      };

      const mockResult = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: { id: '1', email: loginDto.email },
      };

      mockAuthService.login.mockResolvedValue(mockResult);

      const result = await controller.login(loginDto, mockRequest);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResult);
      expect(result.message).toBe('Login successful');
      expect(mockAuthService.login).toHaveBeenCalledWith(
        loginDto,
        expect.objectContaining({
          ipAddress: expect.any(String),
          userAgent: 'test-agent',
          rememberMe: false,
        }),
        undefined
      );
    });

    it('should handle remember me option', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'Test123!@#',
        rememberMe: true,
      };

      mockAuthService.login.mockResolvedValue({});

      await controller.login(loginDto, mockRequest);

      expect(mockAuthService.login).toHaveBeenCalledWith(
        loginDto,
        expect.objectContaining({
          rememberMe: true,
        }),
        undefined
      );
    });
  });

  describe('POST /auth/refresh', () => {
    it('should refresh access token', async () => {
      const refreshDto = {
        refreshToken: 'mock-refresh-token',
      };

      const mockResult = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      mockAuthService.refresh.mockResolvedValue(mockResult);

      const result = await controller.refresh(refreshDto, mockRequest);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResult);
      expect(result.message).toBe('Token rotated');
      expect(mockAuthService.refresh).toHaveBeenCalledWith(
        refreshDto,
        'mock-refresh-token',
        expect.objectContaining({
          ipAddress: expect.any(String),
          userAgent: 'test-agent',
        })
      );
    });

    it('should handle refresh token from header', async () => {
      const refreshDto = new RefreshTokenDto();
      const requestWithHeader = {
        ...mockRequest,
        headers: {
          ...mockRequest.headers,
          'x-refresh-token': 'header-refresh-token',
        },
      } as unknown as Request;

      mockAuthService.refresh.mockResolvedValue({});

      await controller.refresh(refreshDto, requestWithHeader);

      expect(mockAuthService.refresh).toHaveBeenCalledWith(
        refreshDto,
        'header-refresh-token',
        expect.any(Object)
      );
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout a user', async () => {
      const mockUser = {
        sub: 'user-id',
        sessionId: 'session-id',
        type: 'access' as const,
      };

      mockAuthService.logout.mockResolvedValue(undefined);

      const result = await controller.logout(mockUser);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ message: 'Logged out successfully' });
      expect(mockAuthService.logout).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('GET /auth/me', () => {
    it('should return user profile', async () => {
      const mockUser = {
        sub: 'user-id',
        sessionId: 'session-id',
        type: 'access' as const,
      };

      const mockProfile = {
        id: 'user-id',
        email: 'test@example.com',
        displayName: 'Test User',
      };

      mockAuthService.getProfile.mockResolvedValue(mockProfile);

      const result = await controller.me(mockUser);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ user: mockProfile });
      expect(mockAuthService.getProfile).toHaveBeenCalledWith('user-id');
    });
  });

  describe('PATCH /auth/profile', () => {
    it('should update user profile', async () => {
      const mockUser = {
        sub: 'user-id',
        sessionId: 'session-id',
        type: 'access' as const,
      };

      const updateDto = {
        displayName: 'Updated Name',
      };

      const mockUpdatedProfile = {
        id: 'user-id',
        email: 'test@example.com',
        displayName: 'Updated Name',
      };

      mockAuthService.updateProfile.mockResolvedValue(mockUpdatedProfile);

      const result = await controller.updateProfile(updateDto, mockUser);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ user: mockUpdatedProfile });
      expect(result.message).toBe('Profile updated');
      expect(mockAuthService.updateProfile).toHaveBeenCalledWith(
        'user-id',
        updateDto
      );
    });
  });

  describe('POST /auth/change-password', () => {
    it('should change user password', async () => {
      const mockUser = {
        sub: 'user-id',
        sessionId: 'session-id',
        type: 'access' as const,
      };

      const changePasswordDto = {
        currentPassword: 'OldPass123!',
        newPassword: 'NewPass123!',
      };

      const mockResult = {
        message: 'Password changed successfully',
      };

      mockAuthService.changePassword.mockResolvedValue(mockResult);

      const result = await controller.changePassword(
        changePasswordDto,
        mockUser
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResult);
      expect(mockAuthService.changePassword).toHaveBeenCalledWith(
        'user-id',
        changePasswordDto
      );
    });
  });

  describe('POST /auth/reset-password/request', () => {
    it('should request password reset', async () => {
      const requestDto = {
        email: 'test@example.com',
      };

      const mockResult = {
        message: 'If the email exists, a reset link has been sent',
      };

      mockAuthService.requestPasswordReset.mockResolvedValue(mockResult);

      const result = await controller.requestPasswordReset(requestDto);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResult);
      expect(mockAuthService.requestPasswordReset).toHaveBeenCalledWith(
        requestDto
      );
    });
  });

  describe('POST /auth/reset-password/confirm', () => {
    it('should confirm password reset', async () => {
      const confirmDto = {
        token: 'reset-token',
        newPassword: 'NewPass123!',
      };

      const mockResult = {
        message: 'Password reset successfully',
      };

      mockAuthService.confirmPasswordReset.mockResolvedValue(mockResult);

      const result = await controller.confirmPasswordReset(confirmDto);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResult);
      expect(mockAuthService.confirmPasswordReset).toHaveBeenCalledWith(
        confirmDto
      );
    });
  });

  describe('GET /auth/sessions', () => {
    it('should list user sessions', async () => {
      const mockUser = {
        sub: 'user-id',
        sessionId: 'current-session-id',
        type: 'access' as const,
      };

      const mockSessions = [
        {
          id: 'session-1',
          deviceInfo: 'Chrome on Windows',
          ipAddress: '127.0.0.1',
          isCurrentSession: true,
        },
        {
          id: 'session-2',
          deviceInfo: 'Safari on Mac',
          ipAddress: '192.168.1.1',
          isCurrentSession: false,
        },
      ];

      mockAuthService.listSessions.mockResolvedValue(mockSessions);

      const result = await controller.listSessions(mockUser);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ sessions: mockSessions });
      expect(mockAuthService.listSessions).toHaveBeenCalledWith(
        'user-id',
        'current-session-id'
      );
    });
  });

  describe('DELETE /auth/sessions/:sessionId', () => {
    it('should revoke a session', async () => {
      const mockUser = {
        sub: 'user-id',
        sessionId: 'current-session-id',
        type: 'access' as const,
      };

      const sessionIdToRevoke = 'session-to-revoke';

      const mockResult = {
        message: 'Session revoked successfully',
      };

      mockAuthService.revokeSession.mockResolvedValue(mockResult);

      const result = await controller.revokeSession(
        sessionIdToRevoke,
        mockUser
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResult);
      expect(mockAuthService.revokeSession).toHaveBeenCalledWith(
        'user-id',
        sessionIdToRevoke
      );
    });
  });

  describe('POST /auth/verify-email', () => {
    it('should verify email', async () => {
      const verifyDto = {
        token: 'verification-token',
      };

      const mockResult = {
        message: 'Email verified successfully',
      };

      mockAuthService.verifyEmail.mockResolvedValue(mockResult);

      const result = await controller.verifyEmail(verifyDto);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResult);
      expect(mockAuthService.verifyEmail).toHaveBeenCalledWith(verifyDto);
    });
  });

  describe('POST /auth/verify-email/resend', () => {
    it('should resend verification email', async () => {
      const resendDto = {
        email: 'test@example.com',
      };

      const mockResult = {
        message: 'Verification email sent',
      };

      mockAuthService.resendVerification.mockResolvedValue(mockResult);

      const result = await controller.resendVerification(resendDto);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResult);
      expect(mockAuthService.resendVerification).toHaveBeenCalledWith(
        resendDto
      );
    });
  });

  describe('GET /auth/oauth/:provider/authorize', () => {
    it('should initiate OAuth flow', async () => {
      const provider: OAuthProvider = 'google';
      const redirectUri = 'http://localhost:3000/callback';

      const mockResult = {
        authorizationUrl: 'https://oauth.provider.com/authorize',
        state: 'random-state',
      };

      mockAuthService.initiateOAuth.mockResolvedValue(mockResult);

      const result = await controller.initiateOAuth(provider, redirectUri);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResult);
      expect(mockAuthService.initiateOAuth).toHaveBeenCalledWith(
        provider,
        redirectUri
      );
    });

    it('should handle OAuth without redirect URI', async () => {
      const provider: OAuthProvider = 'github';

      mockAuthService.initiateOAuth.mockResolvedValue({});

      await controller.initiateOAuth(provider);

      expect(mockAuthService.initiateOAuth).toHaveBeenCalledWith(
        provider,
        undefined
      );
    });
  });

  describe('GET /auth/oauth/:provider/callback', () => {
    it('should handle OAuth callback', async () => {
      const provider: OAuthProvider = 'google';
      const code = 'auth-code';
      const state = 'random-state';

      const mockResult = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: { id: '1', email: 'oauth@example.com' },
      };

      mockAuthService.handleOAuthCallback.mockResolvedValue(mockResult);

      const result = await controller.handleOAuthCallback(
        provider,
        code,
        state
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResult);
      expect(mockAuthService.handleOAuthCallback).toHaveBeenCalledWith(
        provider,
        code,
        state
      );
    });

    it('should throw error when code is missing', async () => {
      const provider: OAuthProvider = 'google';
      const state = 'random-state';

      await expect(
        controller.handleOAuthCallback(provider, '', state)
      ).rejects.toThrow('Invalid OAuth callback parameters');
    });

    it('should throw error when state is missing', async () => {
      const provider: OAuthProvider = 'google';
      const code = 'auth-code';

      await expect(
        controller.handleOAuthCallback(provider, code, '')
      ).rejects.toThrow('Invalid OAuth callback parameters');
    });
  });
});
