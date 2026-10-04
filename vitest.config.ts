import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./tests/setup.ts'],
    globals: true,
    exclude: ['node_modules', 'dist', '**/*.js', '**/*.spec.ts'],
    fileParallelism: false,
    environmentMatchGlobs: [
      ['src/views/**', 'jsdom'],
      ['src/components/**', 'jsdom'],
      ['tests/**/*.tsx', 'jsdom'],
      ['tests/**/*.ts', 'node'],
      ['src/services/**', 'node'],
      ['src/utils/**', 'node']
    ],
    poolOptions: {
      threads: {
        singleThread: true
      }
    }
  },
});
