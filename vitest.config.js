import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.test.js'],
    setupFiles: ['tests/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/api/**/*.js', 'src/composables/**/*.js', 'src/services/**/*.js', 'src/store/**/*.js', 'src/utils/**/*.js'],
      exclude: ['src/types/**'],
      thresholds: { lines: 60, functions: 60, statements: 60, branches: 50 },
    },
  },
});
