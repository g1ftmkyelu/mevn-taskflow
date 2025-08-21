// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

// Composables
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#2E7D32', // Dark Green
          secondary: '#81C784', // Light Green
          accent: '#69F0AE', // Lime A200
          error: '#D32F2F',
          info: '#1976D2',
          success: '#388E3C',
          warning: '#FBC02D',
          background: '#F1F8E9', // Very Light Green
          surface: '#FFFFFF', // Pure White
        },
      },
    },
  },
});