/**
 * @file: secret.repository.ts
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

import { Secret } from '../../../schemas/secret.schema';

@Injectable()
export class SecretRepository {
  constructor(
    @InjectModel(Secret.name)
    private readonly secretModel: Model<Secret>
  ) {}

  async create(payload: Partial<Secret>): Promise<Secret> {
    const document = new this.secretModel(payload);
    return document.save();
  }

  findById(id: string) {
    return this.secretModel.findById(id).exec();
  }

  async list(): Promise<Secret[]> {
    return this.secretModel.find().lean().exec();
  }

  async upsertById(id: string, payload: Partial<Secret>): Promise<Secret> {
    return this.secretModel
      .findByIdAndUpdate(id, payload, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      })
      .exec();
  }

  async count(): Promise<number> {
    return this.secretModel.estimatedDocumentCount().exec();
  }
}
