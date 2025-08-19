import { defineStore } from 'pinia';
import api from '@/services/api';

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [],
    loading: false,
    error: null
  }),
  actions: {
    async fetchTodos() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/todos');
        this.todos = response.data.todos;
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch todos.';
        return false;
      } finally {
        this.loading = false;
      }
    },
    async addTodo(newTodo) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post('/todos', newTodo);
        this.todos.unshift(response.data.todo); // Add to the beginning
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to add todo.';
        return false;
      } finally {
        this.loading = false;
      }
    },
    async updateTodo(id, updatedData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.put(`/todos/${id}`, updatedData);
        const index = this.todos.findIndex(todo => todo._id === id);
        if (index !== -1) {
          this.todos[index] = response.data.todo;
        }
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to update todo.';
        return false;
      } finally {
        this.loading = false;
      }
    },
    async deleteTodo(id) {
      this.loading = true;
      this.error = null;
      try {
        await api.delete(`/todos/${id}`);
        this.todos = this.todos.filter(todo => todo._id !== id);
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to delete todo.';
        return false;
      } finally {
        this.loading = false;
      }
    },
    getTodoById(id) {
      return this.todos.find(todo => todo._id === id);
    },
    clearError() {
      this.error = null;
    }
  }
});