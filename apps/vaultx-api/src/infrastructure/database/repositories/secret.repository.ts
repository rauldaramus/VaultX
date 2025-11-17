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

import { CryptoService } from '../../../common/crypto/crypto.service';
import { Secret } from '../../../schemas/secret.schema';

interface SecretEncryptionOptions {
  passphrase?: string;
}

interface SecretWriteResult {
  secret: Secret;
  passphrase?: string;
}

@Injectable()
export class SecretRepository {
  constructor(
    @InjectModel(Secret.name)
    private readonly secretModel: Model<Secret>,
    private readonly cryptoService: CryptoService
  ) {}

  async create(
    payload: Partial<Secret>,
    options?: SecretEncryptionOptions
  ): Promise<SecretWriteResult> {
    const { data, passphrase } = await this.prepareEncryptedPayload(
      payload,
      options
    );
    const document = new this.secretModel(data);
    const secret = await document.save();
    return { secret, passphrase };
  }

  findById(id: string) {
    return this.secretModel.findById(id).exec();
  }

  async list(): Promise<Secret[]> {
    return this.secretModel.find().lean().exec();
  }

  async upsertById(
    id: string,
    payload: Partial<Secret>,
    options?: SecretEncryptionOptions
  ): Promise<SecretWriteResult> {
    const { data, passphrase } = await this.prepareEncryptedPayload(
      payload,
      options
    );

    const secret = await this.secretModel
      .findByIdAndUpdate(id, data, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      })
      .exec();

    if (!secret) {
      throw new Error(`Secret with id ${id} could not be created or updated.`);
    }

    return { secret, passphrase };
  }

  async count(): Promise<number> {
    return this.secretModel.estimatedDocumentCount().exec();
  }

  private async prepareEncryptedPayload(
    payload: Partial<Secret>,
    options?: SecretEncryptionOptions
  ): Promise<{ data: Partial<Secret>; passphrase?: string }> {
    if (payload.envelope) {
      return { data: payload };
    }

    if (!payload.content) {
      throw new Error(
        'Plaintext content is required when no envelope is provided.'
      );
    }

    const { envelope, passphrase } = await this.cryptoService.encrypt(
      payload.content,
      options?.passphrase
    );

    return {
      data: {
        ...payload,
        content: envelope.ciphertext,
        envelope,
      },
      passphrase,
    };
  }
}
