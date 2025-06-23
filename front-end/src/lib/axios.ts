import keycloak from '@/keycloak';
import axios from 'axios';
import { log } from 'console';



export const userApi = axios.create({
  baseURL: import.meta.env.VITE_USER_API_URL,
});


// Request interceptor for both instances
const requestInterceptor = (config: any) => {
  const token = keycloak.token;
  // Get the token from localStorage or your auth state management
  console.debug('token', `Bearer ${token}`) ;
  
  if (keycloak.authenticated) {
    config.headers.Authorization = "Bearer "  + token;
  }
  
  console.debug('config', config);  
  return config;
};


userApi.interceptors.request.use(requestInterceptor);
