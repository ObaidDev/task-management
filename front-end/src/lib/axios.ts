import keycloak from '@/keycloak';
import axios from 'axios';

export const userApi = axios.create({
  baseURL: import.meta.env.VITE_USER_API_URL,
});

export const backApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
});

// Request interceptor for both instances
const requestInterceptor = async (config: any) => {
  if (keycloak.authenticated) {
    try {
      // Ensure token is fresh (refresh if expires in 30 seconds)
      await keycloak.updateToken(30);
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      // If refresh fails, redirect to login
      keycloak.login();
    }
  }
  return config;
};

// Response interceptor to handle 401 errors
const responseInterceptor = (response: any) => response;

const responseErrorInterceptor = async (error: any) => {
  if (error.response?.status === 401 && keycloak.authenticated) {
    try {
      // Try to refresh token
      await keycloak.updateToken(0);
      // Retry the original request with new token
      error.config.headers.Authorization = `Bearer ${keycloak.token}`;
      return axios.request(error.config);
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError);
      // Clear stored tokens and redirect to login
      localStorage.removeItem('kc_token');
      localStorage.removeItem('kc_refreshToken');
      localStorage.removeItem('kc_idToken');
      localStorage.removeItem('kc_timeLocal');
      keycloak.login();
    }
  }
  return Promise.reject(new Error(error.message ?? 'Request failed'));
};

// Apply interceptors to both instances
userApi.interceptors.request.use(requestInterceptor);
userApi.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

backApi.interceptors.request.use(requestInterceptor);
backApi.interceptors.response.use(responseInterceptor, responseErrorInterceptor);
