// src/hooks/useAuth.ts
import { useKeycloak } from '@react-keycloak/web';

export const useAuth = () => {
  const { keycloak, initialized } = useKeycloak();

  const login = () => keycloak.login();
  
  const logout = () => {
    // Clear stored tokens on logout
    localStorage.removeItem('kc_token');
    localStorage.removeItem('kc_refreshToken');
    localStorage.removeItem('kc_idToken');
    localStorage.removeItem('kc_timeLocal');
    keycloak.logout();
  };
  
  const register = () => keycloak.register();

  const hasRole = (role: string) => {
    return keycloak.hasRealmRole(role);
  };

  const hasAnyRole = (roles: string[]) => {
    return roles.some(role => keycloak.hasRealmRole(role));
  };

  const getToken = async () => {
    try {
      // Ensure token is fresh before returning
      await keycloak.updateToken(30);
      return keycloak.token;
    } catch (error) {
      console.error('Failed to refresh token', error);
      return null;
    }
  };
  
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

  const isTokenExpired = () => {
    return keycloak.isTokenExpired();
  };

  const refreshToken = async () => {
    try {
      const refreshed = await keycloak.updateToken(0);
      return refreshed;
    } catch (error) {
      console.error('Token refresh failed', error);
      return false;
    }
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
    isTokenExpired,
    refreshToken,
    keycloak,
  };
};