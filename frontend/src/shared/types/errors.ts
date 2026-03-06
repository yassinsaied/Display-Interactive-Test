/**
 * Error types for API error handling
 */

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface HttpError extends ApiError {
  status: number;
  statusText: string;
  url?: string;
}

export class AppError extends Error {
  public readonly code?: string;
  public readonly status?: number;

  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
  }
}
