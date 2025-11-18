/**
 * @file: ForgotPasswordForm.tsx
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

import Link from 'next/link';
import { useState } from 'react';

import { usePasswordReset } from '../hooks/use-password-reset';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { requestReset, isSubmitting, hasRequested } = usePasswordReset();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setFieldError('');
    setSuccessMessage('');

    const result = await requestReset({ email });

    if (result.success) {
      setSuccessMessage(
        result.message ??
          'Check your inbox for the secure reset link. Remember to review your spam folder.'
      );
      return;
    }

    setError(result.error ?? 'Unable to send reset instructions right now.');
    const emailError = result.validationErrors?.find(
      validationError => validationError.field === 'email'
    );
    if (emailError) {
      setFieldError(emailError.message);
    }
  };

  return (
    <Card className="border-border/60 shadow-lg hover-lift animate-fade-in-up opacity-0">
      <CardContent
        className="animate-scale-in opacity-0"
        style={{ animationDelay: '0.2s' }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md flex items-center gap-2 animate-fade-in-up">
              <svg
                className="w-4 h-4 flex-shrink-0 animate-pulse"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          {successMessage && (
            <div className="p-3 text-sm text-emerald-600 bg-emerald-600/10 border border-emerald-500/30 rounded-md flex items-center gap-2 animate-fade-in-up">
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-7.364 7.364a1 1 0 01-1.414 0L3.293 9.536a1 1 0 011.414-1.414l3.222 3.222 6.657-6.657a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              {successMessage}
            </div>
          )}

          <div
            className="space-y-2 animate-fade-in-left opacity-0"
            style={{ animationDelay: '0.3s' }}
          >
            <label
              htmlFor="email"
              className="text-sm font-medium leading-none transition-colors duration-200 hover:text-primary"
            >
              Email address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@vaultx.com"
              value={email}
              onChange={event => setEmail(event.target.value)}
              required
              className="h-11 transition-all duration-300 focus:scale-105 hover:border-primary/50"
            />
            {fieldError && (
              <p className="text-xs text-destructive">{fieldError}</p>
            )}
          </div>

          <div className="p-4 bg-muted/40 rounded-lg border animate-fade-in-up opacity-0">
            <p className="text-xs text-muted-foreground mb-2 font-medium">
              What happens next?
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• We send a secure link to the email you provide.</li>
              <li>• The link expires in 15 minutes for your security.</li>
              <li>• You can resend the email if it doesn&apos;t arrive.</li>
            </ul>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-white text-black hover:bg-gray-100 border border-gray-300 transition-all duration-300 hover:scale-105 hover-glow animate-fade-in-up opacity-0"
            disabled={isSubmitting}
            style={{ animationDelay: '0.4s' }}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                Sending secure link...
              </div>
            ) : hasRequested ? (
              'Resend reset link'
            ) : (
              'Send reset link'
            )}
          </Button>
        </form>

        <div
          className="mt-6 text-center text-sm text-muted-foreground animate-fade-in-up opacity-0"
          style={{ animationDelay: '0.5s' }}
        >
          <p>
            Remembered your password?{' '}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Back to sign in
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
