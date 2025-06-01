import { neon } from '@neondatabase/serverless';

// Mock for getDatabase to connect to a test database in integration tests
const getDatabase = jest.fn().mockImplementation(async () => {
  return neon(process.env.TEST_DATABASE_URL!);
});

export default getDatabase;
