import type { ApiError } from './auth';
export type { ApiError };

export type PartnerType = 'organization' | 'individual';

export type TeamSize = '1-10' | '11-50' | '51-200' | '200+';

export interface UserProfile {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  avatar?: string;
}

export interface UserProfileResponse {
  success: boolean;
  data: UserProfile;
  message?: string;
}

export interface CreateOrganizationRequest {
  name: string;
  websiteUrl?: string;
  teamSize?: TeamSize;
  preferredGenreId?: string;
  image?: File;
  userProfileId?: string;
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
  refreshToken?: string;
  message?: string;
}

export interface RegisterPartnerUserInput {
  email: string;
  password: string;
  role: string;
  address?: string;
  contact?: string;
}

export interface RegisterIndividualInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address?: string;
  contact?: string;
  profileImage?: File;
}

export interface CompletePartnerOrganizationInput {
  organizationName: string;
  websiteUrl?: string;
  teamSize?: TeamSize;
  preferredGenreId?: string;
  image?: File;
  userProfileId?: string;
}
