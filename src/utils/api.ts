import type {
  LoginRequest,
  LoginResponse,
  ApiError,
  LogoutResponse,
  RefreshResponse,
} from '../types/auth';
import { setAccessToken, removeAccessToken } from './token';
import { getAuthApiBaseUrl, handleApiError } from './config';
import { clearCsrfToken, fetchCsrfToken, getCsrfHeaders } from './csrf';
export { fetchCsrfToken };

function storeAccessTokenFromResponse(response: {
  accessToken?: string;
  token?: string;
}): void {
  if (response.accessToken) {
    setAccessToken(response.accessToken);
  } else if (response.token) {
    setAccessToken(response.token);
  }
}
async function authPost(
  path: string,
  body?: Record<string, unknown>
): Promise<Response> {
  const csrfHeaders = await getCsrfHeaders();
  return fetch(`${getAuthApiBaseUrl()}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...csrfHeaders,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}
/**
 * Makes a login API call to the authentication endpoint
 * @param credentials - Email and password for login
 * @returns Promise resolving to login response or throwing an error
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  try {
    const loginBody: Record<string, unknown> = {
      email: credentials.email,
      password: credentials.password,
      clientType: credentials.clientType,
      device: credentials.device,
      app: 'partner',
    };
    if (credentials.slug?.trim()) {
      loginBody.slug = credentials.slug.trim();
    }
    const response = await authPost('/auth/login', loginBody);
    const data = await response.json();
    if (!response.ok) {
      const error: ApiError = {
        message: data.message || data.error || 'Login failed',
        error: data.error,
        statusCode: response.status,
      };
      throw error;
    }

    const loginResponse = data as LoginResponse;
    storeAccessTokenFromResponse(loginResponse);
    return loginResponse;
  } catch (error) {
    throw handleApiError(error);
  }
}
/**
 * Refreshes the access token using the httpOnly refreshToken cookie
 * @returns Promise resolving to refresh response or throwing an error
 */
export async function refresh(): Promise<RefreshResponse> {
  try {
    const response = await authPost('/auth/refresh');
    const data = await response.json();
    if (!response.ok) {
      const error: ApiError = {
        message: data.message || data.error || 'Token refresh failed',
        error: data.error,
        statusCode: response.status,
      };
      throw error;
    }

    const refreshResponse = data as RefreshResponse;
    storeAccessTokenFromResponse(refreshResponse);
    return refreshResponse;
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
    const response = await authPost('/auth/logout');
    const data = await response.json();
    if (!response.ok) {
      const error: ApiError = {
        message: data.message || data.error || 'Logout failed',
        error: data.error,
        statusCode: response.status,
      };
      throw error;
    }

    const logoutResponse = data as LogoutResponse;
    removeAccessToken();
    clearCsrfToken();
    return logoutResponse;
  } catch (error) {
    throw handleApiError(error);
  }
}
