/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify';
import { loadFonts } from './webfontloader';

export function registerPlugins (app) {
  loadFonts();
  app.use(vuetify);
}