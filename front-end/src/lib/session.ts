// Session management utilities for Keycloak
export interface StoredSession {
  token: string;
  refreshToken: string;
  idToken: string;
  timestamp: number;
}

export const SESSION_STORAGE_KEY = 'kc_session';
export const TOKEN_REFRESH_THRESHOLD = 30; // seconds

export const saveSession = (tokens: {
  token: string;
  refreshToken: string;
  idToken: string;
}) => {
  const session: StoredSession = {
    ...tokens,
    timestamp: Date.now(),
  };
  
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    localStorage.setItem('kc_token', tokens.token);
    localStorage.setItem('kc_refreshToken', tokens.refreshToken);
    localStorage.setItem('kc_idToken', tokens.idToken);
    localStorage.setItem('kc_timeLocal', Date.now().toString());
  } catch (error) {
    console.warn('Failed to save session to localStorage:', error);
  }
};

export const loadSession = (): StoredSession | null => {
  try {
    const sessionData = localStorage.getItem(SESSION_STORAGE_KEY);
    if (sessionData) {
      return JSON.parse(sessionData);
    }
    
    // Fallback to individual token storage
    const token = localStorage.getItem('kc_token');
    const refreshToken = localStorage.getItem('kc_refreshToken');
    const idToken = localStorage.getItem('kc_idToken');
    const timestamp = localStorage.getItem('kc_timeLocal');
    
    if (token && refreshToken && idToken) {
      return {
        token,
        refreshToken,
        idToken,
        timestamp: timestamp ? parseInt(timestamp, 10) : Date.now(),
      };
    }
  } catch (error) {
    console.warn('Failed to load session from localStorage:', error);
  }
  
  return null;
};

export const clearSession = () => {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem('kc_token');
    localStorage.removeItem('kc_refreshToken');
    localStorage.removeItem('kc_idToken');
    localStorage.removeItem('kc_timeLocal');
  } catch (error) {
    console.warn('Failed to clear session from localStorage:', error);
  }
};

export const isSessionExpired = (session: StoredSession): boolean => {
  // Consider session expired if it's older than 24 hours
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  return Date.now() - session.timestamp > maxAge;
};

export const shouldRefreshToken = (tokenExp: number | undefined): boolean => {
  if (!tokenExp) return true;
  
  const now = Math.floor(Date.now() / 1000);
  const timeUntilExpiry = tokenExp - now;
  
  return timeUntilExpiry < TOKEN_REFRESH_THRESHOLD;
};
