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

import { ValidationPipe, Logger, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
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

  const logger = new Logger('Bootstrap');

  try {
    logger.log('Initializing NestJS application...');

    const app = await NestFactory.create(AppModule, {
      bufferLogs: true,
      logger: logLevels,
    });

    // Simplemente usar el logger que ya tenemos, no intentar obtenerlo del app
    logger.log('Application context created successfully');

    const configService = app.get(ConfigService<AppConfig>);
    const config = configService.get<AppConfig>('config', { infer: true });

    logger.log(`Environment: ${config.app.env}`);
    logger.log(`Application: ${config.app.name}`);
    logger.verbose(`Log levels enabled: ${logLevels.join(', ')}`);

    // Security middleware
    logger.debug('Configuring security middleware...');
    app.use(helmet());
    app.use(compression());

    app.enableCors({
      origin: config.security.corsOrigins,
      credentials: true,
    });
    logger.log(
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
      logger.log('Setting up Swagger documentation...');
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

      logger.verbose(`Swagger JSON available at: /${config.swagger.path}.json`);
      logger.log(`Swagger UI configured at: /${config.swagger.path}`);
    }

    // Database connections info
    logger.verbose(`MongoDB URI: ${config.mongo.uri}`);
    logger.verbose(`Redis: ${config.redis.host}:${config.redis.port}`);

    // Start listening
    await app.listen(config.app.port, config.app.host);

    // Startup banner
    logger.log('═══════════════════════════════════════════════════');
    logger.log(
      `🚀 Server running on: http://${config.app.host}:${config.app.port}`
    );
    logger.log(`📚 API prefix: /${config.app.globalPrefix}`);
    if (config.swagger.enabled) {
      logger.log(
        `📖 Swagger docs: http://${config.app.host}:${config.app.port}/${config.swagger.path}`
      );
    }
    logger.log(
      `🏥 Health check: http://${config.app.host}:${config.app.port}/${config.app.globalPrefix}/health`
    );
    logger.log('═══════════════════════════════════════════════════');
  } catch (error) {
    logger.error('Failed to start application', error.stack);
    process.exit(1);
  }
}

bootstrap();
