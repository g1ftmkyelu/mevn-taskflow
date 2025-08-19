import { config } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { createPinia } from 'pinia';

// Mock Vuetify for testing
const vuetify = createVuetify({
  components,
  directives,
});

// Mock Pinia for testing
const pinia = createPinia();

config.global.plugins = [vuetify, pinia];
config.global.stubs = {
  'router-link': {
    template: '<a><slot /></a>',
    props: ['to']
  },
  'router-view': {
    template: '<div><slot /></div>'
  }
};