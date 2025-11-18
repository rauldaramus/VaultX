/**
 * @file: token.service.spec.ts
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

import type { ConfigService } from '@nestjs/config';

import type { AppConfig } from '../../config';

import { TokenService } from './token.service';

const TEST_PRIVATE_KEY = [
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

const TEST_PUBLIC_KEY = [
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

const createConfig = (): AppConfig => ({
  app: {
    name: 'VaultX API',
    env: 'test',
    host: 'localhost',
    port: 3333,
    globalPrefix: 'api/v1',
  },
  auth: {
    accessTokenSecret: 'access-secret',
    refreshTokenSecret: 'refresh-secret',
    accessTokenTtl: 900,
    refreshTokenTtl: 60 * 60 * 24 * 7,
    refreshTokenCookie: 'vaultx_refresh_token',
    bcryptSaltRounds: 12,
    emailVerificationTtl: 60 * 60 * 24,
    passwordResetTtl: 60 * 30,
    jwt: {
      activeKid: 'kid-1',
      keys: [
        {
          kid: 'kid-1',
          privateKey: TEST_PRIVATE_KEY,
          publicKey: TEST_PUBLIC_KEY,
        },
        {
          kid: 'kid-2',
          privateKey: TEST_PRIVATE_KEY,
          publicKey: TEST_PUBLIC_KEY,
        },
      ],
    },
    oauth: {
      clientId: 'client-id',
      clientSecret: 'client-secret',
      authorizationUrl: 'https://auth.example.com/authorize',
      tokenUrl: 'https://auth.example.com/token',
      callbackUrl: 'https://vaultx.dev/auth/callback',
      scope: ['openid', 'email'],
    },
  },
  swagger: {
    enabled: false,
    path: 'docs',
    title: 'VaultX API',
    description: 'API docs',
    version: '0.1.0',
    specPath: 'docs/api/openapi.yaml',
  },
  mongo: {
    uri: 'mongodb://localhost:27017/vaultx',
    dbName: 'vaultx',
  },
  redis: {
    host: 'localhost',
    port: 6379,
    tls: false,
  },
  telemetry: {
    enabled: false,
    serviceName: 'vaultx-api',
    metricsPort: 9464,
  },
  security: {
    corsOrigins: ['http://localhost:3000'],
  },
});

const createConfigService = () =>
  ({
    get: jest.fn().mockImplementation(() => createConfig()),
  } as unknown as ConfigService<AppConfig>);

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(() => {
    service = new TokenService(createConfigService());
  });

  it('should create and verify RS256 access tokens', () => {
    const payload = {
      sub: 'user-1',
      email: 'test@example.com',
      role: 'user',
      sessionId: 'session-123',
    };

    const { token, expiresIn } = service.createAccessToken(payload);
    expect(token).toBeDefined();
    expect(expiresIn).toBeGreaterThan(0);

    const verified = service.verifyAccessToken(token);
    expect(verified.sub).toBe(payload.sub);
    expect(verified.email).toBe(payload.email);
    expect(verified.sessionId).toBe(payload.sessionId);
  });

  it('should rotate signing keys', () => {
    service.rotateAccessTokenKey('kid-2');
    const payload = {
      sub: 'user-rotation',
      email: 'rotate@example.com',
      role: 'admin',
      sessionId: 'session-rotate',
    };

    const { token } = service.createAccessToken(payload);
    const verified = service.verifyAccessToken(token);
    expect(verified.sub).toBe(payload.sub);
  });

  it('should throw when rotating to unknown kid', () => {
    expect(() => service.rotateAccessTokenKey('missing')).toThrow(
      /not available/i
    );
  });

  it('should create secure refresh tokens', () => {
    const ttlOverride = 120;
    const refresh = service.createRefreshToken(ttlOverride);

    expect(refresh.ttl).toBe(ttlOverride);
    expect(refresh.token).toBeDefined();
    expect(refresh.expiresAt.getTime()).toBeGreaterThan(Date.now());
  });

  it('should create one-time tokens with custom size', () => {
    const oneTime = service.createOneTimeToken(300, 32);
    expect(oneTime.ttl).toBe(300);
    expect(oneTime.token).toBeDefined();
    expect(oneTime.token.length).toBeGreaterThan(32);
  });

  it('should hash tokens deterministically', () => {
    const token = 'sample-refresh-token';
    expect(service.hashToken(token)).toBe(service.hashToken(token));
  });
});
