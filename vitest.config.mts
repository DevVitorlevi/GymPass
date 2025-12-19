import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ['**/use-cases/**/*.spec.ts'],
    exclude: ['**/*.e2e-spec.ts', 'node_modules'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules',
        'build',
        '**/*.e2e-spec.ts',
        '**/generated/**',
      ],
    },
  },
});