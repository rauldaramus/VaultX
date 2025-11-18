/**
 * @file: session.repository.ts
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
import type { Model, UpdateQuery } from 'mongoose';

import { Session, SessionDocument } from '../../../schemas/session.schema';

@Injectable()
export class SessionRepository {
  constructor(
    @InjectModel(Session.name)
    private readonly sessionModel: Model<Session>
  ) {}

  create(payload: Partial<Session>): Promise<SessionDocument> {
    const document = new this.sessionModel(payload);
    return document.save();
  }

  findById(id: string): Promise<SessionDocument | null> {
    return this.sessionModel.findById(id).exec();
  }

  findActiveByUser(userId: string): Promise<SessionDocument[]> {
    return this.sessionModel
      .find({ user: userId, isActive: true })
      .sort({ lastActiveAt: -1 })
      .exec();
  }

  findActiveByIdAndUser(
    id: string,
    userId: string
  ): Promise<SessionDocument | null> {
    return this.sessionModel
      .findOne({ _id: id, user: userId, isActive: true })
      .exec();
  }

  updateById(
    id: string,
    update: UpdateQuery<Session>
  ): Promise<SessionDocument | null> {
    return this.sessionModel
      .findByIdAndUpdate(id, update, { new: true })
      .exec();
  }

  touch(id: string): Promise<SessionDocument | null> {
    return this.updateById(id, { lastActiveAt: new Date() });
  }

  async deactivate(id: string): Promise<void> {
    await this.sessionModel
      .findByIdAndUpdate(id, { isActive: false, lastActiveAt: new Date() })
      .exec();
  }

  async deactivateUserSessions(
    userId: string,
    excludeId?: string
  ): Promise<void> {
    const query: Record<string, unknown> = { user: userId, isActive: true };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    await this.sessionModel
      .updateMany(query, { isActive: false, lastActiveAt: new Date() })
      .exec();
  }
}
