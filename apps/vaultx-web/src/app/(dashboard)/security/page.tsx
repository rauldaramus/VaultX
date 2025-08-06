'use client';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import { Switch } from '@/shared/components/ui/switch';
import { ActiveSessionsList } from '@/features/auth/components/active-sessions-list';

export default function SecurityPage() {
  return (
    <div className="space-y-8 animate-fade-in-up opacity-0">
      <div
        className="animate-fade-in-up opacity-0"
        style={{ animationDelay: '0.1s' }}
      >
        <h1 className="text-3xl font-bold transition-colors duration-300 hover:text-primary">
          Security
        </h1>
        <p className="text-muted-foreground transition-colors duration-200 hover:text-foreground">
          Manage your account security settings.
        </p>
      </div>

      <Tabs defaultValue="security-config" className="w-full">
        <TabsList
          className="grid w-full grid-cols-2 animate-fade-in-up opacity-0"
          style={{ animationDelay: '0.2s' }}
        >
          <TabsTrigger value="security-config">
            Security Configuration
          </TabsTrigger>
          <TabsTrigger value="active-sessions">Active Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="security-config" className="mt-6">
          {/* Two-Factor Authentication - Now at the top */}
          <div
            className="border rounded-lg p-6 mb-6 hover-lift animate-fade-in-up opacity-0"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">
                  Two-Factor Authentication
                </h2>
                <p className="text-sm text-muted-foreground mb-3">
                  Add an additional layer of security to your account with
                  two-factor authentication.
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-sm text-muted-foreground">
                    Currently disabled
                  </span>
                </div>
              </div>
              <div className="ml-6">
                <button className="bg-white text-black border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm transition-all duration-300 hover:scale-105 hover-glow font-medium px-6 py-2 rounded-md">
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="active-sessions" className="mt-6">
          <div
            className="border rounded-lg p-6 hover-lift animate-fade-in-up opacity-0"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Active Sessions</h2>
                <p className="text-sm text-muted-foreground">
                  Manage active sessions on your account.
                </p>
              </div>
              <ActiveSessionsList />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
