import { describe, it, expect } from 'vitest';
import { buildOrganizationFormData } from '../src/utils/organizationFormData';

describe('buildOrganizationFormData', () => {
  it('includes required name field', () => {
    const formData = buildOrganizationFormData({
      organizationName: 'Acme Audio',
    });

    expect(formData.get('name')).toBe('Acme Audio');
  });

  it('includes optional organization fields when provided', () => {
    const image = new File(['logo'], 'logo.png', { type: 'image/png' });
    const formData = buildOrganizationFormData({
      organizationName: 'Acme Audio',
      websiteUrl: 'https://acme.example',
      teamSize: '11-50',
      preferredGenreId: 'genre-123',
      image,
    });

    expect(formData.get('websiteUrl')).toBe('https://acme.example');
    expect(formData.get('teamSize')).toBe('11-50');
    expect(formData.get('preferredGenreId')).toBe('genre-123');
    expect(formData.get('image')).toBe(image);
  });

  it('includes userProfileId when provided', () => {
    const formData = buildOrganizationFormData({
      organizationName: 'Acme Audio',
      userProfileId: 'profile-abc-123',
    });

    expect(formData.get('userProfileId')).toBe('profile-abc-123');
  });

  it('omits blank optional fields', () => {
    const formData = buildOrganizationFormData({
      organizationName: 'Acme Audio',
      websiteUrl: '   ',
    });

    expect(formData.get('websiteUrl')).toBeNull();
    expect(formData.get('teamSize')).toBeNull();
    expect(formData.get('preferredGenreId')).toBeNull();
    expect(formData.get('image')).toBeNull();
  });
});
