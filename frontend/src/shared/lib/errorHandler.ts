import type { AxiosError } from 'axios';
import type { ApiError, HttpError } from '@/shared/types';

/**
 * Extract a user-friendly error message from any error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (isAxiosError(error)) {
    return extractAxiosErrorMessage(error);
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred';
}

/**
 * Check if an error is a network error (no response from server)
 */
export function isNetworkError(error: unknown): boolean {
  if (isAxiosError(error)) {
    return !error.response && !!error.request;
  }
  return false;
}

/**
 * Check if the error is an Axios error
 */
export function isAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as AxiosError).isAxiosError === true
  );
}

/**
 * Convert an Axios error to a structured HttpError
 */
export function toHttpError(error: AxiosError): HttpError {
  return {
    message: extractAxiosErrorMessage(error),
    status: error.response?.status ?? 0,
    statusText: error.response?.statusText ?? 'Network Error',
    url: error.config?.url,
  };
}

/**
 * Convert any error to a structured ApiError
 */
export function toApiError(error: unknown): ApiError {
  if (isAxiosError(error)) {
    return toHttpError(error);
  }

  return {
    message: getErrorMessage(error),
    status: 0,
  };
}

/**
 * Extract an error message from an Axios error response
 */
function extractAxiosErrorMessage(error: AxiosError): string {
  const data = error.response?.data as Record<string, unknown> | undefined;

  if (data && typeof data === 'object') {
    if (typeof data.message === 'string') return data.message;
    if (typeof data['hydra:description'] === 'string') return data['hydra:description'];
    if (typeof data.detail === 'string') return data.detail;
  }

  if (error.response) {
    return `HTTP ${error.response.status}: ${error.response.statusText}`;
  }

  if (error.request) {
    return 'Network error: unable to reach the server';
  }

  return error.message || 'An unexpected error occurred';
}
