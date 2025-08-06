export const AUTH_CONSTANTS = {
  TOKEN_KEY: 'vaultx_token',
  USER_KEY: 'vaultx_user',
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
} as const;

export enum AuthStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
  ERROR = 'error',
}
