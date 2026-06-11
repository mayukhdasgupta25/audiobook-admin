import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useFilePreviewUrl } from '../src/hooks/useFilePreviewUrl';

describe('useFilePreviewUrl', () => {
  it('returns an object URL for a selected file and revokes it on change', async () => {
    const file = new File(['cover'], 'cover.png', { type: 'image/png' });
    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL');

    const { result, rerender } = renderHook(
      ({ selectedFile }: { selectedFile: File | null }) =>
        useFilePreviewUrl(selectedFile, null),
      { initialProps: { selectedFile: null as File | null } }
    );

    expect(result.current).toBeNull();

    rerender({ selectedFile: file });

    await waitFor(() => {
      expect(result.current).toMatch(/^blob:/);
    });

    rerender({ selectedFile: null });

    await waitFor(() => {
      expect(result.current).toBeNull();
      expect(revokeSpy).toHaveBeenCalled();
    });

    revokeSpy.mockRestore();
  });
});
