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
