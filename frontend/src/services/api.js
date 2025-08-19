import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import router from '@/router';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors, especially 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const authStore = useAuthStore();
    if (error.response && error.response.status === 401 && authStore.isAuthenticated) {
      // If 401 and user was authenticated, token might be expired or invalid
      authStore.logout(); // Clear auth state
      router.push({ name: 'login', query: { sessionExpired: true } }); // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;