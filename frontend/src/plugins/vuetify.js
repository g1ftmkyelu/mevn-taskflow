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
          primary: '#424242', // Dark Grey
          secondary: '#9E9E9E', // Medium Grey
          accent: '#00BFA5', // Muted Teal Accent
          error: '#D32F2F',
          info: '#1976D2',
          success: '#388E3C',
          warning: '#FBC02D',
          background: '#F5F5F5', // Very Light Grey
          surface: '#FFFFFF', // Pure White
        },
      },
    },
  },
});