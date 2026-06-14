import { afterEach, describe, expect, it, vi } from 'vitest';
import { registerUser } from '../src/utils/partnerApi';

vi.mock('../src/utils/config', () => ({
  getAuthApiBaseUrl: vi.fn(() => 'https://auth.example.com'),
  handleApiError: vi.fn((error: unknown) => error),
}));

describe('registerUser', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('sends multipart form data for AUTHOR registration', async () => {
    const profileImage = new File(['photo'], 'profile.png', {
      type: 'image/png',
    });
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Registered', otpSent: true }),
    } as Response);

    await registerUser({
      email: 'author@example.com',
      password: 'Secure1pass',
      confirmPassword: 'Secure1pass',
      role: 'AUTHOR',
      firstName: 'Jane',
      lastName: 'Author',
      address: '123 Main St',
      profileImage,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://auth.example.com/auth/register',
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        headers: {},
      })
    );

    const requestInit = fetchMock.mock.calls[0][1] as RequestInit;
    expect(requestInit.body).toBeInstanceOf(FormData);
    const formData = requestInit.body as FormData;
    expect(formData.get('profileImage')).toBe(profileImage);
    expect(formData.get('email')).toBe('author@example.com');
    expect(formData.get('role')).toBe('AUTHOR');
    expect(formData.get('confirmPassword')).toBe('Secure1pass');
  });

  it('sends multipart for AUTHOR even without profile image', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Registered', otpSent: true }),
    } as Response);

    await registerUser({
      email: 'author@example.com',
      password: 'Secure1pass',
      confirmPassword: 'Secure1pass',
      role: 'AUTHOR',
      firstName: 'Jane',
      lastName: 'Author',
      address: '123 Main St',
    });

    const requestInit = fetchMock.mock.calls[0][1] as RequestInit;
    expect(requestInit.headers).toEqual({});
    expect(requestInit.body).toBeInstanceOf(FormData);
  });

  it('sends JSON for ORG_ADMIN registration', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Registered', otpSent: true }),
    } as Response);

    await registerUser({
      email: 'admin@acme.com',
      password: 'Secure1pass',
      confirmPassword: 'Secure1pass',
      role: 'ORG_ADMIN',
    });

    const requestInit = fetchMock.mock.calls[0][1] as RequestInit;
    expect(requestInit.headers).toEqual({
      'Content-Type': 'application/json',
    });
    expect(requestInit.body).toBe(
      JSON.stringify({
        email: 'admin@acme.com',
        password: 'Secure1pass',
        confirmPassword: 'Secure1pass',
        role: 'ORG_ADMIN',
      })
    );
  });
});
