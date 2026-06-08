function requireEnv(key: string): string {
  const value = import.meta.env[key];
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value.trim();
}
/** Reads an env var that may be empty (valid for staging/production API prefixes). */
function readEnv(key: string): string {
  const value = import.meta.env[key];
  if (typeof value !== 'string') {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value.trim();
}

export const env = {
  authApiPrefix: readEnv('VITE_API_AUTH_PREFIX'),
  contentApiPrefix: readEnv('VITE_API_CONTENT_PREFIX'),
  appName: requireEnv('VITE_APP_NAME'),
  mode: requireEnv('MODE'),
} as const;
