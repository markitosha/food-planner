// Mock for @/stack to bypass user management in integration tests
export const stackServerApp = {
  // Mock methods or properties you need
  tokenStore: 'nextjs-cookie',
  getUser: jest.fn().mockResolvedValue({
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
  }),
};
