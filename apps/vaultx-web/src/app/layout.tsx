import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type React from 'react';

import './globals.css';
import { ThemeProvider } from '@/shared/components/theme-provider';
import { cn } from '@/shared/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'VaultX',
  description: 'Manage your secrets securely.',
  generator: 'v0.dev',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn('min-h-screen font-sans antialiased', inter.variable)}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
