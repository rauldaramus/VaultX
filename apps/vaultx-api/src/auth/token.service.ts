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
import jwt, { JwtHeader, JwtPayload } from 'jsonwebtoken';

import type { AppConfig } from '../config';

export interface AccessTokenPayload extends JwtPayload {
  sub: string;
  email: string;
  role: string;
  sessionId: string;
}

interface OpaqueTokenPayload {
  token: string;
  expiresAt: Date;
  ttl: number;
}

interface JwtKeyDetails {
  kid: string;
  privateKey: string;
  publicKey: string;
}

@Injectable()
export class TokenService {
  private readonly keyStore = new Map<string, JwtKeyDetails>();
  private activeKid: string;

  constructor(private readonly configService: ConfigService<AppConfig>) {
    const config = this.getAuthConfig();
    config.jwt.keys.forEach(key => {
      this.keyStore.set(key.kid, key);
    });
    this.activeKid = config.jwt.activeKid;
  }

  createAccessToken(payload: Omit<AccessTokenPayload, 'iat' | 'exp'>): {
    token: string;
    expiresIn: number;
  } {
    const config = this.getAuthConfig();
    const key = this.getActiveKey();
    const token = jwt.sign(payload, key.privateKey, {
      expiresIn: config.accessTokenTtl,
      algorithm: 'RS256',
      keyid: key.kid,
    });

    return { token, expiresIn: config.accessTokenTtl };
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    try {
      const publicKey = this.getPublicKeyForToken(token);
      return jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
      }) as AccessTokenPayload;
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  getPublicKeyForToken(token: string): string {
    const decoded = jwt.decode(token, { complete: true }) as {
      header: JwtHeader;
    } | null;
    const kid = decoded?.header?.kid ?? this.activeKid;
    const key = this.keyStore.get(kid);
    if (!key) {
      throw new UnauthorizedException('Unknown token key identifier');
    }
    return key.publicKey;
  }

  rotateAccessTokenKey(kid: string): void {
    if (!this.keyStore.has(kid)) {
      throw new Error(`JWT key "${kid}" is not available`);
    }
    this.activeKid = kid;
  }

  createRefreshToken(ttlOverride?: number): OpaqueTokenPayload {
    const config = this.getAuthConfig();
    const ttl = ttlOverride ?? config.refreshTokenTtl;
    const expiresAt = new Date(Date.now() + ttl * 1000);
    const token = randomBytes(64).toString('base64url');
    return { token, expiresAt, ttl };
  }

  createOneTimeToken(ttlSeconds: number, size = 48): OpaqueTokenPayload {
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
    const token = randomBytes(size).toString('base64url');
    return { token, expiresAt, ttl: ttlSeconds };
  }

  hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private getActiveKey(): JwtKeyDetails {
    if (this.keyStore.size === 0) {
      throw new Error('No JWT signing keys configured');
    }
    const active = this.keyStore.get(this.activeKid);
    if (active) {
      return active;
    }

    const fallback = this.keyStore.values().next().value as
      | JwtKeyDetails
      | undefined;
    if (!fallback) {
      throw new Error('No JWT signing keys configured');
    }
    this.activeKid = fallback.kid;
    return fallback;
  }

  private getAuthConfig(): AppConfig['auth'] {
    const config = this.configService.get<AppConfig>('config', { infer: true });
    if (!config?.auth) {
      throw new Error('Auth configuration is not defined');
    }
    return config.auth;
  }
}
