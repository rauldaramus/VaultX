/**
 * @file: user.repository.ts
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
  User,
  UserDocument,
  UserPreferences,
} from '../../../schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>
  ) {}

  async create(payload: Partial<User>): Promise<UserDocument> {
    const document = new this.userModel(payload);
    return document.save();
  }

  async upsertById(
    id: string,
    payload: Partial<User>
  ): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(id, payload, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      })
      .exec();
  }

  findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async count(): Promise<number> {
    return this.userModel.estimatedDocumentCount().exec();
  }

  async updatePreferences(
    id: string,
    preferences: Partial<UserPreferences>
  ): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(
        id,
        { $set: this.buildPreferencesUpdate(preferences) },
        { new: true }
      )
      .exec();
  }

  async updatePassword(
    id: string,
    password: string
  ): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(id, { password, updatedAt: new Date() }, { new: true })
      .exec();
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(id, { lastLoginAt: new Date() })
      .exec();
  }

  private buildPreferencesUpdate(
    preferences: Partial<UserPreferences>
  ): Record<string, unknown> {
    const payload: Record<string, unknown> = {};
    if (preferences.theme) {
      payload['preferences.theme'] = preferences.theme;
    }
    if (preferences.language) {
      payload['preferences.language'] = preferences.language;
    }
    if (preferences.timezone) {
      payload['preferences.timezone'] = preferences.timezone;
    }
    if (preferences.notifications) {
      Object.entries(preferences.notifications).forEach(([key, value]) => {
        payload[`preferences.notifications.${key}`] = value;
      });
    }
    if (typeof preferences.twoFactorEnabled === 'boolean') {
      payload['preferences.twoFactorEnabled'] = preferences.twoFactorEnabled;
      payload.twoFactorEnabled = preferences.twoFactorEnabled;
    }
    return payload;
  }
}
