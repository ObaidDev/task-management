import keycloak from '@/keycloak';
import axios from 'axios';
import { log } from 'console';



export const userApi = axios.create({
  baseURL: import.meta.env.VITE_USER_API_URL,
});


export const backApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
});


// Request interceptor for both instances
const requestInterceptor = (config: any) => {
  const token = keycloak.token;
  // Get the token from localStorage or your auth state management
    
  if (keycloak.authenticated) {
    config.headers.Authorization = "Bearer "  + token;
  }
  
  return config;
};


userApi.interceptors.request.use(requestInterceptor);

backApi.interceptors.request.use(requestInterceptor);
