/**
 * Token storage utility functions
 * Stores access token in sessionStorage for API authentication
 */

const TOKEN_KEY = 'accessToken';

/**
 * Stores the access token
 * @param token - The access token to store
 */
export function setAccessToken(token: string): void {
   sessionStorage.setItem(TOKEN_KEY, token);
}

/**
 * Gets the access token
 * @returns The access token or null if not found
 */
export function getAccessToken(): string | null {
   return sessionStorage.getItem(TOKEN_KEY);
}

/**
 * Removes the access token
 */
export function removeAccessToken(): void {
   sessionStorage.removeItem(TOKEN_KEY);
}

