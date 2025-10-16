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

'use client';

import { Lock, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { CreateSecretForm } from '@/features/secrets/components/CreateSecretForm';
import { Button } from '@/shared/components/ui/button';

function CreatePageHeader() {
  return (
    <header className="flex h-16 items-center border-b bg-background px-4 md:px-6">
      <div className="flex items-center justify-between w-full">
        <Link href="/home" className="flex items-center gap-2">
          <Lock className="h-6 w-6" />
          <span className="text-lg font-semibold">VaultX</span>
        </Link>
        <Button asChild variant="outline">
          <Link href="/home" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </Button>
      </div>
    </header>
  );
}

function CreatePageFooter() {
  return (
    <footer className="border-t bg-background p-4 text-center text-sm text-muted-foreground">
      © VaultX 2025. All rights reserved.
    </footer>
  );
}

export default function CreateSecretPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <CreatePageHeader />
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="mx-auto max-w-2xl">
            <CreateSecretForm />
          </div>
        </div>
      </main>
      <CreatePageFooter />
    </div>
  );
}
