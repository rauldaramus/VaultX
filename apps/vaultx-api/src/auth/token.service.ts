/**
 * @file: token.service.ts
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

import { createHash, randomBytes } from 'node:crypto';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt, { JwtPayload } from 'jsonwebtoken';

import type { AppConfig } from '../config';

export interface AccessTokenPayload extends JwtPayload {
  sub: string;
  email: string;
  role: string;
  sessionId: string;
}

interface RefreshTokenPayload {
  token: string;
  expiresAt: Date;
  ttl: number;
}

@Injectable()
export class TokenService {
  constructor(private readonly configService: ConfigService<AppConfig>) {}

  createAccessToken(payload: Omit<AccessTokenPayload, 'iat' | 'exp'>): {
    token: string;
    expiresIn: number;
  } {
    const config = this.getAuthConfig();
    const token = jwt.sign(payload, config.accessTokenSecret, {
      expiresIn: config.accessTokenTtl,
    });
    return { token, expiresIn: config.accessTokenTtl };
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    try {
      const config = this.getAuthConfig();
      return jwt.verify(token, config.accessTokenSecret) as AccessTokenPayload;
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  createRefreshToken(ttlOverride?: number): RefreshTokenPayload {
    const config = this.getAuthConfig();
    const ttl = ttlOverride ?? config.refreshTokenTtl;
    const expiresAt = new Date(Date.now() + ttl * 1000);
    const token = randomBytes(64).toString('base64url');
    return { token, expiresAt, ttl };
  }

  hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private getAuthConfig(): AppConfig['auth'] {
    const config = this.configService.get<AppConfig>('config', { infer: true });
    if (!config?.auth) {
      throw new Error('Auth configuration is not defined');
    }
    return config.auth;
  }
}
