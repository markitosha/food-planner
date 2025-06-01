const baseConfig = require('./jest.config');

module.exports = {
  ...baseConfig,
  testMatch: ['**/__tests__/**/*.integration.test.ts'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ],
  // Unit tests should be fast, so we can use a shorter timeout
  testTimeout: 5000,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/stack$': '<rootDir>/src/__mocks__/@/stack.ts',
    '^@/db/utils/getDatabase$': '<rootDir>/src/__mocks__/@/db/utils/getDatabase.ts'
  }
}; 