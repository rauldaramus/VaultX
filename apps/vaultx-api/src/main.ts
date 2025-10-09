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

import { ValidationPipe, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet, { HelmetOptions } from 'helmet';
import pino from 'pino';
import 'reflect-metadata';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import type { AppConfig } from './config';

async function bootstrap() {
  // Configurar niveles de log según entorno
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const logLevels: LogLevel[] = isDevelopment
    ? ['log', 'debug', 'error', 'warn', 'verbose']
    : ['log', 'error', 'warn'];
  const logLevel = isDevelopment ? 'debug' : 'info';
  const logger = pino({
    name: 'Bootstrap',
    level: logLevel,
    ...(isDevelopment
      ? {
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
              ignore: 'pid,hostname',
            },
          },
        }
      : {}),
  });

  try {
    logger.info('Initializing NestJS application...');

    const app = await NestFactory.create(AppModule, {
      bufferLogs: true,
      logger: logLevels,
    });

    // Simplemente usar el logger que ya tenemos, no intentar obtenerlo del app
    logger.info('Application context created successfully');

    const configService = app.get(ConfigService<AppConfig>);
    const config = configService.get<AppConfig>('config', { infer: true });

    logger.info(`Environment: ${config.app.env}`);
    logger.info(`Application: ${config.app.name}`);
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
    logger.info(
      `CORS enabled for origins: ${config.security.corsOrigins.join(', ')}`
    );

    // Global prefix
    app.setGlobalPrefix(config.app.globalPrefix);
    logger.debug(`Global prefix set to: /${config.app.globalPrefix}`);

    // Validation pipe
    logger.debug('Configuring global validation pipe...');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
      })
    );

    // Filters and interceptors
    logger.debug('Configuring global filters and interceptors...');
    app.useGlobalFilters(new HttpExceptionFilter(), new AllExceptionsFilter());
    app.useGlobalInterceptors(new TransformInterceptor());

    // Swagger documentation
    if (config.swagger.enabled) {
      logger.info('Setting up Swagger documentation...');
      const swaggerConfig = new DocumentBuilder()
        .setTitle(config.swagger.title)
        .setDescription(config.swagger.description)
        .setVersion(config.swagger.version)
        .addTag('health', 'Service health endpoints')
        .build();

      const document = SwaggerModule.createDocument(app, swaggerConfig);
      SwaggerModule.setup(config.swagger.path, app, document, {
        jsonDocumentUrl: `${config.swagger.path}.json`,
      });

      logger.debug(`Swagger JSON available at: /${config.swagger.path}.json`);
      logger.info(`Swagger UI configured at: /${config.swagger.path}`);
    }

    // Database connections info
    logger.debug(`MongoDB URI: ${config.mongo.uri}`);
    logger.debug(`Redis: ${config.redis.host}:${config.redis.port}`);

    // Start listening
    await app.listen(config.app.port, config.app.host);

    // Startup banner
    logger.info('═══════════════════════════════════════════════════');
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
