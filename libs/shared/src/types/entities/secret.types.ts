export interface Secret {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'file';
  status: 'Active' | 'Expired';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
  isViewed: boolean;
  viewCount: number;
  lastViewedAt: string | null;
  createdBy: string;
  isProtected: boolean;
  maxViews: number | null;
  allowedIPs: string[];
  metadata: Record<string, unknown>;
  // Legacy fields for backward compatibility
  url?: string;
  viewedAt?: string;
}

export interface CreateSecretRequest {
  title: string;
  content: string;
  type?: 'text' | 'file';
  expiresAt?: string | null;
  tags?: string[];
  isProtected?: boolean;
  maxViews?: number | null;
  allowedIPs?: string[];
  metadata?: Record<string, unknown>;
}

export interface UpdateSecretRequest {
  title?: string;
  content?: string;
  type?: 'text' | 'file';
  status?: 'Active' | 'Expired';
  tags?: string[];
  expiresAt?: string | null;
  isProtected?: boolean;
  maxViews?: number | null;
  allowedIPs?: string[];
  metadata?: Record<string, unknown>;
}

export interface SecretsState {
  secrets: Secret[];
  isLoading: boolean;
  error: string | null;
}
