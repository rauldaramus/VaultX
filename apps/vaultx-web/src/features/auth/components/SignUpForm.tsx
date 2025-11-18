/**
 * @file: SignUpForm.tsx
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

import type { ValidationError } from '@vaultx/shared';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useAuth } from '../hooks/useAuth';

import { SSOButtons } from './SSOButtons';

import type { RegisterApiRequest } from '@/features/auth/api/models/auth.model';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Separator } from '@/shared/components/ui/separator';

type FieldErrors = Partial<Record<keyof RegisterApiRequest, string>>;

const mapValidationErrors = (errors?: ValidationError[]) => {
  if (!errors) {
    return {};
  }

  return errors.reduce<FieldErrors>((acc, error) => {
    acc[error.field as keyof RegisterApiRequest] = error.message;
    return acc;
  }, {});
};

export function SignUpForm() {
  const router = useRouter();
  const { register: registerUser, isLoading } = useAuth();
  const [formData, setFormData] = useState<RegisterApiRequest>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange =
    (field: keyof RegisterApiRequest) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [field]: event.target.value }));
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setFieldErrors({});
    setSuccessMessage('');

    if (formData.password !== formData.confirmPassword) {
      setFieldErrors({
        password: 'Passwords must match',
        confirmPassword: 'Passwords must match',
      });
      return;
    }

    const result = await registerUser(formData);

    if (result.success) {
      setSuccessMessage('Account created successfully. Redirecting...');
      router.push('/create');
      return;
    }

    setError(result.error ?? 'Unable to create your account.');
    if (result.validationErrors) {
      setFieldErrors(mapValidationErrors(result.validationErrors));
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div
              className="space-y-2 animate-fade-in-left opacity-0"
              style={{ animationDelay: '0.3s' }}
            >
              <label
                htmlFor="name"
                className="text-sm font-medium leading-none transition-colors duration-200 hover:text-primary"
              >
                Full name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Jane Doe"
                value={formData.name}
                onChange={handleChange('name')}
                required
                className="h-11 transition-all duration-300 focus:scale-105 hover:border-primary/50"
              />
              {fieldErrors.name && (
                <p className="text-xs text-destructive">{fieldErrors.name}</p>
              )}
            </div>

            <div
              className="space-y-2 animate-fade-in-left opacity-0"
              style={{ animationDelay: '0.35s' }}
            >
              <label
                htmlFor="email"
                className="text-sm font-medium leading-none transition-colors duration-200 hover:text-primary"
              >
                Work email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange('email')}
                required
                className="h-11 transition-all duration-300 focus:scale-105 hover:border-primary/50"
              />
              {fieldErrors.email && (
                <p className="text-xs text-destructive">{fieldErrors.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div
              className="space-y-2 animate-fade-in-left opacity-0"
              style={{ animationDelay: '0.4s' }}
            >
              <label
                htmlFor="password"
                className="text-sm font-medium leading-none transition-colors duration-200 hover:text-primary"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange('password')}
                required
                className="h-11 transition-all duration-300 focus:scale-105 hover:border-primary/50"
              />
              {fieldErrors.password && (
                <p className="text-xs text-destructive">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <div
              className="space-y-2 animate-fade-in-left opacity-0"
              style={{ animationDelay: '0.45s' }}
            >
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium leading-none transition-colors duration-200 hover:text-primary"
              >
                Confirm password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                required
                className="h-11 transition-all duration-300 focus:scale-105 hover:border-primary/50"
              />
              {fieldErrors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <div className="p-4 bg-muted/40 rounded-lg border animate-fade-in-up opacity-0">
            <p className="text-xs text-muted-foreground mb-2 font-medium">
              Password requirements
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Minimum 8 characters</li>
              <li>• At least one uppercase letter and one number</li>
              <li>• Use a unique password for VaultX</li>
            </ul>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-white text-black hover:bg-gray-100 border border-gray-300 transition-all duration-300 hover:scale-105 hover-glow animate-fade-in-up opacity-0"
            disabled={isLoading}
            style={{ animationDelay: '0.5s' }}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                Creating account...
              </div>
            ) : (
              'Sign up for free'
            )}
          </Button>
        </form>

        <div
          className="relative mt-6 animate-fade-in-up opacity-0"
          style={{ animationDelay: '0.6s' }}
        >
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground transition-colors duration-200 hover:text-foreground">
              Or continue with SSO
            </span>
          </div>
        </div>

        <div
          className="mt-6 animate-fade-in-up opacity-0"
          style={{ animationDelay: '0.7s' }}
        >
          <SSOButtons />
        </div>
      </CardContent>
    </Card>
  );
}
