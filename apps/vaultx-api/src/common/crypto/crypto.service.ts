/**
 * @file: crypto.service.ts
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

import { webcrypto } from 'node:crypto';

import { Injectable } from '@nestjs/common';
import {
  encryptSecretEnvelope,
  decryptSecretEnvelope,
  createEnvelopePassphrase,
  SecretEnvelope,
  EnvelopeOptions,
} from '@vaultx/shared';

function ensureWebCryptoAvailability(): void {
  const scope = globalThis as typeof globalThis & {
    crypto?: typeof webcrypto;
  };

  if (
    !scope.crypto ||
    typeof scope.crypto.subtle === 'undefined' ||
    typeof scope.crypto.getRandomValues === 'undefined'
  ) {
    scope.crypto = webcrypto as typeof webcrypto;
  }
}

@Injectable()
export class CryptoService {
  constructor() {
    ensureWebCryptoAvailability();
  }

  /**
   * Encrypts plaintext content into a zero-knowledge envelope
   * @param plaintext - The content to encrypt
   * @param passphrase - The passphrase to use (auto-generated if not provided)
   * @param options - Optional encryption parameters
   * @returns The encrypted envelope and the passphrase used
   */
  async encrypt(
    plaintext: string,
    passphrase?: string,
    options?: EnvelopeOptions
  ): Promise<{ envelope: SecretEnvelope; passphrase: string }> {
    ensureWebCryptoAvailability();
    const finalPassphrase = passphrase || createEnvelopePassphrase();
    const envelope = await encryptSecretEnvelope(
      plaintext,
      finalPassphrase,
      options
    );
    return { envelope, passphrase: finalPassphrase };
  }

  /**
   * Decrypts a zero-knowledge envelope
   * @param envelope - The encrypted envelope
   * @param passphrase - The passphrase to decrypt with
   * @returns The decrypted plaintext
   */
  async decrypt(envelope: SecretEnvelope, passphrase: string): Promise<string> {
    ensureWebCryptoAvailability();
    return decryptSecretEnvelope(envelope, passphrase);
  }

  /**
   * Generates a cryptographically secure passphrase
   * @returns A random base64-encoded passphrase
   */
  generatePassphrase(): string {
    ensureWebCryptoAvailability();
    return createEnvelopePassphrase();
  }
}
