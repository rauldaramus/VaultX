/**
 * @file: secret.types.ts
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
