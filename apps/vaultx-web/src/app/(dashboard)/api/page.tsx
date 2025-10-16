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

import { ExternalLink } from 'lucide-react';

import { ApiTokens } from '@/features/api-management/components/api-tokens';
import { ApiUsage } from '@/features/api-management/components/api-usage';
import { Button } from '@/shared/components/ui/button';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/shared/components/ui/tabs';

export default function ApiPage() {
  return (
    <div className="space-y-8 animate-fade-in-up opacity-0">
      <div
        className="flex items-center justify-between animate-fade-in-up opacity-0"
        style={{ animationDelay: '0.1s' }}
      >
        <div>
          <h1 className="text-3xl font-bold transition-colors duration-300 hover:text-primary">
            API
          </h1>
          <p className="text-muted-foreground transition-colors duration-200 hover:text-foreground">
            Manage your API tokens and access documentation.
          </p>
        </div>
        <Button className="bg-white text-black border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm transition-all duration-300 hover:scale-105 hover-glow font-medium flex items-center gap-2">
          <ExternalLink className="h-4 w-4" />
          API Documentation
        </Button>
      </div>

      <Tabs defaultValue="api-tokens" className="w-full">
        <TabsList
          className="grid w-full grid-cols-2 animate-fade-in-up opacity-0"
          style={{ animationDelay: '0.2s' }}
        >
          <TabsTrigger value="api-tokens">API Tokens</TabsTrigger>
          <TabsTrigger value="api-usage">API Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="api-tokens">
          <div
            className="animate-fade-in-up opacity-0"
            style={{ animationDelay: '0.3s' }}
          >
            <ApiTokens />
          </div>
        </TabsContent>

        <TabsContent value="api-usage">
          <div
            className="animate-fade-in-up opacity-0"
            style={{ animationDelay: '0.3s' }}
          >
            <ApiUsage />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
