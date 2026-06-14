export interface AuthorFormDataInput {
  firstName: string;
  lastName: string;
  email: string;
  address?: string;
  contact?: string;
  profileImage?: File;
}

export function buildAuthorFormData(input: AuthorFormDataInput): FormData {
  const formData = new FormData();
  formData.append('firstName', input.firstName.trim());
  formData.append('lastName', input.lastName.trim());
  formData.append('email', input.email.trim());

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
