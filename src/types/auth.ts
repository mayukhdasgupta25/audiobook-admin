export type UserRole =
  | 'LISTENER'
  | 'GLOBAL_ADMIN'
  | 'ORG_ADMIN'
  | 'ORG_COORDINATOR'
  | 'AUTHOR';

export type LoginAppType = 'organization' | 'author';

/**
 * Browser device metadata sent with login requests
 */
export interface DeviceInfo {
  deviceId: string;
  platform: string;
  userAgent: string;
}

/**
 * Login request payload structure
 */
export interface LoginRequest {
  email: string;
  password: string;
  clientType: string;
  device?: DeviceInfo;
  slug?: string;
}

/**
 * Successful login response structure
 */
export interface LoginResponse {
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  appType?: LoginAppType;
  role?: UserRole;
  user?: {
    id: string;
    email: string;
    name?: string;
    role?: UserRole;
    emailVerified?: boolean;
  };
  message?: string;
}

/**
 * CSRF token response structure
 */
export interface CsrfTokenResponse {
  csrfToken: string;
}

/**
 * Token refresh response structure
 */
export interface RefreshResponse {
  accessToken?: string;
  token?: string;
  appType?: LoginAppType;
  role?: UserRole;
  user?: LoginResponse['user'];
}

/**
 * API error response structure
 */
export interface ApiError {
  message: string;
  error?: string;
  statusCode?: number;
}

/**
 * Logout response structure
 */
export interface LogoutResponse {
  message?: string;
  success?: boolean;
}
