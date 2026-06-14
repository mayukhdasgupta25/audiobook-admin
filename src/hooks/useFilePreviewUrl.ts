import { useEffect, useState } from 'react';

export function useFilePreviewUrl(
  file: File | null | undefined,
  existingUrl?: string | null
): string | null {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    existingUrl ?? null
  );

  useEffect(() => {
    if (!file) {
      setPreviewUrl(existingUrl ?? null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file, existingUrl]);

  return previewUrl;
}
