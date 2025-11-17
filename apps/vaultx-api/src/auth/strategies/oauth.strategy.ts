/**
 * @file: oauth.strategy.ts
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

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';

import type { AppConfig } from '../../config';
import { AuthService } from '../auth.service';

export interface OAuthPassportProfile {
  provider: string;
  id?: string;
  email?: string;
  displayName?: string;
  [key: string]: unknown;
}

@Injectable()
export class VaultxOAuthStrategy extends PassportStrategy(
  Strategy,
  'vaultx-oauth'
) {
  constructor(
    configService: ConfigService<AppConfig>,
    private readonly authService: AuthService
  ) {
    const config = configService.get<AppConfig>('config', { infer: true });
    if (!config?.auth?.oauth) {
      throw new Error('OAuth configuration is not available');
    }

    super({
      authorizationURL: config.auth.oauth.authorizationUrl,
      tokenURL: config.auth.oauth.tokenUrl,
      clientID: config.auth.oauth.clientId,
      clientSecret: config.auth.oauth.clientSecret,
      callbackURL: config.auth.oauth.callbackUrl,
      scope: config.auth.oauth.scope,
      state: true,
      passReqToCallback: false,
    });
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  userProfile(
    accessToken: string,
    done: (err?: Error | null, profile?: OAuthPassportProfile) => void
  ): void {
    done(null, {
      provider: 'vaultx-oauth',
      accessToken,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: OAuthPassportProfile
  ) {
    return this.authService.handleOAuthPassportCallback({
      accessToken,
      refreshToken,
      profile,
    });
  }
}
