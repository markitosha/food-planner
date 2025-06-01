const baseConfig = require('./jest.config');

module.exports = {
  ...baseConfig,
  testMatch: ['**/__tests__/**/*.test.ts'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '.*\\.integration\\.test\\.ts$' // Ignore integration tests
  ],
  // Unit tests should be fast, so we can use a shorter timeout
  testTimeout: 5000,
}; 