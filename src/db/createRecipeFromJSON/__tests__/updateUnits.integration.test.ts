import { neon } from '@neondatabase/serverless';

import { resetDatabase } from '@/db/__tests__/setup';
import getDatabase from '@/db/utils/getDatabase';

import { HFRecipe } from '../createRecipeFromJSON';
import updateUnits from '../updateUnits';

// Use test database URL from environment variable
const sql = neon(process.env.TEST_DATABASE_URL!);

describe('updateUnits', () => {
  const mockRecipe: HFRecipe = {
    name: 'Test Recipe',
    headline: 'Test Headline',
    imagePath: '/test-image.jpg',
    yields: [
      {
        yields: 2,
        ingredients: [
          { id: 'ing1', unit: 'g', amount: 100 },
          { id: 'ing2', unit: 'ml', amount: 200 },
        ],
      },
    ],
    ingredients: [],
    steps: [],
  };

  beforeEach(async () => {
    await resetDatabase();
  });

  it('should create new units', async () => {
    const units = await updateUnits(mockRecipe);

    expect(units.size).toBe(2);
    expect(units).toContain('g');
    expect(units).toContain('ml');

    // Verify units were created in database
    const dbUnits = await sql`
      SELECT * FROM units 
      WHERE name IN ('g', 'ml')
    `;
    expect(dbUnits).toHaveLength(2);
  });

  it('should not create duplicate units', async () => {
    // First insert
    await updateUnits(mockRecipe);

    // Second insert with same units
    const units = await updateUnits(mockRecipe);

    expect(units.size).toBe(2);

    // Verify only unique units exist
    const dbUnits = await sql`
      SELECT * FROM units 
      WHERE name IN ('g', 'ml')
    `;
    expect(dbUnits).toHaveLength(2);
  });

  it('should handle database errors gracefully', async () => {
    // Mock database error
    (getDatabase as jest.Mock).mockRejectedValueOnce(
      new Error('Database error'),
    );

    await expect(updateUnits(mockRecipe)).rejects.toThrow('Database error');
  });
});
