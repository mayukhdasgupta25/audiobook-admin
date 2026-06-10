/**
 * Centralized API configuration utility
 * Aggregates base URLs and authorization logic for reuse across the project
 */

import { env } from '../config/env';
import { getAccessToken } from './token';

/**
 * Gets the authentication API prefix from environment variables
 * @returns The API prefix for authentication endpoints
 */
export function getAuthApiBaseUrl(): string {
  return env.authApiPrefix;
}

/**
 * Gets the content API prefix from environment variables
 * @returns The API prefix for content endpoints
 */
export function getContentApiBaseUrl(): string {
  return env.contentApiPrefix;
}

/**
 * Gets the app name from environment variables
 * @returns The app name
 */
export function getAppName(): string {
  return env.appName;
}

/**
 * Whether this build is the partner app (vs. admin/other client types)
 */
export function isPartnerApp(): boolean {
  return env.appType === 'partner';
}

/** Public path to the Srota logo used across the UI and favicon */
export const SROTA_LOGO_PATH = '/srota_logo.svg';

/**
 * Gets authorization headers with access token
 * @returns Headers object with Authorization header if token exists
 * @throws Error if token is not found
 */
export function getAuthHeaders(): HeadersInit {
  const token = getAccessToken();
  if (!token) {
    throw {
      message: 'Access token not found. Please login again.',
      error: 'TokenNotFound',
    };
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Gets authorization headers for file uploads (without Content-Type)
 * Browser will automatically set Content-Type to multipart/form-data with boundary for FormData
 * IMPORTANT: Do NOT set Content-Type header - browser must set it automatically for FormData
 * @returns Headers object with Authorization header if token exists
 * @throws Error if token is not found
 */
export function getAuthHeadersForFileUpload(): HeadersInit {
  const token = getAccessToken();
  if (!token) {
    throw {
      message: 'Access token not found. Please login again.',
      error: 'TokenNotFound',
    };
  }

  // Return headers WITHOUT Content-Type - browser will automatically set
  // multipart/form-data with boundary when FormData is used
  return {
    Authorization: `Bearer ${token}`,
    // Do NOT include 'Content-Type' here - browser handles it for FormData
  };
}

/**
 * Handles API errors consistently
 * @param error - The error object
 * @returns Formatted API error
 */
export function handleApiError(error: unknown): {
  message: string;
  error: string;
  statusCode?: number;
} {
  if (error instanceof TypeError) {
    // Network error (e.g., CORS, connection refused)
    return {
      message: 'Network error. Please check if the server is running.',
      error: 'NetworkError',
    };
  }

  // Re-throw if it's already a formatted error
  if (error && typeof error === 'object' && 'message' in error) {
    return error as {
      message: string;
      error: string;
      statusCode?: number;
    };
  }

  return {
    message: 'An unexpected error occurred',
    error: 'UnknownError',
  };
}
