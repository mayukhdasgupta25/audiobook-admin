import type { ApiError } from './auth';

export type { ApiError };

export interface CreateOrganizationRequest {
   name: string;
}

export interface OrganizationItem {
   id: string;
   name: string;
   slug?: string;
   description?: string;
   createdAt?: string;
   updatedAt?: string;
}

export interface CreateOrganizationResponse {
   success: boolean;
   data: OrganizationItem;
   message?: string;
}

export interface RegisterRequest {
   email: string;
   password: string;
   role: string;
}

export interface RegisterResponse {
   token?: string;
   accessToken?: string;
   message?: string;
}

export interface VerifyRegistrationOtpRequest {
   email: string;
   otp: string;
   firstName?: string;
   lastName?: string;
}

export interface VerifyRegistrationOtpResponse {
   token?: string;
   accessToken?: string;
   message?: string;
}

export interface RegisterPartnerUserInput {
   email: string;
   password: string;
   role: string;
}

export interface CompletePartnerOrganizationInput {
   organizationName: string;
}
