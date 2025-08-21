import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { registerPlugins } from './plugins';
import './assets/main.css'; // Global styles
// import { useThemeStore } from './stores/theme'; // No longer needed for direct initialization

const app = createApp(App);
const pinia = createPinia();

registerPlugins(app); // Vuetify, VeeValidate

app.use(pinia);

// The theme is now initialized directly by Vuetify's configuration in src/plugins/vuetify.js
// based on localStorage. The store's initializeTheme action is no longer needed here.
// const themeStore = useThemeStore();
// themeStore.initializeTheme();

app.use(router);

app.mount('#app');