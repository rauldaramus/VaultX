/**
 * @file: database.module.ts
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

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { CryptoModule } from '../../common/crypto';
import type { AppConfig } from '../../config';
import { AuthToken, AuthTokenSchema } from '../../schemas/auth-token.schema';
import {
  OAuthAccount,
  OAuthAccountSchema,
} from '../../schemas/oauth-account.schema';
import { Secret, SecretSchema } from '../../schemas/secret.schema';
import { Session, SessionSchema } from '../../schemas/session.schema';
import { User, UserSchema } from '../../schemas/user.schema';

import { AuthTokenRepository } from './repositories/auth-token.repository';
import { OAuthAccountRepository } from './repositories/oauth-account.repository';
import { SecretRepository } from './repositories/secret.repository';
import { SessionRepository } from './repositories/session.repository';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig>) => {
        const config = configService.get<AppConfig>('config', { infer: true });
        return {
          uri: config.mongo.uri,
          dbName: config.mongo.dbName,
          user: config.mongo.user,
          pass: config.mongo.pass,
        };
      },
    }),
    MongooseModule.forFeature([
      { name: Secret.name, schema: SecretSchema },
      { name: User.name, schema: UserSchema },
      { name: Session.name, schema: SessionSchema },
      { name: AuthToken.name, schema: AuthTokenSchema },
      { name: OAuthAccount.name, schema: OAuthAccountSchema },
    ]),
    CryptoModule,
  ],
  providers: [
    SecretRepository,
    UserRepository,
    SessionRepository,
    AuthTokenRepository,
    OAuthAccountRepository,
  ],
  exports: [
    MongooseModule,
    SecretRepository,
    UserRepository,
    SessionRepository,
    AuthTokenRepository,
    OAuthAccountRepository,
  ],
})
export class DatabaseModule {}
