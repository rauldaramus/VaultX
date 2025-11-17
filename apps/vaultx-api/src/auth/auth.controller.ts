/**
 * @file: auth.controller.ts
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
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { OAuthProvider } from '@vaultx/shared';
import { createSuccessResponse } from '@vaultx/shared';
import type { Request } from 'express';

import { AuthService, AuthRequestContext } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ConfirmResetPasswordDto } from './dto/confirm-reset-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SessionActivityInterceptor } from './interceptors/session-activity.interceptor';
import type { AccessTokenPayload } from './token.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Req() req: Request) {
    const result = await this.authService.register(dto, this.buildContext(req));
    return createSuccessResponse(result, 'User registered successfully', 201);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    const result = await this.authService.login(
      dto,
      this.buildContext(req, dto.rememberMe)
    );
    return createSuccessResponse(result, 'Login successful');
  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto, @Req() req: Request) {
    const refreshToken = this.resolveRefreshToken(req, dto);
    const result = await this.authService.refresh(
      dto,
      refreshToken,
      this.buildContext(req)
    );
    return createSuccessResponse(result, 'Token rotated');
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser() user: AccessTokenPayload) {
    await this.authService.logout(user);
    return createSuccessResponse({ message: 'Logged out successfully' });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(SessionActivityInterceptor)
  async me(@CurrentUser() user: AccessTokenPayload) {
    const profile = await this.authService.getProfile(user.sub);
    return createSuccessResponse({ user: profile });
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(SessionActivityInterceptor)
  async updateProfile(
    @Body() dto: UpdateProfileDto,
    @CurrentUser() user: AccessTokenPayload
  ) {
    const profile = await this.authService.updateProfile(user.sub, dto);
    return createSuccessResponse({ user: profile }, 'Profile updated');
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Body() dto: ChangePasswordDto,
    @CurrentUser() user: AccessTokenPayload
  ) {
    const result = await this.authService.changePassword(user.sub, dto);
    return createSuccessResponse(result);
  }

  @Post('reset-password/request')
  async requestPasswordReset(@Body() dto: ResetPasswordRequestDto) {
    const result = await this.authService.requestPasswordReset(dto);
    return createSuccessResponse(result);
  }

  @Post('reset-password/confirm')
  async confirmPasswordReset(@Body() dto: ConfirmResetPasswordDto) {
    const result = await this.authService.confirmPasswordReset(dto);
    return createSuccessResponse(result);
  }

  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(SessionActivityInterceptor)
  async listSessions(@CurrentUser() user: AccessTokenPayload) {
    const sessions = await this.authService.listSessions(
      user.sub,
      user.sessionId
    );
    return createSuccessResponse({ sessions });
  }

  @Delete('sessions/:sessionId')
  @UseGuards(JwtAuthGuard)
  async revokeSession(
    @Param('sessionId') sessionId: string,
    @CurrentUser() user: AccessTokenPayload
  ) {
    const result = await this.authService.revokeSession(user.sub, sessionId);
    return createSuccessResponse(result);
  }

  @Post('verify-email')
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    const result = await this.authService.verifyEmail(dto);
    return createSuccessResponse(result);
  }

  @Post('verify-email/resend')
  async resendVerification(@Body() dto: ResendVerificationDto) {
    const result = await this.authService.resendVerification(dto);
    return createSuccessResponse(result);
  }

  @Get('oauth/:provider/authorize')
  async initiateOAuth(
    @Param('provider') provider: OAuthProvider,
    @Query('redirectUri') redirectUri?: string
  ) {
    const result = await this.authService.initiateOAuth(provider, redirectUri);
    return createSuccessResponse(result);
  }

  @Get('oauth/:provider/callback')
  async handleOAuthCallback(
    @Param('provider') provider: OAuthProvider,
    @Query('code') code: string,
    @Query('state') state: string
  ) {
    if (!code || !state) {
      throw new BadRequestException('Invalid OAuth callback parameters');
    }
    const result = await this.authService.handleOAuthCallback(
      provider,
      code,
      state
    );
    return createSuccessResponse(result);
  }

  private buildContext(req: Request, rememberMe?: boolean): AuthRequestContext {
    return {
      ipAddress: this.extractIp(req),
      userAgent: req.headers['user-agent'] ?? 'Unknown',
      rememberMe,
    };
  }

  private extractIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.length > 0) {
      const [first] = forwarded.split(',');
      if (first?.trim()) {
        return first.trim();
      }
    }
    if (Array.isArray(forwarded) && forwarded.length > 0) {
      const [first] = forwarded;
      if (first) {
        return first;
      }
    }
    return this.getFallbackIp(req);
  }

  private getFallbackIp(req: Request): string {
    return req.ip ?? req.connection?.remoteAddress ?? '0.0.0.0';
  }

  private resolveRefreshToken(
    req: Request,
    dto: RefreshTokenDto
  ): string | null {
    if (dto.refreshToken) {
      return dto.refreshToken;
    }
    const headerToken = req.headers['x-refresh-token'];
    if (typeof headerToken === 'string') {
      return headerToken;
    }
    return null;
  }
}
