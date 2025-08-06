// Auth feature barrel exports
export * from './hooks/useAuth';
export * from './hooks/use-active-sessions';
export * from './model/auth.store';
// Re-export auth types from shared library
export type {
  AuthState,
  LoginCredentials,
  LoginResponse,
  User,
  ActiveSession,
} from '@vaultx/shared';
export * from './components';
