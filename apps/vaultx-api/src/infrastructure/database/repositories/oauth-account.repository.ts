/**
 * @file: oauth-account.repository.ts
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

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { OAuthProvider } from '@vaultx/shared';
import type { Model } from 'mongoose';

import {
  OAuthAccount,
  OAuthAccountDocument,
} from '../../../schemas/oauth-account.schema';

@Injectable()
export class OAuthAccountRepository {
  constructor(
    @InjectModel(OAuthAccount.name)
    private readonly oauthModel: Model<OAuthAccount>
  ) {}

  linkAccount(payload: Partial<OAuthAccount>): Promise<OAuthAccountDocument> {
    const document = new this.oauthModel(payload);
    return document.save();
  }

  findByProviderAccount(
    provider: OAuthProvider,
    providerAccountId: string
  ): Promise<OAuthAccountDocument | null> {
    return this.oauthModel.findOne({ provider, providerAccountId }).exec();
  }

  findByUser(userId: string): Promise<OAuthAccountDocument[]> {
    return this.oauthModel.find({ user: userId }).exec();
  }

  unlink(id: string): Promise<OAuthAccountDocument | null> {
    return this.oauthModel.findByIdAndDelete(id).exec();
  }
}
