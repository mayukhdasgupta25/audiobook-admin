import type { ApiError } from '../types/auth';
import type {
  CompletePartnerOrganizationInput,
  CreateOrganizationRequest,
  CreateOrganizationResponse,
  RegisterIndividualInput,
  RegisterPartnerUserInput,
  RegisterRequest,
  RegisterResponse,
  VerifyRegistrationOtpRequest,
  VerifyRegistrationOtpResponse,
} from '../types/partner';
import {
  getAuthApiBaseUrl,
  getContentApiBaseUrl,
  getAuthHeaders,
  handleApiError,
} from './config';
import { setAccessToken } from './token';
function getPublicJsonHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
  };
}

function storeTokenFromResponse(
  response: RegisterResponse | VerifyRegistrationOtpResponse
): void {
  if (response.accessToken) {
    setAccessToken(response.accessToken);
  } else if (response.token) {
    setAccessToken(response.token);
  }
}
/**
 * Creates a new organization
 */
export async function createOrganization(
  payload: CreateOrganizationRequest
): Promise<CreateOrganizationResponse['data']> {
  try {
    const headers = getAuthHeaders();
    const response = await fetch(
      `${getContentApiBaseUrl()}/api/v1/organizations`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      const error: ApiError = {
        message: data.message || data.error || 'Failed to create organization',
        error: data.error,
        statusCode: response.status,
      };
      throw error;
    }

    const orgResponse = data as CreateOrganizationResponse;
    return orgResponse.data;
  } catch (error) {
    throw handleApiError(error);
  }
}
/**
 * Registers a new user
 */
export async function registerUser(
  payload: RegisterRequest
): Promise<RegisterResponse> {
  try {
    const response = await fetch(`${getAuthApiBaseUrl()}/auth/register`, {
      method: 'POST',
      credentials: 'include',
      headers: getPublicJsonHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
      const error: ApiError = {
        message: data.message || data.error || 'Failed to register user',
        error: data.error,
        statusCode: response.status,
      };
      throw error;
    }

    const registerResponse = data as RegisterResponse;
    storeTokenFromResponse(registerResponse);
    return registerResponse;
  } catch (error) {
    throw handleApiError(error);
  }
}
/**
 * Verifies registration OTP
 */
export async function verifyRegistrationOtp(
  payload: VerifyRegistrationOtpRequest
): Promise<VerifyRegistrationOtpResponse> {
  try {
    const body: VerifyRegistrationOtpRequest = {
      email: payload.email,
      otp: payload.otp,
      type: payload.type,
    };
    if (payload.firstName?.trim()) {
      body.firstName = payload.firstName.trim();
    }
    if (payload.lastName?.trim()) {
      body.lastName = payload.lastName.trim();
    }

    const response = await fetch(
      `${getAuthApiBaseUrl()}/auth/verify-registration-otp`,
      {
        method: 'POST',
        credentials: 'include',
        headers: getPublicJsonHeaders(),
        body: JSON.stringify(body),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      const error: ApiError = {
        message: data.message || data.error || 'Failed to verify OTP',
        error: data.error,
        statusCode: response.status,
      };
      throw error;
    }

    const verifyResponse = data as VerifyRegistrationOtpResponse;
    storeTokenFromResponse(verifyResponse);
    return verifyResponse;
  } catch (error) {
    throw handleApiError(error);
  }
}
/**
 * Registers an organization admin user with email, password, and role
 */
export async function registerPartnerUser(
  input: RegisterPartnerUserInput
): Promise<string> {
  await registerUser({
    email: input.email.trim(),
    password: input.password,
    role: input.role,
  });
  return input.email.trim();
}
/**
 * Registers an individual author partner with personal details and type AUTHOR
 */
export async function registerIndividualPartner(
  input: RegisterIndividualInput
): Promise<string> {
  const body: RegisterRequest = {
    email: input.email.trim(),
    password: input.password,
    type: 'AUTHOR',
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
  };
  if (input.address?.trim()) {
    body.address = input.address.trim();
  }
  if (input.contact?.trim()) {
    body.contact = input.contact.trim();
  }
  await registerUser(body);
  return input.email.trim();
}
/**
 * Creates organization (members are created by the backend on org creation)
 */
export async function completePartnerOrganizationSetup(
  input: CompletePartnerOrganizationInput
): Promise<void> {
  await createOrganization({ name: input.organizationName.trim() });
}
