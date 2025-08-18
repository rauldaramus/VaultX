'use client';

import type { LoginCredentials } from '@vaultx/shared';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';

import { useAuth } from '../hooks/useAuth';

import { SSOButtons } from './SSOButtons';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Separator } from '@/shared/components/ui/separator';

export function LoginForm() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await login(credentials);

    if (result.success) {
      router.push('/create');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const handleInputChange =
    (field: keyof LoginCredentials) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCredentials(prev => ({
        ...prev,
        [field]: e.target.value,
      }));
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

          <div
            className="space-y-2 animate-fade-in-left opacity-0"
            style={{ animationDelay: '0.3s' }}
          >
            <label
              htmlFor="email"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-colors duration-200 hover:text-primary"
            >
              Email address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={handleInputChange('email')}
              required
              className="h-11 transition-all duration-300 focus:scale-105 hover:border-primary/50"
            />
          </div>

          <div
            className="space-y-2 animate-fade-in-left opacity-0"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-colors duration-200 hover:text-primary"
              >
                Password
              </label>
              <a
                href="#"
                className="text-sm text-primary hover:underline transition-all duration-200 hover:scale-105"
              >
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleInputChange('password')}
              required
              className="h-11 transition-all duration-300 focus:scale-105 hover:border-primary/50"
            />
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
                Signing in...
              </div>
            ) : (
              'Sign in'
            )}
          </Button>

          <div
            className="mt-4 p-3 bg-muted/50 rounded-md border transition-all duration-300 hover:bg-muted/70 hover:border-primary/30 animate-fade-in-up opacity-0"
            style={{ animationDelay: '0.6s' }}
          >
            <p className="text-xs text-muted-foreground mb-2 font-medium transition-colors duration-200 hover:text-foreground">
              Demo credentials:
            </p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p className="transition-colors duration-200 hover:text-foreground">
                <span className="font-mono bg-background px-2 py-1 rounded transition-all duration-200 hover:bg-primary/10">
                  test@example.com
                </span>
              </p>
              <p className="transition-colors duration-200 hover:text-foreground">
                <span className="font-mono bg-background px-2 py-1 rounded transition-all duration-200 hover:bg-primary/10">
                  password123
                </span>
              </p>
            </div>
          </div>
        </form>

        <div
          className="relative mt-6 animate-fade-in-up opacity-0"
          style={{ animationDelay: '0.7s' }}
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
          style={{ animationDelay: '0.8s' }}
        >
          <SSOButtons />
        </div>
      </CardContent>
    </Card>
  );
}
