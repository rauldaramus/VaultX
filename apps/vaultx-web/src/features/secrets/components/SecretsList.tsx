/**
 * @file: SecretsList.tsx
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

'use client';

import { useSecretsData } from '../hooks/use-secrets-data';

import { SecretItem } from './SecretItem';

export function SecretsList() {
  const { secrets, loading, error } = useSecretsData();

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-24 w-full bg-muted animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive-foreground bg-destructive/20 p-4 rounded-md">
        <p>Error loading secrets: {error}</p>
        <p>Please refresh the page to try again.</p>
      </div>
    );
  }

  if (secrets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No secrets found</p>
        <p className="text-muted-foreground text-sm mt-2">
          Create your first secret to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {secrets.map(secret => (
        <SecretItem key={secret.id} secret={secret} />
      ))}
    </div>
  );
}
