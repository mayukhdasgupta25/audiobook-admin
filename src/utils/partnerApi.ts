import type { ApiError } from '../types/auth';
import type {
  CompletePartnerOrganizationInput,
  CreateOrganizationRequest,
  CreateOrganizationResponse,
  RegisterIndividualInput,
  RegisterPartnerUserInput,
  RegisterRequest,
  RegisterResponse,
  UserProfile,
  UserProfileResponse,
  VerifyRegistrationOtpRequest,
  VerifyRegistrationOtpResponse,
} from '../types/partner';
import {
  getAuthApiBaseUrl,
  getContentApiBaseUrl,
  getAuthHeaders,
  getAuthHeadersForFileUpload,
  handleApiError,
} from './config';
import { buildOrganizationFormData } from './organizationFormData';
import {
  buildRegisterFormData,
  type RegisterFormDataInput,
} from './registerFormData';
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
    const formData = buildOrganizationFormData({
      organizationName: payload.name,
      websiteUrl: payload.websiteUrl,
      teamSize: payload.teamSize,
      preferredGenreId: payload.preferredGenreId,
      image: payload.image,
      userProfileId: payload.userProfileId,
    });
    const headers = getAuthHeadersForFileUpload();
    const response = await fetch(
      `${getContentApiBaseUrl()}/api/v1/organizations`,
      {
        method: 'POST',
        headers,
        body: formData,
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
  payload: RegisterFormDataInput
): Promise<RegisterResponse> {
  try {
    const useMultipart = Boolean(payload.profileImage);
    const { profileImage, ...jsonPayload } = payload;
    void profileImage;
    const response = await fetch(`${getAuthApiBaseUrl()}/auth/register`, {
      method: 'POST',
      credentials: 'include',
      headers: useMultipart ? {} : getPublicJsonHeaders(),
      body: useMultipart ? buildRegisterFormData(payload) : JSON.stringify(jsonPayload),
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

    return data as RegisterResponse;
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
const PROFILE_RETRY_DELAY_MS = 500;

/**
 * Fetches the authenticated user's profile
 */
export async function getUserProfile(): Promise<UserProfile> {
  try {
    const headers = getAuthHeaders();
    const response = await fetch(
      `${getContentApiBaseUrl()}/api/v1/user/profile`,
      {
        method: 'GET',
        headers,
      }
    );
    const data = await response.json();
    if (!response.ok) {
      const error: ApiError = {
        message: data.message || data.error || 'Failed to fetch user profile',
        error: data.error,
        statusCode: response.status,
      };
      throw error;
    }

    const profileResponse = data as UserProfileResponse;
    return profileResponse.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Fetches user profile, retrying on 404 up to maxAttempts times
 */
export async function fetchUserProfileWithRetry(
  maxAttempts = 3
): Promise<UserProfile> {
  let lastError: ApiError | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await getUserProfile();
    } catch (error) {
      const apiError = error as ApiError;
      lastError = apiError;

      if (apiError.statusCode !== 404 || attempt === maxAttempts) {
        throw error;
      }

      await new Promise(resolve => setTimeout(resolve, PROFILE_RETRY_DELAY_MS));
    }
  }

  throw lastError ?? {
    message: 'Failed to fetch user profile',
    error: 'ProfileNotFound',
    statusCode: 404,
  };
}

/**
 * Registers an organization admin user with email, password, and role
 */
export async function registerPartnerUser(
  input: RegisterPartnerUserInput
): Promise<string> {
  const body: RegisterRequest = {
    email: input.email.trim(),
    password: input.password,
    confirmPassword: input.confirmPassword,
    role: input.role,
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
 * Registers an individual author partner with personal details and type AUTHOR
 */
export async function registerIndividualPartner(
  input: RegisterIndividualInput
): Promise<string> {
  const body: RegisterFormDataInput = {
    email: input.email.trim(),
    password: input.password,
    confirmPassword: input.confirmPassword,
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
  if (input.profileImage) {
    body.profileImage = input.profileImage;
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
  await createOrganization({
    name: input.organizationName.trim(),
    websiteUrl: input.websiteUrl,
    teamSize: input.teamSize,
    preferredGenreId: input.preferredGenreId,
    image: input.image,
    userProfileId: input.userProfileId,
  });
}
