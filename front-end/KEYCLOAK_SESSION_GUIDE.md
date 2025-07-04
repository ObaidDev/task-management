# Keycloak Session Persistence Setup

## Overview
This setup implements persistent Keycloak sessions that survive browser restarts. The session state is securely stored in localStorage and automatically restored when the user returns.

## Key Features
- ✅ Automatic token refresh before expiration
- ✅ Session persistence across browser restarts
- ✅ Secure token storage in localStorage
- ✅ Automatic cleanup on logout
- ✅ Silent SSO checking
- ✅ Comprehensive error handling

## Configuration Options

### AuthProvider Configuration
The `AuthProvider` component now includes:
- Token persistence in localStorage
- Automatic token refresh mechanism
- Silent SSO checking enabled
- Proper event handling for auth state changes

### Key Settings Explained

```typescript
initOptions={{
  onLoad: 'check-sso',           // Check for existing SSO session
  checkLoginIframe: false,       // Disable iframe checking (can cause issues in some browsers)
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html', // Silent SSO endpoint
  enableLogging: true,           // Enable debug logging
  pkceMethod: 'S256',           // Use PKCE for security
  // Pre-populate with saved tokens
  token: localStorage.getItem('kc_token') || undefined,
  refreshToken: localStorage.getItem('kc_refreshToken') || undefined,
  idToken: localStorage.getItem('kc_idToken') || undefined,
}}
```

## Security Considerations

### Token Storage
- Tokens are stored in localStorage with prefixed keys (`kc_*`)
- Tokens are automatically cleared on logout
- Failed refresh attempts clear stored tokens
- Session expiry is tracked with timestamps

### Token Refresh
- Tokens are refreshed 30 seconds before expiration
- Automatic retry on API 401 errors
- Graceful fallback to login on refresh failure

## Usage Examples

### Basic Authentication Check
```typescript
import { useAuth } from '@/hooks/useAuth';

const MyComponent = () => {
  const { isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    return <button onClick={login}>Login</button>;
  }

  return (
    <div>
      <p>Welcome! You are logged in.</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

### Getting Fresh Tokens
```typescript
import { useAuth } from '@/hooks/useAuth';

const ApiComponent = () => {
  const { getToken } = useAuth();

  const makeApiCall = async () => {
    const token = await getToken(); // Automatically refreshes if needed
    if (token) {
      // Make your API call with the fresh token
      const response = await fetch('/api/data', {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
  };

  return <button onClick={makeApiCall}>Fetch Data</button>;
};
```

### Session Persistence Hook
```typescript
import { useSessionPersistence } from '@/hooks/useSessionPersistence';

const App = () => {
  const { restoreSession } = useSessionPersistence();

  // The hook automatically handles session persistence
  // You can manually restore if needed: restoreSession()

  return <YourAppContent />;
};
```

## Environment Variables Required

Make sure these environment variables are set:
```env
VITE_USER_API_URL=https://your-keycloak-server.com
VITE_REALM=your-realm-name
VITE_REALM_CLIENT=your-client-id
VITE_BACKEND_API_URL=https://your-api-server.com
```

## Keycloak Client Configuration

In your Keycloak admin console, ensure your client has:
- **Access Type**: `public` or `confidential`
- **Standard Flow Enabled**: `ON`
- **Direct Access Grants Enabled**: `ON` (if needed)
- **Valid Redirect URIs**: Include your app URLs
- **Web Origins**: Include your app domain
- **Advanced Settings > Proof Key for Code Exchange Code Challenge Method**: `S256`

## Testing Session Persistence

1. Login to your application
2. Close the browser completely
3. Reopen the browser and navigate to your app
4. You should remain logged in without being redirected to login

## Troubleshooting

### Session Not Persisting
- Check browser developer tools > Application > Local Storage for `kc_*` keys
- Verify that `silentCheckSsoRedirectUri` is accessible
- Check Keycloak server logs for SSO-related errors

### Token Refresh Issues
- Verify network connectivity to Keycloak server
- Check Keycloak client configuration
- Look for CORS issues in browser console

### Silent SSO Not Working
- Ensure `/silent-check-sso.html` is accessible
- Check that the file is properly served by your web server
- Verify Keycloak client's valid redirect URIs include the silent SSO URL

## Browser Compatibility
This implementation works with:
- Chrome 80+
- Firefox 75+
- Safari 13.1+
- Edge 80+

localStorage is required for session persistence. The app will fall back to session-only authentication if localStorage is not available.
