import React from 'react';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { Loader2 } from 'lucide-react';
import keycloak from '@/keycloak';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Handle token storage and refresh
  const onTokens = (tokens: any) => {
    if (tokens.token) {
      localStorage.setItem('kc_token', tokens.token);
      localStorage.setItem('kc_refreshToken', tokens.refreshToken);
      localStorage.setItem('kc_idToken', tokens.idToken);
      localStorage.setItem('kc_timeLocal', Date.now().toString());
    }
  };

  // Initialize token refresh mechanism
  const initTokenRefresh = () => {
    // Set up automatic token refresh
    keycloak.onTokenExpired = () => {
      keycloak.updateToken(30)
        .then((refreshed) => {
          if (refreshed === true) {
            console.log('Token refreshed');
          } else {
            console.log('Token not refreshed, valid for', Math.round(keycloak.tokenParsed?.exp || 0 + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
          }
        })
        .catch((error) => {
          console.error('Failed to refresh token', error);
          // Clear stored tokens on refresh failure
          localStorage.removeItem('kc_token');
          localStorage.removeItem('kc_refreshToken');
          localStorage.removeItem('kc_idToken');
          localStorage.removeItem('kc_timeLocal');
          keycloak.login();
        });
    };
  };

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        onLoad: 'check-sso',
        checkLoginIframe: false,
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        enableLogging: true,
        pkceMethod: 'S256',
        // Try to restore session from stored tokens
        token: localStorage.getItem('kc_token') || undefined,
        refreshToken: localStorage.getItem('kc_refreshToken') || undefined,
        idToken: localStorage.getItem('kc_idToken') || undefined,
      }}
      onTokens={onTokens}
      onEvent={(event, error) => {
        if (event === 'onReady') {
          initTokenRefresh();
        } else if (event === 'onAuthLogout') {
          // Clear tokens on logout
          localStorage.removeItem('kc_token');
          localStorage.removeItem('kc_refreshToken');
          localStorage.removeItem('kc_idToken');
          localStorage.removeItem('kc_timeLocal');
        }
      }}
      LoadingComponent={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      {children}
    </ReactKeycloakProvider>
  );
};

export default AuthProvider; 