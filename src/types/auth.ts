/**
 * Login request payload structure
 */
export interface LoginRequest {
   email: string;
   password: string;
   clientType: string;
}

/**
 * Successful login response structure
 */
export interface LoginResponse {
   token?: string;
   accessToken?: string;
   refreshToken?: string;
   user?: {
      id: string;
      email: string;
      name?: string;
   };
   message?: string;
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

