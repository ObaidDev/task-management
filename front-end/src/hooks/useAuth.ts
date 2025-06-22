// src/hooks/useAuth.ts
import { useKeycloak } from '@react-keycloak/web';

export const useAuth = () => {
  const { keycloak, initialized } = useKeycloak();

  const login = () => keycloak.login();
  const logout = () => keycloak.logout();
  const register = () => keycloak.register();

  const hasRole = (role: string) => {
    return keycloak.hasRealmRole(role);
  };

  const hasAnyRole = (roles: string[]) => {
    return roles.some(role => keycloak.hasRealmRole(role));
  };

  const getToken = () => keycloak.token;
  const getRefreshToken = () => keycloak.refreshToken;

  const getUserInfo = () => {
    if (keycloak.tokenParsed) {
      return {
        id: keycloak.tokenParsed.sub,
        username: keycloak.tokenParsed.preferred_username,
        email: keycloak.tokenParsed.email,
        firstName: keycloak.tokenParsed.given_name,
        lastName: keycloak.tokenParsed.family_name,
        roles: keycloak.tokenParsed.realm_access?.roles || [],
      };
    }
    return null;
  };

  return {
    isAuthenticated: initialized && keycloak.authenticated,
    isLoading: !initialized,
    login,
    logout,
    register,
    hasRole,
    hasAnyRole,
    getToken,
    getRefreshToken,
    getUserInfo,
    keycloak,
  };
};