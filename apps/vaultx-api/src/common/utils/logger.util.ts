/**
 * @file: logger.util.ts
 * @version: 0.0.0
 * @author: Raul Daramus
 * @date: 2025
 * Copyright (C) 2025 VaultX
 *
 * Helper util to create consistent Pino loggers across the application.
 */

import type { LoggerOptions } from 'pino';
import pino from 'pino';

const isDevelopment = process.env.NODE_ENV !== 'production';

const baseOptions: LoggerOptions = {
  level: isDevelopment ? 'debug' : 'info',
  base: {
    env: process.env.NODE_ENV ?? 'development',
  },
};

if (isDevelopment) {
  baseOptions.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  };
}

export const createLogger = (name: string) =>
  pino({
    ...baseOptions,
    name,
  });
