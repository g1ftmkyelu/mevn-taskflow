import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { registerPlugins } from './plugins';
import './assets/main.css'; // Global styles

const app = createApp(App);
const pinia = createPinia();

registerPlugins(app); // Vuetify, VeeValidate

app.use(pinia);
app.use(router);

app.mount('#app');