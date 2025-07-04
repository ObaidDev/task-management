import { useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { saveSession, clearSession, loadSession } from '@/lib/session';

export const useSessionPersistence = () => {
  const { keycloak, initialized } = useKeycloak();

  useEffect(() => {
    if (!initialized) return;

    // Set up automatic session saving when tokens change
    const handleTokenUpdate = () => {
      if (keycloak.authenticated && keycloak.token && keycloak.refreshToken && keycloak.idToken) {
        saveSession({
          token: keycloak.token,
          refreshToken: keycloak.refreshToken,
          idToken: keycloak.idToken,
        });
      }
    };

    // Set up token expiration handler
    const handleTokenExpired = () => {
      keycloak.updateToken(30)
        .then((refreshed) => {
          if (refreshed) {
            console.log('Token refreshed successfully');
            handleTokenUpdate();
          }
        })
        .catch((error) => {
          console.error('Failed to refresh token:', error);
          clearSession();
          keycloak.login();
        });
    };

    // Set up logout handler
    const handleLogout = () => {
      clearSession();
    };

    // Assign event handlers
    keycloak.onTokenExpired = handleTokenExpired;
    keycloak.onAuthLogout = handleLogout;
    keycloak.onAuthSuccess = handleTokenUpdate;
    keycloak.onTokenExpired = handleTokenExpired;

    // Save initial session if authenticated
    if (keycloak.authenticated) {
      handleTokenUpdate();
    }

    // Cleanup function
    return () => {
      keycloak.onTokenExpired = undefined;
      keycloak.onAuthLogout = undefined;
      keycloak.onAuthSuccess = undefined;
    };
  }, [keycloak, initialized]);

  const restoreSession = () => {
    const session = loadSession();
    if (session && !keycloak.authenticated) {
      // Try to restore session
      keycloak.token = session.token;
      keycloak.refreshToken = session.refreshToken;
      keycloak.idToken = session.idToken;
      
      // Validate and refresh if needed
      keycloak.updateToken(30)
        .then((refreshed) => {
          if (refreshed) {
            console.log('Session restored and token refreshed');
          } else {
            console.log('Session restored successfully');
          }
        })
        .catch((error) => {
          console.error('Failed to restore session:', error);
          clearSession();
        });
    }
  };

  return {
    restoreSession,
    clearSession,
  };
};
