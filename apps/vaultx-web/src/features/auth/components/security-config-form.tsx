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
              Your current browser doesn't support screenshot protection. For
              better security, consider using Chrome or Edge.
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
