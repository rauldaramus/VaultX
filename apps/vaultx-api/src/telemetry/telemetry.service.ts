/**
 * @file: telemetry.service.ts
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

import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PrometheusExporter,
  PrometheusExporterOptions,
} from '@opentelemetry/exporter-prometheus';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { IORedisInstrumentation } from '@opentelemetry/instrumentation-ioredis';
import { MongooseInstrumentation } from '@opentelemetry/instrumentation-mongoose';
import { Resource } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

import { createLogger } from '../common/utils/logger.util';
import type { AppConfig } from '../config';

@Injectable()
export class TelemetryService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = createLogger(TelemetryService.name);
  private sdk: NodeSDK | null = null;

  constructor(private readonly configService: ConfigService<AppConfig>) {}

  async onModuleInit() {
    const config = this.configService.get<AppConfig>('config', { infer: true });

    if (!config.telemetry.enabled) {
      this.logger.warn(
        'OpenTelemetry instrumentation disabled by configuration'
      );
      return;
    }

    const prometheusOptions: PrometheusExporterOptions = {
      port: config.telemetry.metricsPort,
      endpoint: '/metrics',
    };

    const exporter = new PrometheusExporter(prometheusOptions, () => {
      this.logger.info(
        `Prometheus exporter started on port ${config.telemetry.metricsPort} at /metrics`
      );
    });

    this.sdk = new NodeSDK({
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: config.telemetry.serviceName,
        [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: config.app.env,
      }),
      metricReader: exporter,
      instrumentations: [
        new HttpInstrumentation(),
        new MongooseInstrumentation(),
        new IORedisInstrumentation(),
      ],
    });

    await this.sdk.start();
    this.logger.info('OpenTelemetry instrumentation initialised');
  }

  async onModuleDestroy() {
    if (this.sdk) {
      await this.sdk.shutdown();
      this.logger.info('OpenTelemetry instrumentation shut down');
    }
  }
}
