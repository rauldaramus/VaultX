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

import { ActiveSession } from './auth.types';

// Combined User Settings State
export interface UserSettingsState {
  accountInfo: AccountInfo;
  securitySettings: SecuritySettings;
  activeSessions: ActiveSession[];
  isLoading: boolean;
  error: string | null;
}
