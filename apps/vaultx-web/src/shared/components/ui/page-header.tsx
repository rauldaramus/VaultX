/**
 * @file: page-header.tsx
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

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type React from 'react';

import { Button } from '@/shared/components/ui/button';
import { DynamicBreadcrumb } from '@/shared/components/ui/dynamic-breadcrumb';
import { useBreadcrumb } from '@/shared/hooks/useBreadcrumb';
import { cn } from '@/shared/lib/utils';

interface PageHeaderProps {
  title?: string;
  description?: string;
  showBackButton?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  showBackButton = false,
  className,
  children,
}: PageHeaderProps) {
  const router = useRouter();
  const { currentPage, parentPage } = useBreadcrumb();

  const pageTitle = title || currentPage?.label || 'Page';
  const pageDescription = description;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Breadcrumb Navigation */}
      <DynamicBreadcrumb />

      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {showBackButton && parentPage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="h-8 w-8 p-0"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Go back</span>
              </Button>
            )}
            <h1 className="text-2xl font-bold tracking-tight">{pageTitle}</h1>
          </div>
          {pageDescription && (
            <p className="text-muted-foreground">{pageDescription}</p>
          )}
        </div>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
    </div>
  );
}
