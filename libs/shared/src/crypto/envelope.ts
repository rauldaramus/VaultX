/**
 * @file: envelope.ts
 * @description: Zero-knowledge secret envelope helpers shared across VaultX clients.
 */

type MinimalCryptoKey = unknown;

interface MinimalSubtleCrypto {
  importKey(
    format: string,
    keyData: ArrayBufferView | ArrayBuffer,
    algorithm: string,
    extractable: boolean,
    keyUsages: string[]
  ): Promise<MinimalCryptoKey>;
  deriveKey(
    algorithm: {
      name: string;
      salt: Uint8Array;
      iterations: number;
      hash: string;
    },
    baseKey: MinimalCryptoKey,
    derivedKeyType: { name: string; length: number },
    extractable: boolean,
    keyUsages: string[]
  ): Promise<MinimalCryptoKey>;
  encrypt(
    algorithm: { name: string; iv: Uint8Array; tagLength?: number },
    key: MinimalCryptoKey,
    data: ArrayBufferView
  ): Promise<ArrayBuffer>;
  decrypt(
    algorithm: { name: string; iv: Uint8Array; tagLength?: number },
    key: MinimalCryptoKey,
    data: ArrayBuffer
  ): Promise<ArrayBuffer>;
}

interface MinimalCrypto {
  subtle: MinimalSubtleCrypto;
  getRandomValues<T extends ArrayBufferView>(array: T): T;
}

const DEFAULT_ITERATIONS = 100_000;
const DEFAULT_KEY_LENGTH = 32;
const DEFAULT_SALT_BYTES = 16;
const DEFAULT_IV_BYTES = 12;
const DEFAULT_TAG_LENGTH = 128;

type SupportedDigest = 'SHA-256';

export interface SecretEnvelopeMeta {
  algorithm: 'AES-GCM';
  keyDerivation: 'PBKDF2';
  digest: SupportedDigest;
  iterations: number;
  keyLength: number;
  saltBytes: number;
  ivBytes: number;
  tagLength: number;
}

export interface SecretEnvelope {
  version: 'v1';
  ciphertext: string;
  iv: string;
  salt: string;
  createdAt: string;
  meta: SecretEnvelopeMeta;
}

export interface EnvelopeOptions {
  iterations?: number;
  keyLength?: number;
  saltBytes?: number;
  ivBytes?: number;
  digest?: SupportedDigest;
  tagLength?: number;
}

class CryptoUnavailableError extends Error {
  constructor() {
    super(
      'Web Crypto API is not available in the current runtime. Ensure the environment supports `crypto.subtle`.'
    );
    this.name = 'CryptoUnavailableError';
  }
}

type WebCrypto = MinimalCrypto;
type Subtle = MinimalSubtleCrypto;
type CryptoKey = MinimalCryptoKey;

function resolveCrypto(): WebCrypto {
  const crypto = (globalThis as typeof globalThis & { crypto?: MinimalCrypto })
    .crypto;
  if (!crypto || typeof crypto.subtle === 'undefined') {
    throw new CryptoUnavailableError();
  }
  return crypto;
}

async function getSubtle(): Promise<Subtle> {
  return resolveCrypto().subtle;
}

function toBase64(buffer: ArrayBuffer): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(buffer).toString('base64');
  }

  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function fromBase64(value: string): ArrayBuffer {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(value, 'base64').buffer;
  }

  const binary = atob(value);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function getRandomValues(length: number): Uint8Array {
  const crypto = resolveCrypto();
  const buffer = new Uint8Array(length);
  crypto.getRandomValues(buffer);
  return buffer;
}

async function deriveKeyMaterial(
  passphrase: string,
  salt: Uint8Array,
  options: Required<EnvelopeOptions>
): Promise<CryptoKey> {
  const subtle = await getSubtle();
  const encoder = new TextEncoder();
  const keyMaterial = await subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: options.iterations,
      hash: options.digest,
    },
    keyMaterial,
    {
      name: 'AES-GCM',
      length: options.keyLength * 8,
    },
    false,
    ['encrypt', 'decrypt']
  );
}

function resolveOptions(options?: EnvelopeOptions): Required<EnvelopeOptions> {
  return {
    iterations: options?.iterations ?? DEFAULT_ITERATIONS,
    keyLength: options?.keyLength ?? DEFAULT_KEY_LENGTH,
    saltBytes: options?.saltBytes ?? DEFAULT_SALT_BYTES,
    ivBytes: options?.ivBytes ?? DEFAULT_IV_BYTES,
    digest: options?.digest ?? 'SHA-256',
    tagLength: options?.tagLength ?? DEFAULT_TAG_LENGTH,
  };
}

export async function encryptSecretEnvelope(
  plaintext: string,
  passphrase: string,
  options?: EnvelopeOptions
): Promise<SecretEnvelope> {
  if (!plaintext) {
    throw new Error('Plaintext is required to create an envelope.');
  }

  if (!passphrase) {
    throw new Error('Passphrase is required to create an envelope.');
  }

  const resolvedOptions = resolveOptions(options);
  const salt = getRandomValues(resolvedOptions.saltBytes);
  const iv = getRandomValues(resolvedOptions.ivBytes);
  const subtle = await getSubtle();
  const key = await deriveKeyMaterial(passphrase, salt, resolvedOptions);

  const encoder = new TextEncoder();
  const encrypted = await subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
      tagLength: resolvedOptions.tagLength,
    },
    key,
    encoder.encode(plaintext)
  );

  return {
    version: 'v1',
    ciphertext: toBase64(encrypted),
    iv: toBase64(iv.buffer.slice(iv.byteOffset, iv.byteOffset + iv.byteLength)),
    salt: toBase64(
      salt.buffer.slice(salt.byteOffset, salt.byteOffset + salt.byteLength)
    ),
    createdAt: new Date().toISOString(),
    meta: {
      algorithm: 'AES-GCM',
      keyDerivation: 'PBKDF2',
      digest: resolvedOptions.digest,
      iterations: resolvedOptions.iterations,
      keyLength: resolvedOptions.keyLength,
      saltBytes: resolvedOptions.saltBytes,
      ivBytes: resolvedOptions.ivBytes,
      tagLength: resolvedOptions.tagLength,
    },
  };
}

export async function decryptSecretEnvelope(
  envelope: SecretEnvelope,
  passphrase: string
): Promise<string> {
  if (!envelope) {
    throw new Error('Secret envelope is required.');
  }

  const options = resolveOptions({
    iterations: envelope.meta.iterations,
    keyLength: envelope.meta.keyLength,
    saltBytes: envelope.meta.saltBytes,
    ivBytes: envelope.meta.ivBytes,
    digest: envelope.meta.digest,
    tagLength: envelope.meta.tagLength,
  });

  const salt = new Uint8Array(fromBase64(envelope.salt));
  const iv = new Uint8Array(fromBase64(envelope.iv));

  const subtle = await getSubtle();
  const key = await deriveKeyMaterial(passphrase, salt, options);

  const decrypted = await subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
      tagLength: options.tagLength,
    },
    key,
    fromBase64(envelope.ciphertext)
  );

  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

export function createEnvelopePassphrase(): string {
  const bytes = getRandomValues(32);
  return toBase64(
    bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
  );
}
