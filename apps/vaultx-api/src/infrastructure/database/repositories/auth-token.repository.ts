/**
 * @file: auth-token.repository.ts
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
import type { Model } from 'mongoose';

import {
  AuthToken,
  AuthTokenDocument,
} from '../../../schemas/auth-token.schema';

@Injectable()
export class AuthTokenRepository {
  constructor(
    @InjectModel(AuthToken.name)
    private readonly tokenModel: Model<AuthToken>
  ) {}

  create(payload: Partial<AuthToken>): Promise<AuthTokenDocument> {
    const document = new this.tokenModel(payload);
    return document.save();
  }

  findValidByHash(hash: string): Promise<AuthTokenDocument | null> {
    return this.tokenModel
      .findOne({
        hashedToken: hash,
        revoked: false,
        expiresAt: { $gt: new Date() },
      })
      .exec();
  }

  async revokeById(id: string): Promise<void> {
    await this.tokenModel
      .findByIdAndUpdate(id, { revoked: true, revokedAt: new Date() })
      .exec();
  }

  async revokeBySession(sessionId: string): Promise<void> {
    await this.tokenModel
      .updateMany(
        { session: sessionId, revoked: false },
        { revoked: true, revokedAt: new Date() }
      )
      .exec();
  }

  async deleteExpired(): Promise<void> {
    await this.tokenModel
      .deleteMany({ expiresAt: { $lte: new Date() } })
      .exec();
  }
}
