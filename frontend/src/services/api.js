import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

// Create a reusable Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request Interceptor: Attach JWT Token securely if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors globally, auto-logout on 401 Unauthorized
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If the server responds with 401 Unauthorized, token is expired or invalid
    if (error.response && error.response.status === 401) {
      // Check if we are not already on the login page
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        
        // Dispatch custom event so AuthContext can update state immediately without hard refresh
        window.dispatchEvent(new Event('cloudvault:auth-unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
