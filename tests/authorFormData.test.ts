import { describe, it, expect } from 'vitest';
import { buildAuthorFormData } from '../src/utils/authorFormData';

describe('buildAuthorFormData', () => {
  it('includes required author fields', () => {
    const formData = buildAuthorFormData({
      firstName: 'Jane',
      lastName: 'Author',
      email: 'jane@example.com',
    });

    expect(formData.get('firstName')).toBe('Jane');
    expect(formData.get('lastName')).toBe('Author');
    expect(formData.get('email')).toBe('jane@example.com');
  });

  it('includes profileImage when provided', () => {
    const profileImage = new File(['photo'], 'profile.png', {
      type: 'image/png',
    });
    const formData = buildAuthorFormData({
      firstName: 'Jane',
      lastName: 'Author',
      email: 'jane@example.com',
      profileImage,
    });

    expect(formData.get('profileImage')).toBe(profileImage);
  });

  it('omits blank optional fields', () => {
    const formData = buildAuthorFormData({
      firstName: 'Jane',
      lastName: 'Author',
      email: 'jane@example.com',
      address: '   ',
      contact: '',
    });

    expect(formData.get('address')).toBeNull();
    expect(formData.get('contact')).toBeNull();
    expect(formData.get('profileImage')).toBeNull();
  });
});
