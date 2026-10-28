'use strict';

module.exports = {
    preset: '@react-native/jest-preset',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    testTimeout: 30_000,
    testMatch: ['<rootDir>/App.test.tsx', '<rootDir>/src/**/*.test.{ts,tsx}'],
    collectCoverageFrom: [
        'App.tsx',
        'src/**/*.{ts,tsx}',
        '!src/**/*.test.{ts,tsx}',
        '!src/testing/**',
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
