import React from 'react';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { Loader2 } from 'lucide-react';
import keycloak from '@/keycloak';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // const onTokens = (tokens: any) => {
  //   if (tokens.token) {
  //     localStorage.setItem('token', tokens.token);
  //   }
  //   if (tokens.refreshToken) {
  //     localStorage.setItem('refresh_token', tokens.refreshToken);
  //   }
  // };

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        onLoad: 'check-sso',
        checkLoginIframe: false,
        // silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        enableLogging: true,
        pkceMethod: 'S256'
      }}
      // onTokens={onTokens}
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