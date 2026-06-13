const WORKSPACE_SLUG_KEY = 'srota_partner_workspace_slug';

export function getStoredWorkspaceSlug(): string {
  try {
    return localStorage.getItem(WORKSPACE_SLUG_KEY)?.trim() ?? '';
  } catch {
    return '';
  }
}

export function setStoredWorkspaceSlug(slug: string): void {
  try {
    const trimmed = slug.trim();
    if (trimmed.length > 0) {
      localStorage.setItem(WORKSPACE_SLUG_KEY, trimmed);
    } else {
      localStorage.removeItem(WORKSPACE_SLUG_KEY);
    }
  } catch {
    // ignore storage errors
  }
}

export function clearStoredWorkspaceSlug(): void {
  try {
    localStorage.removeItem(WORKSPACE_SLUG_KEY);
  } catch {
    // ignore storage errors
  }
}
