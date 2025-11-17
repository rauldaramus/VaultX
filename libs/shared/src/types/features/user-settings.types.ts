/**
 * @file: user-settings.types.ts
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

// Consolidated types for User Settings (Account + Security)

// Account Settings Types
export interface AccountInfo {
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  joinedAt: string;
  emailVerified: boolean;
  plan: {
    name: string;
    features: string[];
  };
}

export interface LanguagePreference {
  language: string; // e.g., 'es', 'en'
}

export interface NotificationSettings {
  emailNotificationsEnabled: boolean;
  // ... other notification configurations
  // ... other notification settings
}

// Security Settings Types
export interface SecuritySettings {
  enableScreenshotProtection: boolean;
  isTwoFactorEnabled: boolean;
  passwordLastChanged: string;
  loginNotifications: boolean;
  securityAlerts: boolean;
  allowedIPs: string[];
  sessionTimeout: number;
  requirePasswordFor: {
    viewSecrets: boolean;
    editProfile: boolean;
    deleteAccount: boolean;
  };
}

import type { ActiveSession } from './auth.types.js';

// Combined User Settings State
export interface UserSettingsState {
  accountInfo: AccountInfo;
  securitySettings: SecuritySettings;
  activeSessions: ActiveSession[];
  isLoading: boolean;
  error: string | null;
}
