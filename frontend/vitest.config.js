import { fileURLToPath } from 'node:url';
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      globals: true,
      setupFiles: './tests/unit/setup.js',
      coverage: {
        reporter: ['text', 'json', 'html'],
        exclude: ['node_modules/', 'src/plugins/', 'src/main.js', 'src/router/index.js']
      }
    }
  })
);