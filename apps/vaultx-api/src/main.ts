/**
 * @file: main.ts
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

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { LogLevel, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import type { OpenAPIObject } from '@nestjs/swagger';
import compression from 'compression';
import helmet, { HelmetOptions } from 'helmet';
import { parse } from 'yaml';
import 'reflect-metadata';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { createLogger } from './common/utils/logger.util';
import type { AppConfig } from './config';

const STARTUP_BANNER = [
  '██╗░░░██╗░█████╗░██╗░░░██╗██╗░░░░░████████╗██╗░░██╗',
  '██║░░░██║██╔══██╗██║░░░██║██║░░░░░╚══██╔══╝╚██╗██╔╝',
  '╚██╗░██╔╝███████║██║░░░██║██║░░░░░░░░██║░░░░╚███╔╝░',
  '░╚████╔╝░██╔══██║██║░░░██║██║░░░░░░░░██║░░░░██╔██╗░',
  '░░╚██╔╝░░██║░░██║╚██████╔╝███████╗░░░██║░░░██╔╝╚██╗',
  '░░░╚═╝░░░╚═╝░░╚═╝░╚═════╝░╚══════╝░░░╚═╝░░░╚═╝░░╚═╝',
  'Copyright (C) 2025 VaultX by Raul Daramus',
  'API',
].join('\n');

async function bootstrap() {
  // Configurar niveles de log según entorno
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const logLevels: LogLevel[] = isDevelopment
    ? ['log', 'debug', 'error', 'warn', 'verbose']
    : ['log', 'error', 'warn'];
  const logger = createLogger('Bootstrap');

  try {
    console.log(`\n${STARTUP_BANNER}`);

    const app = await NestFactory.create(AppModule, {
      bufferLogs: true,
      logger: logLevels,
    });

    const configService = app.get(ConfigService<AppConfig>);
    const config = configService.get<AppConfig>('config', { infer: true });

    logger.info(`Environment: ${config.app.env}`);
    logger.debug(`Log levels enabled: ${logLevels.join(', ')}`);

    // Security middleware
    logger.debug('Configuring security middleware...');
    const helmetOptions: HelmetOptions = {
      contentSecurityPolicy:
        config.app.env === 'production'
          ? {
              directives: {
                ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                'img-src': ["'self'", 'data:', 'https://validator.swagger.io'],
                'script-src': ["'self'", "'unsafe-inline'", 'https:'],
                'style-src': ["'self'", "'unsafe-inline'", 'https:'],
              },
            }
          : false,
      crossOriginEmbedderPolicy: false,
    };

    app.use(helmet(helmetOptions));
    app.use(compression());

    app.enableCors({
      origin: config.security.corsOrigins,
      credentials: true,
    });
    logger.debug(
      `CORS enabled for origins: ${config.security.corsOrigins.join(', ')}`
    );

    // Global prefix
    app.setGlobalPrefix(config.app.globalPrefix);
    logger.debug(`Global prefix set to: /${config.app.globalPrefix}`);

    // Validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
      })
    );

    // Filters and interceptors
    app.useGlobalFilters(new HttpExceptionFilter(), new AllExceptionsFilter());
    app.useGlobalInterceptors(new TransformInterceptor());

    // Swagger documentation
    if (config.swagger.enabled) {
      const specPath = resolve(process.cwd(), config.swagger.specPath);
      logger.debug(`Loading OpenAPI spec from: ${specPath}`);

      let document: OpenAPIObject;
      if (existsSync(specPath)) {
        const fileContents = readFileSync(specPath, 'utf8');
        document = parse(fileContents) as OpenAPIObject;
      } else {
        logger.warn(
          `OpenAPI spec not found at ${specPath}. Falling back to minimal document.`
        );
        document = {
          openapi: '3.1.0',
          info: {
            title: config.swagger.title,
            description: config.swagger.description,
            version: config.swagger.version,
          },
          paths: {},
        } as OpenAPIObject;
      }

      SwaggerModule.setup(config.swagger.path, app, document, {
        jsonDocumentUrl: `${config.swagger.path}.json`,
      });
    }

    // Database connections info
    logger.debug(`MongoDB URI: ${config.mongo.uri}`);
    logger.debug(`Redis: ${config.redis.host}:${config.redis.port}`);

    // Start listening
    await app.listen(config.app.port, config.app.host);

    logger.info(
      `🚀 Server running on: http://${config.app.host}:${config.app.port}`
    );
    logger.info(`📚 API prefix: /${config.app.globalPrefix}`);
    if (config.swagger.enabled) {
      logger.info(
        `📖 Swagger docs: http://${config.app.host}:${config.app.port}/${config.swagger.path}`
      );
    }
    logger.info(
      `🏥 Health check: http://${config.app.host}:${config.app.port}/${config.app.globalPrefix}/health`
    );
    logger.info('═══════════════════════════════════════════════════');
  } catch (error) {
    logger.error(
      { err: error instanceof Error ? error : new Error('Unknown error') },
      'Failed to start application'
    );
    process.exit(1);
  }
}

bootstrap();
