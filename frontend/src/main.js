import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { registerPlugins } from './plugins';
import './assets/main.css'; // Global styles
import { useThemeStore } from './stores/theme'; // Import the new theme store

const app = createApp(App);
const pinia = createPinia();

registerPlugins(app); // Vuetify, VeeValidate

app.use(pinia);

// Initialize theme from local storage after Pinia is available
const themeStore = useThemeStore();
themeStore.initializeTheme();

app.use(router);

app.mount('#app');