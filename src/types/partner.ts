import type { ApiError } from './auth';

export type { ApiError };

export type PartnerType = 'organization' | 'individual';

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
   role?: string;
   type?: string;
   firstName?: string;
   lastName?: string;
   address?: string;
   contact?: string;
}

export interface RegisterResponse {
   token?: string;
   accessToken?: string;
   message?: string;
}

export type VerifyRegistrationOtpType = 'organization' | 'author';

export interface VerifyRegistrationOtpRequest {
   email: string;
   otp: string;
   type: VerifyRegistrationOtpType;
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

export interface RegisterIndividualInput {
   email: string;
   password: string;
   firstName: string;
   lastName: string;
   address?: string;
   contact?: string;
}

export interface CompletePartnerOrganizationInput {
   organizationName: string;
}
