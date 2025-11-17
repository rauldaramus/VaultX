/**
 * @file: auth.service.ts
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

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { OAuthProvider } from '@vaultx/shared';
import { Types } from 'mongoose';

import type { AppConfig } from '../config';
import { AuthTokenRepository } from '../infrastructure/database/repositories/auth-token.repository';
import { OAuthAccountRepository } from '../infrastructure/database/repositories/oauth-account.repository';
import { SessionRepository } from '../infrastructure/database/repositories/session.repository';
import { UserRepository } from '../infrastructure/database/repositories/user.repository';
import {
  Session,
  SessionDeviceInfo,
  SessionDocument,
} from '../schemas/session.schema';
import type { UserDocument } from '../schemas/user.schema';

import { ChangePasswordDto } from './dto/change-password.dto';
import { ConfirmResetPasswordDto } from './dto/confirm-reset-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { PasswordService } from './password.service';
import { AccessTokenPayload, TokenService } from './token.service';

export interface AuthRequestContext {
  ipAddress: string;
  userAgent: string;
  rememberMe?: boolean;
}

interface TokenPairResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  scope: string[];
}

interface LoginResult {
  user: ReturnType<AuthService['mapUser']>;
  tokens: TokenPairResponse;
  expiresIn: number;
  sessionId: string;
}

@Injectable()
export class AuthService {
  private readonly defaultScopes = ['vaultx.read', 'vaultx.write'];

  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly authTokenRepository: AuthTokenRepository,
    private readonly oauthAccountRepository: OAuthAccountRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService<AppConfig>
  ) {}

  async register(
    dto: RegisterDto,
    context: AuthRequestContext
  ): Promise<LoginResult> {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = await this.userRepository.create({
      email: dto.email.toLowerCase(),
      name: dto.name,
      password: this.passwordService.hash(dto.password),
      status: 'active',
      role: 'user',
      emailVerified: false,
      twoFactorEnabled: false,
      preferences: undefined,
    });

    const session = await this.issueSessionTokens(user, context);
    return {
      user: this.mapUser(user),
      tokens: session.tokens,
      expiresIn: session.tokens.expiresIn,
      sessionId: session.sessionId,
    };
  }

  async login(
    dto: LoginDto,
    context: AuthRequestContext
  ): Promise<LoginResult> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!this.passwordService.verify(dto.password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== 'active') {
      throw new UnauthorizedException('Account is not active');
    }

    await this.userRepository.updateLastLogin(user.id);

    const session = await this.issueSessionTokens(user, {
      ...context,
      rememberMe: dto.rememberMe,
    });

    return {
      user: this.mapUser(user),
      tokens: session.tokens,
      expiresIn: session.tokens.expiresIn,
      sessionId: session.sessionId,
    };
  }

  async refresh(
    dto: RefreshTokenDto,
    rawToken: string | null,
    context: AuthRequestContext
  ) {
    const tokenValue = dto.refreshToken ?? rawToken;
    if (!tokenValue) {
      throw new BadRequestException('Refresh token is required');
    }

    const hashedToken = this.tokenService.hashToken(tokenValue);
    const storedToken = await this.authTokenRepository.findValidByHash(
      hashedToken
    );

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userRepository.findById(
      storedToken.user.toString()
    );
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const session = await this.sessionRepository.findById(
      storedToken.session.toString()
    );
    if (!session || !session.isActive) {
      throw new UnauthorizedException('Session is not active');
    }

    await this.authTokenRepository.revokeById(storedToken.id);

    const payload = await this.issueSessionTokens(
      user,
      {
        ...context,
        rememberMe: context.rememberMe,
      },
      session
    );

    return {
      tokens: payload.tokens,
      expiresIn: payload.tokens.expiresIn,
    };
  }

  async logout(user: AccessTokenPayload): Promise<void> {
    await this.sessionRepository.deactivate(user.sessionId);
    await this.authTokenRepository.revokeBySession(user.sessionId);
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.mapUser(user);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatePayload: Partial<UserDocument> = {};
    if (dto.name) {
      updatePayload.name = dto.name;
    }
    if (dto.avatar) {
      updatePayload.avatar = dto.avatar;
    }

    if (dto.preferences) {
      await this.userRepository.updatePreferences(userId, {
        theme: dto.preferences.theme,
        language: dto.preferences.language,
        timezone: dto.preferences.timezone,
        notifications: dto.preferences.notifications,
        twoFactorEnabled: dto.preferences.twoFactorEnabled,
      });
    }

    const updatedUser = await this.userRepository.upsertById(
      userId,
      updatePayload
    );

    return this.mapUser(updatedUser ?? user);
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!this.passwordService.verify(dto.currentPassword, user.password)) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    await this.userRepository.updatePassword(
      userId,
      this.passwordService.hash(dto.newPassword)
    );

    await this.sessionRepository.deactivateUserSessions(userId);

    return {
      message: 'Password updated successfully',
      requiresReauth: true,
    };
  }

  async requestPasswordReset(dto: ResetPasswordRequestDto) {
    // Placeholder implementation. In a real scenario this would enqueue an email job.
    return {
      message: 'If the email exists, a reset link was sent.',
      resetToken: `reset_${Buffer.from(dto.email).toString('hex')}`,
    };
  }

  async confirmPasswordReset(dto: ConfirmResetPasswordDto) {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // For milestone 0 we simply acknowledge the request.
    return {
      message: 'Password reset confirmed. Please login with your new password.',
    };
  }

  async listSessions(userId: string, currentSessionId?: string) {
    const sessions = await this.sessionRepository.findActiveByUser(userId);
    return sessions.map(session => this.mapSession(session, currentSessionId));
  }

  async revokeSession(userId: string, sessionId: string) {
    const session = await this.sessionRepository.findActiveByIdAndUser(
      sessionId,
      userId
    );
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    await this.sessionRepository.deactivate(sessionId);
    await this.authTokenRepository.revokeBySession(sessionId);

    return { message: 'Session revoked successfully' };
  }

  async verifyEmail(_dto: VerifyEmailDto) {
    return { message: 'Email verification processed' };
  }

  async resendVerification(_dto: ResendVerificationDto) {
    return { message: 'Verification email will be sent if the account exists' };
  }

  async initiateOAuth(provider: OAuthProvider, redirectUri?: string) {
    const target = redirectUri ?? 'https://vaultx.dev/dashboard';
    return {
      redirectUrl: `https://sso.vaultx.dev/${provider}?redirect_uri=${encodeURIComponent(
        target
      )}`,
    };
  }

  async handleOAuthCallback(
    provider: OAuthProvider,
    code: string,
    state: string
  ) {
    const maybeUser = await this.userRepository.findById(state);
    if (maybeUser) {
      await this.oauthAccountRepository.linkAccount({
        user: maybeUser._id,
        provider,
        providerAccountId: code,
        scopes: [],
        profile: {},
      });
    }

    return {
      message: 'OAuth callback received',
      provider,
      linked: Boolean(maybeUser),
    };
  }

  private async issueSessionTokens(
    user: UserDocument,
    context: AuthRequestContext,
    existingSession?: SessionDocument
  ): Promise<{ sessionId: string; tokens: TokenPairResponse }> {
    const deviceInfo = this.resolveDeviceInfo(context.userAgent);
    const refreshTtl = this.resolveRefreshTtl(context.rememberMe);
    const refresh = this.tokenService.createRefreshToken(refreshTtl);

    const session =
      existingSession ??
      (await this.sessionRepository.create({
        user: user._id,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        deviceInfo,
        expiresAt: refresh.expiresAt,
        lastActiveAt: new Date(),
        isActive: true,
      } as Partial<Session>));

    await this.sessionRepository.updateById(session.id, {
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      deviceInfo,
      expiresAt: refresh.expiresAt,
      isActive: true,
      lastActiveAt: new Date(),
    });

    const accessToken = this.tokenService.createAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      sessionId: session.id,
    });

    const tokenRecord = await this.authTokenRepository.create({
      user: user._id,
      session: session._id,
      hashedToken: this.tokenService.hashToken(refresh.token),
      expiresAt: refresh.expiresAt,
      metadata: {
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
      },
    });

    await this.sessionRepository.updateById(session.id, {
      refreshTokenId: tokenRecord.id,
    });

    return {
      sessionId: session.id,
      tokens: {
        accessToken: accessToken.token,
        refreshToken: refresh.token,
        tokenType: 'Bearer',
        expiresIn: accessToken.expiresIn,
        scope: this.defaultScopes,
      },
    };
  }

  private resolveRefreshTtl(rememberMe?: boolean): number {
    const config = this.configService.get<AppConfig>('config', { infer: true });
    const baseTtl = config?.auth.refreshTokenTtl ?? 60 * 60 * 24 * 7;
    return rememberMe ? baseTtl * 2 : baseTtl;
  }

  private mapUser(user: UserDocument) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt?.toISOString() ?? new Date().toISOString(),
      updatedAt: user.updatedAt?.toISOString() ?? new Date().toISOString(),
      lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
      preferences: user.preferences,
    };
  }

  private mapSession(session: SessionDocument, currentSessionId?: string) {
    const id = session.id;
    const userId =
      session.user instanceof Types.ObjectId
        ? session.user.toHexString()
        : (session.user as string);

    return {
      id,
      userId,
      deviceInfo: session.deviceInfo,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      createdAt: session.createdAt?.toISOString() ?? new Date().toISOString(),
      lastActiveAt:
        session.lastActiveAt?.toISOString() ?? new Date().toISOString(),
      expiresAt: session.expiresAt?.toISOString() ?? new Date().toISOString(),
      isActive: session.isActive,
      isCurrent: currentSessionId ? id === currentSessionId : undefined,
    };
  }

  private resolveDeviceInfo(userAgent?: string): SessionDeviceInfo {
    const ua = userAgent ?? 'Unknown';
    const isMobile = /mobile|android|iphone|ipad/i.test(ua);
    const browser = /chrome/i.test(ua)
      ? 'Chrome'
      : /safari/i.test(ua) && !/chrome/i.test(ua)
      ? 'Safari'
      : /firefox/i.test(ua)
      ? 'Firefox'
      : /edg/i.test(ua)
      ? 'Edge'
      : 'Unknown';

    const os = /windows/i.test(ua)
      ? 'Windows'
      : /mac os|macintosh/i.test(ua)
      ? 'macOS'
      : /android/i.test(ua)
      ? 'Android'
      : /iphone|ipad|ios/i.test(ua)
      ? 'iOS'
      : /linux/i.test(ua)
      ? 'Linux'
      : 'Unknown';

    return {
      browser,
      os,
      device: isMobile ? 'Mobile' : 'Desktop',
      isMobile,
    };
  }
}
