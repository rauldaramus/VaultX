'use client';

import type React from 'react';

import { useBreadcrumb } from '@/shared/hooks/useBreadcrumb';
import { DynamicBreadcrumb } from '@/shared/components/ui/dynamic-breadcrumb';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
