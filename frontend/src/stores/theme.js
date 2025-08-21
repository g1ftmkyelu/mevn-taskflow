import { defineStore } from 'pinia';
import { useTheme } from 'vuetify';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: localStorage.getItem('theme') === 'dark'
  }),
  actions: {
    toggleTheme() {
      const theme = useTheme();
      this.isDark = !this.isDark;
      theme.global.name.value = this.isDark ? 'dark' : 'light';
      localStorage.setItem('theme', theme.global.name.value);
    },
    initializeTheme() {
      const theme = useTheme();
      theme.global.name.value = this.isDark ? 'dark' : 'light';
    }
  }
});