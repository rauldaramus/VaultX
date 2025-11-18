/**
 * @file: seed.ts
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

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { resolveSeedPayload } from '@vaultx/shared';
import { hashSync, genSaltSync } from 'bcryptjs';

import { AppModule } from '../app.module';
import { createLogger } from '../common/utils/logger.util';
import type { AppConfig } from '../config';
import { SecretRepository } from '../infrastructure/database/repositories/secret.repository';
import { UserRepository } from '../infrastructure/database/repositories/user.repository';

const logger = createLogger('SeedScript');

function hashPassword(password: string): string {
  const salt = genSaltSync(12);
  return hashSync(password, salt);
}

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });

  try {
    const configService = app.get(ConfigService<AppConfig>);
    const config = configService.get<AppConfig>('config', { infer: true });
    logger.info(`Seeding data into MongoDB at ${config.mongo.uri}`);

    const seedPayload = resolveSeedPayload();
    const userRepository = app.get(UserRepository);
    const secretRepository = app.get(SecretRepository);

    for (const user of seedPayload.users) {
      await userRepository.upsertById(user.id, {
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        password: hashPassword(user.password),
        emailVerified: user.emailVerified ?? true,
        twoFactorEnabled: user.twoFactorEnabled ?? false,
      } as any);
      logger.info(`Ensured user ${user.email}`);
    }

    for (const secret of seedPayload.secrets) {
      const passphrase =
        secret.passphrase ?? `${secret.ownerId}-default-passphrase`;

      await secretRepository.upsertById(
        secret.title,
        {
          title: secret.title,
          content: secret.plaintext,
          type: secret.type ?? 'text',
          status: 'Active',
          tags: secret.tags ?? [],
          expiresAt: secret.expiresAt ? new Date(secret.expiresAt) : null,
          isViewed: false,
          viewCount: 0,
          lastViewedAt: null,
          createdBy: secret.ownerId,
          isProtected: secret.isProtected ?? true,
          maxViews: secret.maxViews ?? null,
          allowedIPs: secret.allowedIPs ?? [],
          metadata: {
            ...secret.metadata,
            seeded: true,
          },
        } as any,
        { passphrase }
      );

      logger.info(`Seeded secret "${secret.title}" for user ${secret.ownerId}`);
    }

    logger.info('Seed process completed successfully');
  } catch (error) {
    logger.error(
      error instanceof Error
        ? { err: error }
        : { err: new Error('Unknown seed error') },
      'Seed process failed'
    );
    throw error;
  } finally {
    await app.close();
  }
}

run().catch(error => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
