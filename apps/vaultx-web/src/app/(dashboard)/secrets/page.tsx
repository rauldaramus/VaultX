/**
 * @file: page.tsx
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

import { SearchSecrets } from '@/features/secrets/components/SearchSecrets';
import { SecretsList } from '@/features/secrets/components/SecretsList';

export default function SecretsPage() {
  return (
    <div className="space-y-8 animate-fade-in-up opacity-0">
      <div
        className="animate-fade-in-up opacity-0"
        style={{ animationDelay: '0.1s' }}
      >
        <h1 className="text-3xl font-bold transition-colors duration-300 hover:text-primary">
          My Secrets
        </h1>
        <p className="text-gray-400 transition-colors duration-200 hover:text-gray-300">
          Manage your secrets and view their current status.
        </p>
      </div>
      <div
        className="animate-fade-in-up opacity-0"
        style={{ animationDelay: '0.2s' }}
      >
        <SearchSecrets />
      </div>
      <div
        className="animate-fade-in-up opacity-0"
        style={{ animationDelay: '0.3s' }}
      >
        <SecretsList />
      </div>
    </div>
  );
}
