/**
 * @file: index.ts
 * @description: Default seed fixtures shared between API and tooling.
 */

import type {
  CreateSecretRequest,
  Secret,
} from '../types/entities/secret.types.js';
import type { User } from '../types/entities/user.types.js';

export interface SeedUser
  extends Pick<User, 'id' | 'email' | 'name' | 'role' | 'status'> {
  password: string;
  twoFactorEnabled?: boolean;
  emailVerified?: boolean;
}

export interface SeedSecret extends Omit<CreateSecretRequest, 'metadata'> {
  ownerId: string;
  metadata?: Record<string, unknown>;
  plaintext: string;
  passphrase?: string;
}

export interface SeedPayload {
  users: SeedUser[];
  secrets: SeedSecret[];
}

export const defaultSeedPayload: SeedPayload = {
  users: [
    {
      id: 'seed-user-admin',
      email: 'admin@vaultx.dev',
      name: 'VaultX Admin',
      role: 'admin',
      status: 'active',
      password: 'VaultXAdmin!2025',
      emailVerified: true,
      twoFactorEnabled: false,
    },
    {
      id: 'seed-user-demo',
      email: 'demo@vaultx.dev',
      name: 'Demo User',
      role: 'user',
      status: 'active',
      password: 'VaultXDemo!2025',
      emailVerified: true,
      twoFactorEnabled: false,
    },
  ],
  secrets: [
    {
      title: 'Demo API Key',
      plaintext: 'sk-demo-0123456789abcdef',
      ownerId: 'seed-user-demo',
      tags: ['demo', 'api-key'],
      isProtected: true,
      passphrase: 'demo-passphrase',
      content: '',
    },
    {
      title: 'Production Credentials',
      plaintext: 'vaultx-prod-password-strong',
      ownerId: 'seed-user-admin',
      tags: ['production', 'database'],
      isProtected: true,
      passphrase: 'admin-passphrase',
      expiresAt: null,
      content: '',
    },
  ],
};

export function resolveSeedPayload(
  overrides?: Partial<SeedPayload>
): SeedPayload {
  if (!overrides) {
    return defaultSeedPayload;
  }

  return {
    users: overrides.users ?? defaultSeedPayload.users,
    secrets: overrides.secrets ?? defaultSeedPayload.secrets,
  };
}

export function buildSeedSecretReference(
  secret: SeedSecret,
  envelopeId: string
): Secret {
  return {
    id: envelopeId,
    title: secret.title,
    content: '',
    type: secret.type ?? 'text',
    status: 'Active',
    tags: secret.tags ?? [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    expiresAt: secret.expiresAt ?? null,
    isViewed: false,
    viewCount: 0,
    lastViewedAt: null,
    createdBy: secret.ownerId,
    isProtected: secret.isProtected ?? true,
    maxViews: secret.maxViews ?? null,
    allowedIPs: secret.allowedIPs ?? [],
    metadata: secret.metadata ?? {},
  };
}

export function nowIso(): string {
  return new Date().toISOString();
}
