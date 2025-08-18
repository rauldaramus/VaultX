export type UserRole = 'admin' | 'user';

export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  avatar?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
  };
}

export interface UserCreateRequest {
  email: string;
  name: string;
  password: string;
  role?: UserRole;
}

export interface UserUpdateRequest {
  name?: string;
  email?: string;
  role?: UserRole;
}
