import { defineStore } from 'pinia';
import api from '@/services/api';
import router from '@/router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  }),
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    currentUser: (state) => state.user
  },
  actions: {
    async register(username, email, password) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post('/auth/register', { username, email, password });
        this.setAuthData(response.data.user, response.data.token);
        router.push({ name: 'dashboard' }); // Redirect to dashboard
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || 'Registration failed. Please try again.';
        return false;
      } finally {
        this.loading = false;
      }
    },
    async login(email, password) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post('/auth/login', { email, password });
        this.setAuthData(response.data.user, response.data.token);
        router.push({ name: 'dashboard' }); // Redirect to dashboard
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || 'Login failed. Invalid credentials.';
        return false;
      } finally {
        this.loading = false;
      }
    },
    async fetchMe() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/users/me');
        this.user = response.data; // Update user data in store
        localStorage.setItem('user', JSON.stringify(this.user));
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch user profile.';
        return false;
      } finally {
        this.loading = false;
      }
    },
    async updateMe(userData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.put('/users/me', userData);
        this.user = response.data.user; // Update user data in store
        localStorage.setItem('user', JSON.stringify(this.user));
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to update profile.';
        return false;
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      router.push({ name: 'login' });
    },
    setAuthData(user, token) {
      this.user = user;
      this.token = token;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    },
    clearError() {
      this.error = null;
    }
  }
});