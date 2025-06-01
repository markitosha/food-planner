import { neon } from '@neondatabase/serverless';
import { resetDatabase } from '@/db/__tests__/setup';
import { getFamilyById } from '../getById';

// Use test database URL from environment variable
const sql = neon(process.env.TEST_DATABASE_URL!);

describe('getFamilyById', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it('should return null when family does not exist', async () => {
    const family = await getFamilyById('999');
    expect(family).toBeUndefined();
  });

  it('should return family by id', async () => {
    // Insert test data
    const result = await sql`
      INSERT INTO families (name) 
      VALUES ('Smith Family')
      RETURNING id
    `;
    const id = result[0].id;

    const family = await getFamilyById(id.toString());
    
    expect(family).toEqual({
      id: expect.any(Number),
      name: 'Smith Family'
    });
  });

  it('should handle special characters in family name', async () => {
    // Insert test data with special characters
    const result = await sql`
      INSERT INTO families (name) 
      VALUES ('O''Connor Family')
      RETURNING id
    `;
    const id = result[0].id;

    const family = await getFamilyById(id.toString());
    
    expect(family).toEqual({
      id: expect.any(Number),
      name: `O'Connor Family`
    });
  });
}); 