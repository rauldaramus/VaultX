'use client';

import { SecretItem } from './SecretItem';
import { useSecretsData } from '../hooks/use-secrets-data';

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
