import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@aivo/contracts': path.resolve(__dirname, '../../packages/contracts/src'),
    },
  },
});
