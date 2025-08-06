export * from './components/account-info-form';
export * from './components/change-password-form';
export * from './components/delete-account';
export * from './hooks/use-account-settings';
export * from './hooks/use-security-settings';
// Re-export user settings types from shared library
export type {
  AccountInfo,
  SecuritySettings,
  UserSettingsState,
  ActiveSession,
  LanguagePreference,
  NotificationSettings,
} from '@vaultx/shared';
