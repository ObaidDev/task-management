import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: import.meta.env.VITE_USER_API_URL,
  realm: import.meta.env.VITE_REALM,
  clientId: import.meta.env.VITE_REALM_CLIENT, 
});

export default keycloak; 