import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ['**/presentation/controllers/**/*.e2e-spec.ts'],
    exclude: ['**/*.spec.ts', 'node_modules'],
    globals: true,
    setupFiles: ['./test/setup-e2e.ts'],
    testTimeout: 60000, // 60 segundos para operações de banco
    fileParallelism: false, // Desabilita paralelismo entre arquivos
  },
});