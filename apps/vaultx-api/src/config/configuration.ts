/**
 * @file: configuration.ts
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

import { isAbsolute, resolve } from 'node:path';

export type AppConfig = {
  app: {
    name: string;
    env: 'development' | 'test' | 'production' | 'staging';
    host: string;
    port: number;
    globalPrefix: string;
  };
  auth: {
    accessTokenSecret: string;
    refreshTokenSecret: string;
    accessTokenTtl: number;
    refreshTokenTtl: number;
    refreshTokenCookie: string;
  };
  swagger: {
    enabled: boolean;
    path: string;
    title: string;
    description: string;
    version: string;
    specPath: string;
  };
  mongo: {
    uri: string;
    dbName: string;
    user?: string;
    pass?: string;
  };
  redis: {
    host: string;
    port: number;
    username?: string;
    password?: string;
    tls: boolean;
  };
  telemetry: {
    enabled: boolean;
    serviceName: string;
    metricsPort: number;
  };
  security: {
    corsOrigins: string[];
  };
};

const splitAndTrim = (value: string | undefined): string[] => {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map(origin => origin.trim())
    .filter(origin => origin.length > 0);
};

const resolveSpecPath = (value: string) =>
  isAbsolute(value) ? value : resolve(process.cwd(), value);

export const configuration = (): { config: AppConfig } => {
  const corsOrigins = splitAndTrim(process.env.CORS_ORIGINS);

  return {
    config: {
      app: {
        name: process.env.APP_NAME ?? 'VaultX API',
        env: (process.env.APP_ENV as AppConfig['app']['env']) ?? 'development',
        host: process.env.APP_HOST ?? '0.0.0.0',
        port: Number(process.env.APP_PORT ?? 3333),
        globalPrefix: process.env.APP_GLOBAL_PREFIX ?? 'api',
      },
      auth: {
        accessTokenSecret:
          process.env.AUTH_ACCESS_TOKEN_SECRET ?? 'dev-access-secret',
        refreshTokenSecret:
          process.env.AUTH_REFRESH_TOKEN_SECRET ?? 'dev-refresh-secret',
        accessTokenTtl: Number(process.env.AUTH_ACCESS_TOKEN_TTL ?? 900),
        refreshTokenTtl: Number(
          process.env.AUTH_REFRESH_TOKEN_TTL ?? 60 * 60 * 24 * 7
        ),
        refreshTokenCookie:
          process.env.AUTH_REFRESH_TOKEN_COOKIE ?? 'vaultx_refresh_token',
      },
      swagger: {
        enabled: (process.env.SWAGGER_ENABLED ?? 'true') === 'true',
        path: process.env.SWAGGER_PATH ?? 'docs',
        title: process.env.APP_NAME ?? 'VaultX API',
        description:
          process.env.SWAGGER_DESCRIPTION ??
          'Documentación interactiva de la API de VaultX.',
        version: process.env.API_VERSION ?? '0.1.0',
        specPath: resolveSpecPath(
          process.env.SWAGGER_SPEC_PATH ?? 'docs/api/openapi.yaml'
        ),
      },
      mongo: {
        uri: process.env.MONGO_URI ?? 'mongodb://localhost:27017/vaultx',
        dbName: process.env.MONGO_DB_NAME ?? 'vaultx',
        user: process.env.MONGO_USER || undefined,
        pass: process.env.MONGO_PASSWORD || undefined,
      },
      redis: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: Number(process.env.REDIS_PORT ?? 6379),
        username: process.env.REDIS_USERNAME || undefined,
        password: process.env.REDIS_PASSWORD || undefined,
        tls: (process.env.REDIS_TLS ?? 'false') === 'true',
      },
      telemetry: {
        enabled: (process.env.OTEL_ENABLED ?? 'true') === 'true',
        serviceName: process.env.OTEL_SERVICE_NAME ?? 'vaultx-api',
        metricsPort: Number(process.env.OTEL_PROM_PORT ?? 9464),
      },
      security: {
        corsOrigins:
          corsOrigins.length > 0 ? corsOrigins : ['http://localhost:3000'],
      },
    },
  };
};
