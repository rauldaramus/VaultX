/**
 * @file: security-config-form.tsx
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

import { Terminal } from 'lucide-react';

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/shared/components/ui/alert';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Switch } from '@/shared/components/ui/switch';

export function SecurityConfigForm() {
  return (
    <div className="space-y-6 mt-4">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle>Security Configuration</CardTitle>
          <CardDescription>
            Configure additional security options for your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
            <div>
              <h3 className="font-medium">Screenshot Protection</h3>
              <p className="text-sm text-gray-400">
                Block screenshots when viewing secrets
              </p>
            </div>
            <Switch id="screenshot-protection" />
          </div>
          <Alert
            variant="destructive"
            className="bg-yellow-900/20 border-yellow-500/30 text-yellow-300"
          >
            <Terminal className="h-4 w-4 !text-yellow-300" />
            <AlertTitle>Unsupported Feature</AlertTitle>
            <AlertDescription>
              Your current browser doesn&apos;t support screenshot protection.
              For better security, consider using Chrome or Edge.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an additional layer of security to your account with two-factor
            authentication.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
            <p className="text-sm text-gray-400">2FA not activated</p>
            <Button>Activate</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
