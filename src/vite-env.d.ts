/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_AUTH_PREFIX: string;
  readonly VITE_API_CONTENT_PREFIX: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_TYPE?: string;
  readonly MODE: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
