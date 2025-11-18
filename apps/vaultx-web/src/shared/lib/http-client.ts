/**
 * @file: http-client.ts
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

import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from 'axios';
import type { ApiResponse } from '@vaultx/shared';

import { APP_CONFIG } from '@/shared/config';

const sanitizeBaseUrl = (url: string) => url.replace(/\/+$/, '');

export const apiClient: AxiosInstance = axios.create({
  baseURL: sanitizeBaseUrl(APP_CONFIG.api.baseUrl),
  timeout: APP_CONFIG.api.timeout,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

const unwrapResponse = <T>(payload: unknown): ApiResponse<T> => {
  if (payload && typeof payload === 'object') {
    const maybe = payload as Record<string, unknown>;
    if (
      maybe.data &&
      typeof maybe.data === 'object' &&
      'success' in (maybe.data as Record<string, unknown>)
    ) {
      return maybe.data as ApiResponse<T>;
    }
    if ('success' in maybe) {
      return maybe as ApiResponse<T>;
    }
  }

  return {
    success: false,
    statusCode: 500,
    error: 'Unexpected API response',
  };
};

const normalizeMessage = (value: unknown): string | undefined => {
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  if (typeof value === 'string') {
    return value;
  }
  return undefined;
};

const mapAxiosError = <T>(error: unknown): ApiResponse<T> => {
  if (axios.isAxiosError(error)) {
    const typedError = error as AxiosError<unknown>;
    const responseData = typedError.response?.data;

    if (responseData && typeof responseData === 'object') {
      const maybeResponse = responseData as Record<string, unknown>;

      if (
        maybeResponse.data &&
        typeof maybeResponse.data === 'object' &&
        'success' in (maybeResponse.data as Record<string, unknown>)
      ) {
        return maybeResponse.data as ApiResponse<T>;
      }

      if ('success' in maybeResponse) {
        return maybeResponse as ApiResponse<T>;
      }

      if ('statusCode' in maybeResponse && 'message' in maybeResponse) {
        return {
          success: false,
          statusCode:
            (maybeResponse.statusCode as number | undefined) ??
            typedError.response?.status ??
            500,
          error:
            normalizeMessage(maybeResponse.message) ??
            typedError.message ??
            'Request failed',
        };
      }
    }

    return {
      success: false,
      statusCode: typedError.response?.status ?? 500,
      error: typedError.message || 'Request failed',
    };
  }

  return {
    success: false,
    statusCode: 500,
    error: 'Unexpected error',
  };
};

export const apiRequest = async <T>(
  config: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response = await apiClient.request<ApiResponse<T>>(config);
    return unwrapResponse<T>(response.data);
  } catch (error) {
    return mapAxiosError<T>(error);
  }
};
