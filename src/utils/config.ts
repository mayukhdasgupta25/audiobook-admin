/**
 * Centralized API configuration utility
 * Aggregates base URLs and authorization logic for reuse across the project
 */

import { getAccessToken } from './token';

/**
 * Gets the authentication API base URL from environment variables
 * @returns The base URL for authentication API
 */
export function getAuthApiBaseUrl(): string {
   const baseUrl = import.meta.env.VITE_API_AUTH_BASE_URL;
   if (!baseUrl) {
      // Fallback to default development URL
      return 'http://localhost:8080';
   }
   return baseUrl;
}

/**
 * Gets the content API base URL from environment variables
 * @returns The base URL for content API
 */
export function getContentApiBaseUrl(): string {
   const baseUrl = import.meta.env.VITE_API_CONTENT_BASE_URL;
   if (!baseUrl) {
      // Fallback to default development URL
      return 'http://localhost:8081';
   }
   return baseUrl;
}

/**
 * Gets the app name from environment variables
 * @returns The app name
 */
export function getAppName(): string {
   const appName = import.meta.env.VITE_APP_NAME;
   return appName || 'Audiobook Admin';
}

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

