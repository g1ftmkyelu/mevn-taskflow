import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: localStorage.getItem('theme') === 'dark'
  }),
  actions: {
    toggleTheme(theme) { // Accept theme instance as an argument
      this.isDark = !this.isDark;
      theme.global.name.value = this.isDark ? 'dark' : 'light';
      localStorage.setItem('theme', theme.global.name.value);
    }
  }
});