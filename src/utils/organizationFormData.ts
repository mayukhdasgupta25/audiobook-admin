import type { CompletePartnerOrganizationInput } from '../types/partner';

export function buildOrganizationFormData(
  input: CompletePartnerOrganizationInput
): FormData {
  const formData = new FormData();
  formData.append('name', input.organizationName.trim());

  if (input.websiteUrl?.trim()) {
    formData.append('websiteUrl', input.websiteUrl.trim());
  }
  if (input.teamSize) {
    formData.append('teamSize', input.teamSize);
  }
  if (input.preferredGenreId) {
    formData.append('preferredGenreId', input.preferredGenreId);
  }
  if (input.image) {
    formData.append('image', input.image);
  }
  if (input.userProfileId?.trim()) {
    formData.append('userProfileId', input.userProfileId.trim());
  }

  return formData;
}
