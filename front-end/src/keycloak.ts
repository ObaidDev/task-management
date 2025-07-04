import Keycloak from 'keycloak-js';
import { loadSession } from '@/lib/session';

// Load existing session if available
const savedSession = loadSession();

const keycloak = new Keycloak({
  url: import.meta.env.VITE_USER_API_URL,
  realm: import.meta.env.VITE_REALM,
  clientId: import.meta.env.VITE_REALM_CLIENT, 
});

// Pre-populate with saved tokens if available
if (savedSession) {
  keycloak.token = savedSession.token;
  keycloak.refreshToken = savedSession.refreshToken;
  keycloak.idToken = savedSession.idToken;
}

export default keycloak; 