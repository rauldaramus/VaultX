import { AccountInfoForm } from '@/features/user-settings/components/account-info-form';
import { ChangePasswordForm } from '@/features/user-settings/components/change-password-form';
import { DeleteAccount } from '@/features/user-settings/components/delete-account';

export default function SettingsPage() {
  return (
    <div className="space-y-8 animate-fade-in-up opacity-0">
      <div
        className="animate-fade-in-up opacity-0"
        style={{ animationDelay: '0.1s' }}
      >
        <h1 className="text-3xl font-bold transition-colors duration-300 hover:text-primary">
          Settings
        </h1>
        <p className="text-muted-foreground transition-colors duration-200 hover:text-foreground">
          Manage your preferences and account settings.
        </p>
      </div>

      <div className="space-y-8">
        <div
          className="grid gap-8 md:grid-cols-2 animate-fade-in-up opacity-0"
          style={{ animationDelay: '0.2s' }}
        >
          <AccountInfoForm />
          <ChangePasswordForm />
        </div>
        <div
          className="animate-fade-in-up opacity-0"
          style={{ animationDelay: '0.3s' }}
        >
          <DeleteAccount />
        </div>
      </div>
    </div>
  );
}
