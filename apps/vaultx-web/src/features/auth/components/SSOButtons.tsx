/**
 * @file: SSOButtons.tsx
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

import { Button } from '@/shared/components/ui/button';

const ssoProviders = [
  {
    name: 'GitHub',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    className: 'bg-[#24292e] hover:bg-[#1a1e22] text-white border-[#24292e]',
  },
  {
    name: 'Microsoft',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" />
      </svg>
    ),
    className: 'bg-[#0078d4] hover:bg-[#106ebe] text-white border-[#0078d4]',
  },
  {
    name: 'GitLab',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.955 13.587l-1.342-4.135-2.664-8.189c-.135-.423-.73-.423-.867 0L16.418 9.45H7.582L4.919 1.263c-.135-.423-.73-.423-.867 0L1.388 9.452L.046 13.587c-.121.375.014.789.331 1.023L12 23.054l11.623-8.443c.318-.235.453-.648.332-1.024" />
      </svg>
    ),
    className: 'bg-[#fc6d26] hover:bg-[#e24329] text-white border-[#fc6d26]',
  },
  {
    name: 'Atlassian',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7.07 11.425c-.165-.345-.165-.735 0-1.08L11.42 2.08c.33-.69 1.35-.69 1.68 0l4.35 8.265c.165.345.165.735 0 1.08l-4.35 8.265c-.33.69-1.35.69-1.68 0l-4.35-8.265z" />
        <path d="M2.235 17.235c-.33-.69.075-1.485.855-1.68l6.93-1.73c.39-.098.795.098.99.465l1.95 3.705c.33.69-.075 1.485-.855 1.68l-6.93 1.73c-.39.098-.795-.098-.99-.465l-1.95-3.705z" />
      </svg>
    ),
    className: 'bg-[#0052cc] hover:bg-[#0747a6] text-white border-[#0052cc]',
  },
];

export function SSOButtons() {
  const handleSSOLogin = (provider: string) => {
    // Here you would implement the SSO logic for each provider
    // eslint-disable-next-line no-console
    console.log(`Initiating SSO login with ${provider}`);
    // For example: window.location.href = `/auth/${provider.toLowerCase()}`
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {ssoProviders.map(provider => (
          <Button
            key={provider.name}
            variant="outline"
            className={`h-11 ${provider.className}`}
            onClick={() => handleSSOLogin(provider.name)}
          >
            <div className="flex items-center gap-2">
              {provider.icon}
              <span className="font-medium">{provider.name}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
