import toast from 'react-hot-toast';
import type { ApiError } from '../types/auth';

/**
 * Extracts error message from API error or unknown error
 * @param error - The error object (ApiError or unknown)
 * @returns The error message string
 */
function extractErrorMessage(error: ApiError | unknown): string {
   if (error && typeof error === 'object') {
      if ('message' in error && typeof error.message === 'string') {
         return error.message;
      }
      if ('error' in error && typeof error.error === 'string') {
         return error.error;
      }
   }
   if (error instanceof Error) {
      return error.message;
   }
   return 'An unexpected error occurred';
}

/**
 * Shows an error toast notification for API errors
 * @param error - The API error or unknown error
 * @param duration - Optional duration in milliseconds (default: 5000)
 */
export function showApiError(error: ApiError | unknown, duration: number = 5000): void {
   const message = extractErrorMessage(error);
   toast.error(message, {
      duration,
      position: 'top-right',
      style: {
         background: '#fee2e2',
         color: '#991b1b',
         border: '1px solid #fca5a5',
         borderRadius: '8px',
         padding: '12px 16px',
         fontSize: '14px',
         fontWeight: '500',
      },
   });
}

/**
 * Shows a success toast notification
 * @param message - The success message
 * @param duration - Optional duration in milliseconds (default: 3000)
 */
export function showSuccess(message: string, duration: number = 3000): void {
   toast.success(message, {
      duration,
      position: 'top-right',
      style: {
         background: '#dcfce7',
         color: '#166534',
         border: '1px solid #86efac',
         borderRadius: '8px',
         padding: '12px 16px',
         fontSize: '14px',
         fontWeight: '500',
      },
   });
}

