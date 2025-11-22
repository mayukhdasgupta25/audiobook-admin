import type {
   LoginRequest,
   LoginResponse,
   ApiError,
   LogoutResponse,
} from '../types/auth';
import { setAccessToken, removeAccessToken } from './token';
import { getAuthApiBaseUrl, handleApiError } from './config';

/**
 * Makes a login API call to the authentication endpoint
 * @param credentials - Email and password for login
 * @returns Promise resolving to login response or throwing an error
 */
export async function login(
   credentials: LoginRequest
): Promise<LoginResponse> {
   try {
      const response = await fetch(`${getAuthApiBaseUrl()}/auth/login`, {
         method: 'POST',
         credentials: 'include',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
            clientType: credentials.clientType,
            app: "admin"
         }),
      });

      const data = await response.json();

      // Check if the response is not ok (status code >= 400)
      if (!response.ok) {
         const error: ApiError = {
            message: data.message || data.error || 'Login failed',
            error: data.error,
            statusCode: response.status,
         };
         throw error;
      }

      const loginResponse = data as LoginResponse;

      // Store accessToken if provided in response
      if (loginResponse.accessToken) {
         setAccessToken(loginResponse.accessToken);
      } else if (loginResponse.token) {
         // Fallback to token field if accessToken is not present
         setAccessToken(loginResponse.token);
      }

      return loginResponse;
   } catch (error) {
      throw handleApiError(error);
   }
}

/**
 * Makes a logout API call to the authentication endpoint
 * @returns Promise resolving to logout response or throwing an error
 */
export async function logout(): Promise<LogoutResponse> {
   try {
      const response = await fetch(`${getAuthApiBaseUrl()}/auth/logout`, {
         method: 'POST',
         credentials: 'include',
         headers: {
            'Content-Type': 'application/json',
         },
      });

      const data = await response.json();

      // Check if the response is not ok (status code >= 400)
      if (!response.ok) {
         const error: ApiError = {
            message: data.message || data.error || 'Logout failed',
            error: data.error,
            statusCode: response.status,
         };
         throw error;
      }

      const logoutResponse = data as LogoutResponse;

      // Remove access token on logout
      removeAccessToken();

      return logoutResponse;
   } catch (error) {
      throw handleApiError(error);
   }
}

