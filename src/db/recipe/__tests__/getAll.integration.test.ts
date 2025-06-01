import { neon } from '@neondatabase/serverless';
import { resetDatabase } from '@/db/__tests__/setup';
import { getAllRecipes } from '../getAll';
import getDatabase from '@/db/utils/getDatabase';

// Use test database URL from environment variable
const sql = neon(process.env.TEST_DATABASE_URL!);

describe('getAllRecipes', () => {
  let familyId: number;

  beforeEach(async () => {
    await resetDatabase();

    // Create a family for testing
    const family = await sql`
      INSERT INTO families (name)
      VALUES ('Test Family')
      RETURNING id
    `;
    familyId = family[0].id;
  });

  it('should return empty array when no recipes exist', async () => {
    const result = await getAllRecipes();
    expect(result).toEqual({
      data: [],
      status: 'success'
    });
  });

  it('should return all recipes with variant count', async () => {
    // Create a recipe
    const recipe = await sql`
      INSERT INTO recipes (name, description, family_id, public)
      VALUES ('Test Recipe', 'Test Description', ${familyId}, true)
      RETURNING id
    `;

    // Add a variant
    await sql`
      INSERT INTO recipe_variants (recipe_id, variant_name)
      VALUES (${recipe[0].id}, 'Test Variant')
    `;

    const result = await getAllRecipes();
    expect(result.status).toBe('success');
    expect(result.data).toHaveLength(1);
    expect(result.data[0]).toEqual({
      id: recipe[0].id,
      name: 'Test Recipe',
      description: 'Test Description',
      image_url: null,
      variant_count: '1'
    });
  });

  it('should handle database errors gracefully', async () => {
    // Mock database error
    (getDatabase as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

    const result = await getAllRecipes();
    expect(result).toEqual({
      data: [],
      status: 'error',
      error: 'Couldn\'t load recipes: Database error'
    });
  });
}); 