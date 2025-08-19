/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify';
// import { loadFonts } from './webfontloader'; // Removed as fonts are loaded via CDN in index.html

export function registerPlugins (app) {
  // loadFonts(); // Removed as fonts are loaded via CDN in index.html
  app.use(vuetify);
}