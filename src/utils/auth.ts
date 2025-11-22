/**
 * Checks if user is authenticated by verifying if a token exists
 * Since we're using HttpOnly cookies, we check if there's a stored auth flag
 * or we can verify with the server
 */
export function isAuthenticated(): boolean {
   // Check if there's an auth flag in sessionStorage
   // This is set after successful login
   return sessionStorage.getItem('isAuthenticated') === 'true';
}

/**
 * Sets the authentication status
 * @param authenticated - Whether the user is authenticated
 */
export function setAuthenticated(authenticated: boolean): void {
   if (authenticated) {
      sessionStorage.setItem('isAuthenticated', 'true');
   } else {
      sessionStorage.removeItem('isAuthenticated');
   }
}

