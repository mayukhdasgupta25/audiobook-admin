import type { RegisterRequest } from '../types/partner';

export interface RegisterFormDataInput extends RegisterRequest {
  profileImage?: File;
}

export function buildRegisterFormData(input: RegisterFormDataInput): FormData {
  const formData = new FormData();
  formData.append('email', input.email.trim());
  formData.append('password', input.password);
  formData.append('confirmPassword', input.confirmPassword);

  if (input.role) {
    formData.append('role', input.role);
  }
  if (input.firstName?.trim()) {
    formData.append('firstName', input.firstName.trim());
  }
  if (input.lastName?.trim()) {
    formData.append('lastName', input.lastName.trim());
  }
  if (input.address?.trim()) {
    formData.append('address', input.address.trim());
  }
  if (input.contact?.trim()) {
    formData.append('contact', input.contact.trim());
  }
  if (input.profileImage) {
    formData.append('profileImage', input.profileImage);
  }

  return formData;
}
