import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jest-environment-jsdom',
  roots: ['<rootDir>/src'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
        useESM: true,
        diagnostics: false,
        astTransformers: {
          before: ['<rootDir>/src/importMetaTransformer.ts'],
        },
      },
    ],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|avif|ico|bmp|tiff?)$': '<rootDir>/src/__mocks__/fileMock.ts',
    '\\.svg$': '<rootDir>/src/__mocks__/svgMock.tsx',
  },
  setupFiles: ['<rootDir>/src/setupImportMeta.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/types/**',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
    '!src/**/__mocks__/**',
    '!src/**/mocks/**',
    '!src/**/types/**',
    '!src/setupTests.ts',
    '!src/setupImportMeta.ts',
    '!src/setupGlobals.ts',
    '!src/test-utils.tsx',
    '!src/test-environment.ts',
    '!src/importMetaTransformer.ts',
    '!src/components/common/DataGrid/DataGrid.tsx',
    '!src/components/common/ExportButton/ExportButton.tsx',
    '!src/**/alternativeMockDataApi.ts',
    '!src/**/capitalCallMock.ts',
    '!src/**/alternativeDataMock.ts',
    '!src/**/constants.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 60,
      statements: 60,
    },
  },
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}', '**/*.test.{ts,tsx}'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};

export default config;
