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

import Link from 'next/link';

import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold">VaultX</h1>
          </div>
          <Link href="/login" className="text-sm text-primary hover:underline">
            Back to login
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-5xl grid gap-10 lg:grid-cols-2 items-center">
          <section className="space-y-6 animate-fade-in-left opacity-0">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold text-primary">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Secure recovery flow
              </span>
              <h2 className="text-4xl font-bold tracking-tight">
                Reset your access securely.
              </h2>
              <p className="text-lg text-muted-foreground max-w-lg">
                VaultX uses signed, single-use reset links. Provide your email
                and we&apos;ll send the secure instructions instantly.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: 'Single-use links',
                  description:
                    'Each reset link expires after one use or after 15 minutes.',
                },
                {
                  title: 'Device fingerprinting',
                  description:
                    'We detect unusual activity and ask for additional verification.',
                },
                {
                  title: '24/7 support',
                  description:
                    'Our on-call SREs can help you regain access in critical incidents.',
                },
              ].map(feature => (
                <div
                  key={feature.title}
                  className="p-4 rounded-xl border border-border/60 bg-card/40 backdrop-blur hover:border-primary/40 transition-all duration-300"
                >
                  <p className="font-semibold mb-1">{feature.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-sm text-muted-foreground">
              Need immediate assistance?{' '}
              <Link href="/contact" className="text-primary hover:underline">
                Contact the incident desk
              </Link>
              .
            </div>
          </section>

          <div>
            <div className="text-center mb-8 animate-fade-in-up opacity-0">
              <h3 className="text-3xl font-bold mb-2">Forgot password</h3>
              <p className="text-muted-foreground">
                Enter the email associated with your workspace and follow the
                secure recovery steps.
              </p>
            </div>

            <ForgotPasswordForm />
          </div>
        </div>
      </main>

      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between text-sm text-muted-foreground">
          <p>© 2025 VaultX. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/legal/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/legal/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-foreground">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
