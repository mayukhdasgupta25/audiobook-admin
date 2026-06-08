import type { ApiError, CsrfTokenResponse } from '../types/auth';
import { getAuthApiBaseUrl, handleApiError } from './config';

let csrfToken: string | null = null;
let csrfPromise: Promise<string> | null = null;

/**
 * Fetches a CSRF token from the auth API and caches it in memory.
 */
export async function fetchCsrfToken(): Promise<string> {
   try {
      const response = await fetch(`${getAuthApiBaseUrl()}/auth/csrf-token`, {
         method: 'GET',
         credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
         const error: ApiError = {
            message: data.message || data.error || 'Failed to fetch CSRF token',
            error: data.error,
            statusCode: response.status,
         };
         throw error;
      }

      const csrfResponse = data as CsrfTokenResponse;
      csrfToken = csrfResponse.csrfToken;
      return csrfToken;
   } catch (error) {
      throw handleApiError(error);
   }
}

/**
 * Returns a cached CSRF token or fetches one, deduplicating concurrent requests.
 */
export async function ensureCsrfToken(): Promise<string> {
   if (csrfToken) {
      return csrfToken;
   }

   if (!csrfPromise) {
      csrfPromise = fetchCsrfToken().finally(() => {
         csrfPromise = null;
      });
   }

   return csrfPromise;
}

/**
 * Returns headers required for cookie-authenticated mutating auth requests.
 */
export async function getCsrfHeaders(): Promise<HeadersInit> {
   const token = await ensureCsrfToken();
   return {
      'X-CSRF-Token': token,
   };
}

/**
 * Clears the in-memory CSRF token cache.
 */
export function clearCsrfToken(): void {
   csrfToken = null;
   csrfPromise = null;
}
