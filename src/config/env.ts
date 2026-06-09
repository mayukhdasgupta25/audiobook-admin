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

function readEnvOptional(key: string, defaultValue: string): string {
  const value = import.meta.env[key];
  if (typeof value !== 'string' || value.trim() === '') {
    return defaultValue;
  }
  return value.trim();
}

export const env = {
  authApiPrefix: readEnv('VITE_API_AUTH_PREFIX'),
  contentApiPrefix: readEnv('VITE_API_CONTENT_PREFIX'),
  appName: requireEnv('VITE_APP_NAME'),
  appType: readEnvOptional('VITE_APP_TYPE', 'partner'),
  mode: requireEnv('MODE'),
} as const;
