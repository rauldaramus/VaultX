/**
 * @file: validation.ts
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

import * as Joi from 'joi';

export const validationSchema = Joi.object({
  APP_NAME: Joi.string().default('VaultX API'),
  APP_ENV: Joi.string()
    .valid('development', 'test', 'production', 'staging')
    .default('development'),
  APP_HOST: Joi.string().hostname().default('0.0.0.0'),
  APP_PORT: Joi.number().port().default(3333),
  APP_GLOBAL_PREFIX: Joi.string().default('api'),
  AUTH_ACCESS_TOKEN_SECRET: Joi.string().min(16).default('dev-access-secret'),
  AUTH_REFRESH_TOKEN_SECRET: Joi.string().min(16).default('dev-refresh-secret'),
  AUTH_ACCESS_TOKEN_TTL: Joi.number().integer().positive().default(900),
  AUTH_REFRESH_TOKEN_TTL: Joi.number()
    .integer()
    .positive()
    .default(60 * 60 * 24 * 7),
  AUTH_REFRESH_TOKEN_COOKIE: Joi.string().default('vaultx_refresh_token'),
  AUTH_BCRYPT_SALT_ROUNDS: Joi.number().integer().min(4).default(12),
  AUTH_EMAIL_VERIFICATION_TTL: Joi.number()
    .integer()
    .positive()
    .default(60 * 60 * 24),
  AUTH_PASSWORD_RESET_TTL: Joi.number()
    .integer()
    .positive()
    .default(60 * 30),
  AUTH_JWT_ACTIVE_KID: Joi.string().default('vaultx-dev-key'),
  AUTH_JWT_PRIVATE_KEY: Joi.string().optional(),
  AUTH_JWT_PUBLIC_KEY: Joi.string().optional(),
  AUTH_JWT_KEYS: Joi.string()
    .custom((value, helpers) => {
      if (!value) {
        return value;
      }
      try {
        JSON.parse(value);
        return value;
      } catch {
        return helpers.error('any.invalid');
      }
    })
    .messages({
      'any.invalid': 'AUTH_JWT_KEYS must be a valid JSON array string',
    })
    .optional(),
  AUTH_OAUTH_CLIENT_ID: Joi.string().default('vaultx-dev-client'),
  AUTH_OAUTH_CLIENT_SECRET: Joi.string().default('vaultx-dev-secret'),
  AUTH_OAUTH_AUTHORIZATION_URL: Joi.string()
    .uri()
    .default('https://auth.vaultx.dev/oauth/authorize'),
  AUTH_OAUTH_TOKEN_URL: Joi.string()
    .uri()
    .default('https://auth.vaultx.dev/oauth/token'),
  AUTH_OAUTH_CALLBACK_URL: Joi.string()
    .uri()
    .default('http://localhost:3333/api/auth/oauth/callback'),
  AUTH_OAUTH_SCOPE: Joi.string().default('openid,email'),

  SWAGGER_ENABLED: Joi.boolean().truthy('true').falsy('false').default(true),
  SWAGGER_PATH: Joi.string().default('docs'),
  API_VERSION: Joi.string().default('0.1.0'),
  SWAGGER_DESCRIPTION: Joi.string().default(
    'Documentación interactiva de la API de VaultX.'
  ),
  SWAGGER_SPEC_PATH: Joi.string().default('docs/api/openapi.yaml'),

  MONGO_URI: Joi.string()
    .uri({ scheme: ['mongodb', 'mongodb+srv'] })
    .default('mongodb://localhost:27017/vaultx'),
  MONGO_DB_NAME: Joi.string().default('vaultx'),
  MONGO_USER: Joi.string().optional(),
  MONGO_PASSWORD: Joi.string().optional(),

  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().port().default(6379),
  REDIS_USERNAME: Joi.string().optional(),
  REDIS_PASSWORD: Joi.string().optional(),
  REDIS_TLS: Joi.boolean().truthy('true').falsy('false').default(false),

  OTEL_ENABLED: Joi.boolean().truthy('true').falsy('false').default(true),
  OTEL_SERVICE_NAME: Joi.string().default('vaultx-api'),
  OTEL_PROM_PORT: Joi.number().port().default(9464),

  CORS_ORIGINS: Joi.string().default(
    'http://localhost:3000,http://localhost:4200'
  ),
});
