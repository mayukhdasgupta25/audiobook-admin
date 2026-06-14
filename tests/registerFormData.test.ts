import { describe, it, expect } from 'vitest';
import { buildRegisterFormData } from '../src/utils/registerFormData';

describe('buildRegisterFormData', () => {
  it('includes required register fields', () => {
    const formData = buildRegisterFormData({
      email: 'author@example.com',
      password: 'Secure1pass',
      confirmPassword: 'Secure1pass',
      role: 'AUTHOR',
      firstName: 'Jane',
      lastName: 'Author',
    });

    expect(formData.get('email')).toBe('author@example.com');
    expect(formData.get('password')).toBe('Secure1pass');
    expect(formData.get('confirmPassword')).toBe('Secure1pass');
    expect(formData.get('role')).toBe('AUTHOR');
    expect(formData.get('firstName')).toBe('Jane');
    expect(formData.get('lastName')).toBe('Author');
  });

  it('includes profileImage when provided', () => {
    const profileImage = new File(['photo'], 'profile.png', {
      type: 'image/png',
    });
    const formData = buildRegisterFormData({
      email: 'author@example.com',
      password: 'Secure1pass',
      confirmPassword: 'Secure1pass',
      role: 'AUTHOR',
      firstName: 'Jane',
      lastName: 'Author',
      profileImage,
    });

    expect(formData.get('profileImage')).toBe(profileImage);
  });

  it('omits blank optional fields', () => {
    const formData = buildRegisterFormData({
      email: 'author@example.com',
      password: 'Secure1pass',
      confirmPassword: 'Secure1pass',
      role: 'AUTHOR',
      firstName: 'Jane',
      lastName: 'Author',
      address: '   ',
      contact: '',
    });

    expect(formData.get('address')).toBeNull();
    expect(formData.get('contact')).toBeNull();
    expect(formData.get('profileImage')).toBeNull();
  });
});
