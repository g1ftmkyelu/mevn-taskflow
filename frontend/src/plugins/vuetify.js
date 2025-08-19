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
          primary: '#6200EE', // Deep Purple
          secondary: '#03DAC6', // Teal
          accent: '#FF4081', // Pink Accent
          error: '#B00020',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          background: '#F5F5F5', // Light Grey
          surface: '#FFFFFF', // White
        },
      },
    },
  },
});