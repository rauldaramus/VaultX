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

type JwtKeyPair = {
  kid: string;
  privateKey: string;
  publicKey: string;
};

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
    bcryptSaltRounds: number;
    emailVerificationTtl: number;
    passwordResetTtl: number;
    jwt: {
      activeKid: string;
      keys: JwtKeyPair[];
    };
    oauth: {
      clientId: string;
      clientSecret: string;
      authorizationUrl: string;
      tokenUrl: string;
      callbackUrl: string;
      scope: string[];
    };
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

const DEV_RSA_PRIVATE_KEY = [
  '-----BEGIN RSA PRIVATE KEY-----',
  'MIIEowIBAAKCAQEAx9IEjk7Sry0cEncCcReCtaqtzJytN63iE0lhu/qWQ6H0+ya+',
  'ZclCPT2OTDSp69oT/bRRvIj+D4IxeO8EzYq9WCo3kshIsASsy/pl9YgKE49NMN/t',
  'MUZFijpgB9ewReHv6gT32+RByUBXl23iYQtAOBVIotqjtd4VbqdXgHuOPzOdR9lb',
  'I3Ys1H4g5jZ1mWh4gyG3HOpA0f0BBOVSBDXqyOzM75OEb/lKwJQykiNHutTYWngU',
  'gO4q3tDhIyQ9q9YUffE4Qz57/mH4ze6OFCA5hcrurgkfybl7ISY8bF6Xcn31LVA0',
  'VytQXgxe3XxBoUrbXEbMIEu66gowPMBwNBLHZQIDAQABAoIBAEBTwhe2FGlEkmb3',
  'XRffQ7sMKUtXnQPxvHgNBaOodjtrphw8Sssl0Wc5q9eolJNS72CbbjzNtUx000xl',
  'Vhx9b5s0bBOa2pufxakdATncA7JsTaNQU2Grh7OKO2QK8bptk/i4hLqLbwpE5m3f',
  'eCNZpeDoKSwUSuO/jRLEWI0KOa7qctppefom3Vrhxq5L5KdkuuQ1O92OW/r+IBQa',
  'Bwk+BQPMDYStllYMZ+NulxQUthzXV+sOKuDpptBSqecfekBaCHbBYh7LzyezGhWf',
  'SMfGKWTN6rvrxhnXG/ohYtvYFDNNQ7JRkPn/Kw1nxMOU31VU32JBKbWr1zrlScX8',
  'WtMaMnkCgYEA8pnCjT2XS3v9o3pKvmKItJRy93bX9lRBXJNcX0oxR26vhqZ48M02',
  'VQMKQyMyaXeAvqIe4vClluVYfsqvntsekNEHoJP9ZAFgtyVNQiZR7+60+H4ntLG0',
  'vOyiN/IR4FQtAZha+FRN/aW2UMjYhrJJO3D+Wg8zbdqKzsS8pumhF1sCgYEA0tte',
  'XXIm6awv/8+hOgBswdu0KNC7OV2yxYq5OiGOO5w8C5K39vfJXguBUGYiXzodByBP',
  'ah5XF+sV+dO+NSfiC7Xq6qdYBvuLtNMOw2kGmT/T1niazI6+5xr+aWqcgckYM5Sz',
  'L7BBaifcTUgXbXHCG4A1Dl1sHFiojg6w/9OwmD8CgYEAlofz4SHbc/oOqtZh9Ho9',
  'axdFsulqHa2wFNpXEcV+iF1Uyo8XMguTb/J/9qKrUCfXmfIMijJZ/SR34cywZjh+',
  'YctiGTBapSf5tAqQQsB2TRNn9VyKFKPDiwqlqWMp1nFEr92ybK4a6o1dcAj/2axc',
  'pmZ5XLZb6gkV4jDPAh6rV0sCgYA0NVLZKmGOLC86VMuj0+UZ3u9tx7kDzDpuhRm1',
  '1gckpVuMtghM4y991LVxFcje8UGsuQhQyzBfYLrxP8dx2+0xXxrKfSLjn7cIz9Vw',
  '9vlGSrKGARi7G4ETMfDaYyZbUFJouyHe5fJceYAntnjuhWM9cfIxG1qgbidV/TdA',
  'MMch+wKBgHcuw9DXhOxBnFRCzXeCzxeTo/Bxus0M3GdhBydG+MQFgwOrzvto92ey',
  '6T+KW9KciZAt3eBNNWpK4KD6n4ggwvXtplWR/rPHzcnAPl0q23gH7eS2W5pXhFQP',
  'FRgMnj+pzuJS28PgeZFXYjMwtajRbWgj8lypG9InSlGrpLdg/cx0',
  '-----END RSA PRIVATE KEY-----',
].join('\n');

const DEV_RSA_PUBLIC_KEY = [
  '-----BEGIN PUBLIC KEY-----',
  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAx9IEjk7Sry0cEncCcReC',
  'taqtzJytN63iE0lhu/qWQ6H0+ya+ZclCPT2OTDSp69oT/bRRvIj+D4IxeO8EzYq9',
  'WCo3kshIsASsy/pl9YgKE49NMN/tMUZFijpgB9ewReHv6gT32+RByUBXl23iYQtA',
  'OBVIotqjtd4VbqdXgHuOPzOdR9lbI3Ys1H4g5jZ1mWh4gyG3HOpA0f0BBOVSBDXq',
  'yOzM75OEb/lKwJQykiNHutTYWngUgO4q3tDhIyQ9q9YUffE4Qz57/mH4ze6OFCA5',
  'hcrurgkfybl7ISY8bF6Xcn31LVA0VytQXgxe3XxBoUrbXEbMIEu66gowPMBwNBLH',
  'ZQIDAQAB',
  '-----END PUBLIC KEY-----',
].join('\n');

const normalizePem = (value: string): string =>
  value.includes('\\n') ? value.replace(/\\n/g, '\n') : value;

const parseJwtKeys = (raw?: string): JwtKeyPair[] | null => {
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as JwtKeyPair[];
    return parsed.map(key => ({
      kid: key.kid,
      privateKey: normalizePem(key.privateKey),
      publicKey: normalizePem(key.publicKey),
    }));
  } catch {
    return null;
  }
};

export const configuration = (): { config: AppConfig } => {
  const corsOrigins = splitAndTrim(process.env.CORS_ORIGINS);
  const jwtKeysFromEnv = parseJwtKeys(process.env.AUTH_JWT_KEYS) ?? undefined;
  const fallbackKid = process.env.AUTH_JWT_ACTIVE_KID ?? 'vaultx-dev-key';
  const fallbackPrivate = normalizePem(
    process.env.AUTH_JWT_PRIVATE_KEY ?? DEV_RSA_PRIVATE_KEY
  );
  const fallbackPublic = normalizePem(
    process.env.AUTH_JWT_PUBLIC_KEY ?? DEV_RSA_PUBLIC_KEY
  );
  const jwtKeys = jwtKeysFromEnv ?? [
    {
      kid: fallbackKid,
      privateKey: fallbackPrivate,
      publicKey: fallbackPublic,
    },
  ];
  const activeKid =
    jwtKeys.find(key => key.kid === fallbackKid)?.kid ?? jwtKeys[0].kid;

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
        bcryptSaltRounds: Number(process.env.AUTH_BCRYPT_SALT_ROUNDS ?? 12),
        emailVerificationTtl: Number(
          process.env.AUTH_EMAIL_VERIFICATION_TTL ?? 60 * 60 * 24
        ),
        passwordResetTtl: Number(
          process.env.AUTH_PASSWORD_RESET_TTL ?? 60 * 30
        ),
        jwt: {
          activeKid,
          keys: jwtKeys,
        },
        oauth: {
          clientId: process.env.AUTH_OAUTH_CLIENT_ID ?? 'vaultx-dev-client',
          clientSecret:
            process.env.AUTH_OAUTH_CLIENT_SECRET ?? 'vaultx-dev-secret',
          authorizationUrl:
            process.env.AUTH_OAUTH_AUTHORIZATION_URL ??
            'https://auth.vaultx.dev/oauth/authorize',
          tokenUrl:
            process.env.AUTH_OAUTH_TOKEN_URL ??
            'https://auth.vaultx.dev/oauth/token',
          callbackUrl:
            process.env.AUTH_OAUTH_CALLBACK_URL ??
            'http://localhost:3333/api/auth/oauth/callback',
          scope: splitAndTrim(process.env.AUTH_OAUTH_SCOPE) ?? [
            'openid',
            'email',
          ],
        },
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
          corsOrigins.length > 0
            ? corsOrigins
            : ['http://localhost:3000', 'http://localhost:4200'],
      },
    },
  };
};
