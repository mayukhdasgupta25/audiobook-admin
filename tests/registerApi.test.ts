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

  it('sends multipart form data when profileImage is provided', async () => {
    const profileImage = new File(['photo'], 'profile.png', {
      type: 'image/png',
    });
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Registered' }),
    } as Response);

    await registerUser({
      email: 'author@example.com',
      password: 'Secure1pass',
      type: 'AUTHOR',
      firstName: 'Jane',
      lastName: 'Author',
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
  });

  it('sends JSON when profileImage is not provided', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Registered' }),
    } as Response);

    await registerUser({
      email: 'admin@acme.com',
      password: 'Secure1pass',
      role: 'ADMIN',
    });

    const requestInit = fetchMock.mock.calls[0][1] as RequestInit;
    expect(requestInit.headers).toEqual({
      'Content-Type': 'application/json',
    });
    expect(requestInit.body).toBe(
      JSON.stringify({
        email: 'admin@acme.com',
        password: 'Secure1pass',
        role: 'ADMIN',
      })
    );
  });
});
