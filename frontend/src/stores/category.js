import { defineStore } from 'pinia';
import api from '@/services/api';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    loading: false,
    error: null
  }),
  actions: {
    async fetchCategories() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/categories');
        this.categories = response.data.categories;
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch categories.';
        return false;
      } finally {
        this.loading = false;
      }
    },
    async addCategory(newCategory) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post('/categories', newCategory);
        this.categories.push(response.data.category);
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to add category.';
        return false;
      } finally {
        this.loading = false;
      }
    },
    async updateCategory(id, updatedData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.put(`/categories/${id}`, updatedData);
        const index = this.categories.findIndex(category => category._id === id);
        if (index !== -1) {
          this.categories[index] = response.data.category;
        }
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to update category.';
        return false;
      } finally {
        this.loading = false;
      }
    },
    async deleteCategory(id) {
      this.loading = true;
      this.error = null;
      try {
        await api.delete(`/categories/${id}`);
        this.categories = this.categories.filter(category => category._id !== id);
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to delete category.';
        return false;
      } finally {
        this.loading = false;
      }
    },
    getCategoryById(id) {
      return this.categories.find(category => category._id === id);
    },
    clearError() {
      this.error = null;
    }
  }
});