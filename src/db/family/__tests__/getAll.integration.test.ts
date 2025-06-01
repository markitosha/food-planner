import { neon } from '@neondatabase/serverless';
import { resetDatabase } from '@/db/__tests__/setup';
import { getAllFamilies } from '../getAll';

// Use test database URL from environment variable
const sql = neon(process.env.TEST_DATABASE_URL!);

describe('getAllFamilies', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it('should return empty array when no families exist', async () => {
    const families = await getAllFamilies();
    expect(families).toEqual([]);
  });

  it('should return all families', async () => {
    // Insert test data
    await sql`
      INSERT INTO families (name) VALUES 
        ('Smith Family'),
        ('Johnson Family'),
        ('Williams Family')
    `;

    const families = await getAllFamilies();
    
    expect(families).toHaveLength(3);
    expect(families).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Smith Family' }),
        expect.objectContaining({ name: 'Johnson Family' }),
        expect.objectContaining({ name: 'Williams Family' })
      ])
    );
  });

  it('should return families in correct format', async () => {
    // Insert a single family
    await sql`
      INSERT INTO families (name) VALUES ('Smith Family')
    `;

    const families = await getAllFamilies();
    
    expect(families[0]).toEqual({
      id: expect.any(Number),
      name: 'Smith Family'
    });
  });

  it('should handle families with special characters', async () => {
    // Insert families with special characters
    await sql`
      INSERT INTO families (name) VALUES 
        ('O''Connor Family'),
        ('D''Angelo Family'),
        ('Müller Family')
    `;

    const families = await getAllFamilies();
    
    expect(families).toHaveLength(3);
    expect(families).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: `O'Connor Family` }),
        expect.objectContaining({ name: `D'Angelo Family` }),
        expect.objectContaining({ name: 'Müller Family' })
      ])
    );
  });
}); 