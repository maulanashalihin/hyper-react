export default [
  {
    test: {
      name: 'backend',
      globals: true,
      environment: 'node',
      include: ['backend/tests/**/*.test.ts'],
      setupFiles: ['./backend/tests/setup.ts'],
      globalSetup: ['./backend/tests/globalSetup.ts'],
      testTimeout: 10000,
      hookTimeout: 10000,
      pool: 'threads',
      maxWorkers: 1,
    },
  },
  {
    test: {
      name: 'frontend',
      globals: true,
      environment: 'jsdom',
      include: ['app/tests/**/*.test.tsx'],
      setupFiles: ['./app/tests/setup.ts'],
      testTimeout: 10000,
      hookTimeout: 10000,
      pool: 'threads',
      maxWorkers: 1,
    },
  },
] satisfies any;
