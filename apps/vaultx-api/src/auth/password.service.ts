/**
 * @file: password.service.ts
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

import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordService {
  private readonly saltLength = 16;
  private readonly keyLength = 64;

  hash(password: string): string {
    const salt = randomBytes(this.saltLength);
    const derived = scryptSync(password, salt, this.keyLength);
    return `${salt.toString('hex')}:${derived.toString('hex')}`;
  }

  verify(password: string, hash: string): boolean {
    const [saltHex, hashedHex] = hash.split(':');
    if (!saltHex || !hashedHex) {
      return false;
    }

    const salt = Buffer.from(saltHex, 'hex');
    const hashedPassword = Buffer.from(hashedHex, 'hex');
    const derived = scryptSync(password, salt, this.keyLength);

    if (derived.length !== hashedPassword.length) {
      return false;
    }

    return timingSafeEqual(derived, hashedPassword);
  }
}
