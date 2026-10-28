'use strict';

module.exports = {
    preset: '@react-native/jest-preset',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    testTimeout: 30_000,
    testMatch: ['<rootDir>/__tests__/**/*.test.{ts,tsx}'],
    collectCoverageFrom: [
        'App.tsx',
        'src/**/*.{ts,tsx}',
    ],
    coverageThreshold: {
        global: {
            statements: 100,
            branches: 100,
            functions: 100,
            lines: 100,
        },
    },
};
