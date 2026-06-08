import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearCsrfToken,
  ensureCsrfToken,
  fetchCsrfToken,
} from '../src/utils/csrf';
describe('csrf utilities', () => {
  beforeEach(() => {
    clearCsrfToken();
    vi.restoreAllMocks();
  });
  afterEach(() => {
    clearCsrfToken();
    vi.restoreAllMocks();
  });
  it('fetches a CSRF token on first call', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ csrfToken: 'test-csrf-token' }),
    } as Response);
    const token = await fetchCsrfToken();
    expect(token).toBe('test-csrf-token');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/auth/csrf-token'),
      expect.objectContaining({
        method: 'GET',
        credentials: 'include',
      })
    );
  });
  it('reuses the cached CSRF token on subsequent calls', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ csrfToken: 'cached-csrf-token' }),
    } as Response);
    const firstToken = await ensureCsrfToken();
    const secondToken = await ensureCsrfToken();
    expect(firstToken).toBe('cached-csrf-token');
    expect(secondToken).toBe('cached-csrf-token');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
  it('re-fetches the CSRF token after clearing the cache', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ csrfToken: 'first-token' }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ csrfToken: 'second-token' }),
      } as Response);
    const firstToken = await ensureCsrfToken();
    clearCsrfToken();
    const secondToken = await ensureCsrfToken();
    expect(firstToken).toBe('first-token');
    expect(secondToken).toBe('second-token');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
