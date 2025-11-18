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

import { SignUpForm } from '@/features/auth/components/SignUpForm';

export default function SignUpPage() {
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
          <div className="hidden md:flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">Already using VaultX?</span>
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-6xl grid gap-12 lg:grid-cols-[1.1fr,0.9fr] items-center">
          <section className="space-y-8 animate-fade-in-left opacity-0">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold text-primary">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Launch your secure workspace
              </span>
              <h2 className="text-4xl font-bold tracking-tight">
                Sign up for VaultX and unlock zero-trust secrets management in
                minutes.
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl">
                Unlimited audit history, SOC 2 ready controls, and collaborative
                workflows built for high-performing platform teams.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: 'Unlimited secrets',
                  description: 'Store API keys, certificates, and configs',
                },
                {
                  title: 'Granular access',
                  description: 'Role-based walls synced with your IdP',
                },
                {
                  title: 'Real-time auditing',
                  description: 'Full traceability for compliance needs',
                },
                {
                  title: 'Enterprise-ready',
                  description: 'SAML, SCIM, and on-prem agents included',
                },
              ].map(feature => (
                <div
                  key={feature.title}
                  className="p-4 rounded-xl border border-border/60 bg-card/40 backdrop-blur hover:border-primary/40 hover:translate-y-[-2px] transition-all duration-300"
                >
                  <p className="font-semibold mb-1">{feature.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 sm:grid-cols-3 p-4 border rounded-2xl bg-muted/40">
              <div>
                <p className="text-3xl font-bold">15 min</p>
                <p className="text-xs text-muted-foreground">
                  Average onboarding
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold">SOC 2</p>
                <p className="text-xs text-muted-foreground">
                  Compliance ready
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold">24/7</p>
                <p className="text-xs text-muted-foreground">SRE support</p>
              </div>
            </div>
          </section>

          <div>
            <div className="text-center mb-8 animate-fade-in-up opacity-0">
              <h3 className="text-3xl font-bold mb-2">Create your account</h3>
              <p className="text-muted-foreground">
                Start with the free tier. Upgrade seamlessly when you need to.
              </p>
            </div>

            <SignUpForm />

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>
                By signing up you agree to our{' '}
                <Link
                  href="/legal/terms"
                  className="text-primary hover:underline"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/legal/privacy"
                  className="text-primary hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
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
