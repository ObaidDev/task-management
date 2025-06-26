/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_API_URL: string
  readonly VITE_USER_API_URL: string
  readonly VITE_REALM: string
  readonly VITE_REALM_CLIENT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 