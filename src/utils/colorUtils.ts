export function normalizeHexColor(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const hex = trimmed.startsWith('#') ? trimmed.slice(1) : trimmed;
  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
    return undefined;
  }

  return `#${hex.toUpperCase()}`;
}

export function getReadableTextColor(hexColor: string): string {
  const normalized = normalizeHexColor(hexColor);
  if (!normalized) {
    return '#ffffff';
  }

  const hex = normalized.slice(1);
  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

  return luminance > 0.6 ? '#111827' : '#ffffff';
}
