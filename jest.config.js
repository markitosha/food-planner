module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^server-only$': '<rootDir>/src/__mocks__/server-only.js'
  },
  // Common configuration for both unit and integration tests
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@stackframe)/)',
    '/dist/',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
  ],
}; 