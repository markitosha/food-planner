import { neon } from '@neondatabase/serverless';

import { resetDatabase } from '@/db/__tests__/setup';

import { getAllUnits } from '../getAll';

// Use test database URL from environment variable
const sql = neon(process.env.TEST_DATABASE_URL!);

describe('getAllUnits', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it('should return empty array when no units exist', async () => {
    const units = await getAllUnits();
    expect(units).toEqual([]);
  });

  it('should return all units when they exist', async () => {
    // Insert test data
    await sql`
      INSERT INTO units (name) VALUES 
        ('gram'),
        ('kilogram'),
        ('milliliter'),
        ('liter')
    `;

    const units = await getAllUnits();

    expect(units).toHaveLength(4);
    expect(units).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'gram' }),
        expect.objectContaining({ name: 'kilogram' }),
        expect.objectContaining({ name: 'milliliter' }),
        expect.objectContaining({ name: 'liter' }),
      ]),
    );
  });

  it('should return units in correct format', async () => {
    // Insert a single unit
    await sql`
      INSERT INTO units (name) VALUES ('gram')
    `;

    const units = await getAllUnits();

    expect(units[0]).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: 'gram',
      }),
    );
  });
});
