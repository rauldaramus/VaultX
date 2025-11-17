/**
 * @file: crypto-smoke.ts
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

import { strict as assert } from 'node:assert';

import { CryptoService } from '../common/crypto/crypto.service';

async function run() {
  const cryptoService = new CryptoService();
  const plaintext = 'VaultX zero-knowledge smoke test';

  const { envelope, passphrase } = await cryptoService.encrypt(plaintext);
  const decrypted = await cryptoService.decrypt(envelope, passphrase);

  assert.equal(
    decrypted,
    plaintext,
    'Decrypted secret should match the original plaintext'
  );

  // eslint-disable-next-line no-console
  console.log('✅ CryptoService smoke test passed');
}

run().catch(error => {
  // eslint-disable-next-line no-console
  console.error('❌ CryptoService smoke test failed', error);
  process.exit(1);
});
