import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createAudiobook,
  updateAudiobook,
  type GenreItem,
} from '../src/utils/audiobookApi';

vi.mock('../src/utils/config', () => ({
  getAuthHeaders: vi.fn(() => ({
    Authorization: 'Bearer test-token',
    'Content-Type': 'application/json',
  })),
  getAuthHeadersForFileUpload: vi.fn(() => ({
    Authorization: 'Bearer test-token',
  })),
  getContentApiBaseUrl: vi.fn(() => 'https://api.example.com'),
  handleApiError: vi.fn((error: unknown) => error),
}));

const baseCreatePayload = {
  title: 'Test Audiobook',
  author: 'Test Author',
  description: 'A test description',
  genreIds: ['genre-1'] as string[],
  tagIds: ['tag-1'] as string[],
  language: 'Hindi',
};

describe('audiobook API language payloads', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('includes language in JSON create payload when no cover image', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: { id: 'ab-1', ...baseCreatePayload },
      }),
    } as Response);

    await createAudiobook(baseCreatePayload);

    const [, request] = fetchMock.mock.calls[0];
    const body = JSON.parse((request as RequestInit).body as string);
    expect(body.language).toBe('Hindi');
    expect(body.title).toBe('Test Audiobook');
  });

  it('includes language in FormData create payload when cover image is provided', async () => {
    const coverImage = new File(['cover'], 'cover.png', { type: 'image/png' });
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: { id: 'ab-2', title: 'Test Audiobook' },
      }),
    } as Response);

    await createAudiobook({ ...baseCreatePayload, coverImage });

    const [, request] = fetchMock.mock.calls[0];
    const formData = (request as RequestInit).body as FormData;
    expect(formData.get('language')).toBe('Hindi');
    expect(formData.get('title')).toBe('Test Audiobook');
  });

  it('includes language in JSON update payload when no new cover image', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: { id: 'ab-1', title: 'Updated Title' },
      }),
    } as Response);

    await updateAudiobook({
      audiobookId: 'ab-1',
      title: 'Updated Title',
      language: 'Spanish',
      genreIds: ['genre-1'],
      tagIds: ['tag-1'],
    });

    const [, request] = fetchMock.mock.calls[0];
    const body = JSON.parse((request as RequestInit).body as string);
    expect(body.language).toBe('Spanish');
    expect(body.title).toBe('Updated Title');
  });

  it('includes language in FormData update payload when cover image is provided', async () => {
    const coverImage = new File(['cover'], 'cover.png', { type: 'image/png' });
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: { id: 'ab-1', title: 'Updated Title' },
      }),
    } as Response);

    await updateAudiobook({
      audiobookId: 'ab-1',
      title: 'Updated Title',
      language: 'French',
      coverImage,
    });

    const [, request] = fetchMock.mock.calls[0];
    const formData = (request as RequestInit).body as FormData;
    expect(formData.get('language')).toBe('French');
    expect(formData.get('audiobookId')).toBe('ab-1');
  });
});
