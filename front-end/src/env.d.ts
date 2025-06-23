/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAIN_API_URL: string
  readonly VITE_CLIENT_API_URL: string
  readonly VITE_USER_API_URL: string
  readonly VITE_AUTH_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 