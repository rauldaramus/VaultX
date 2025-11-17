/**
 * @file: oauth-account.schema.ts
 * @version: 0.0.0
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

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { OAuthProvider } from '@vaultx/shared';
import { HydratedDocument, Types } from 'mongoose';

export type OAuthAccountDocument = HydratedDocument<OAuthAccount>;

@Schema({ collection: 'oauth_accounts', timestamps: true })
export class OAuthAccount {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user!: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['google', 'github', 'microsoft'],
    required: true,
  })
  provider!: OAuthProvider;

  @Prop({ type: String, required: true })
  providerAccountId!: string;

  @Prop({ type: [String], default: [] })
  scopes!: string[];

  @Prop({ type: Object, default: {} })
  profile?: Record<string, unknown>;

  @Prop({ type: String, default: null })
  accessToken?: string | null;

  @Prop({ type: Date, default: null })
  accessTokenExpiresAt?: Date | null;

  @Prop({ type: String, default: null })
  refreshToken?: string | null;

  @Prop({ type: Date, default: Date.now })
  linkedAt!: Date;
}

export const OAuthAccountSchema = SchemaFactory.createForClass(OAuthAccount);

OAuthAccountSchema.index(
  { provider: 1, providerAccountId: 1 },
  { unique: true }
);
