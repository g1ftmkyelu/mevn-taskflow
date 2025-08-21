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
    defaultTheme: localStorage.getItem('theme') || 'light', // Dynamically set default theme
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
      dark: {
        colors: {
          primary: '#66BB6A', // Lighter Green for dark mode primary
          secondary: '#4CAF50', // Slightly darker green
          accent: '#CCFF90', // Lighter Lime A200
          error: '#EF5350',
          info: '#42A5F5',
          success: '#66BB6A',
          warning: '#FFCA28',
          background: '#121212', // Dark background
          surface: '#1E1E1E', // Darker surface for cards/components
        },
      },
    },
  },
});