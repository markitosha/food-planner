import { neon } from '@neondatabase/serverless';
import { resetDatabase } from '@/db/__tests__/setup';
import { getRecipeById } from '../getById';
import getDatabase from '@/db/utils/getDatabase';

// Use test database URL from environment variable
const sql = neon(process.env.TEST_DATABASE_URL!);

describe('getRecipeById', () => {
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

  it('should return nothing when recipe does not exist', async () => {
    const result = await getRecipeById('999');
    expect(result).toEqual({
      data: {
        variants: [],
        steps: [],
      },
      status: 'success',
    });
  });

  it('should return recipe with steps and variants', async () => {
    // Create a recipe
    const recipe = await sql`
      INSERT INTO recipes (name, description, family_id, public)
      VALUES ('Test Recipe', 'Test Description', ${familyId}, true)
      RETURNING id
    `;

    // Add steps
    await sql`
      INSERT INTO steps (recipe_id, step_index, instruction)
      VALUES 
        (${recipe[0].id}, 1, 'Step 1'),
        (${recipe[0].id}, 2, 'Step 2')
    `;

    // Add variants
    await sql`
      INSERT INTO recipe_variants (recipe_id, variant_name)
      VALUES 
        (${recipe[0].id}, 'Variant 1'),
        (${recipe[0].id}, 'Variant 2')
    `;

    const result = await getRecipeById(recipe[0].id.toString());
    expect(result.status).toBe('success');
    expect(result.data).toEqual({
      id: recipe[0].id,
      name: 'Test Recipe',
      description: 'Test Description',
      image_url: null,
      steps: [
        {
          id: expect.any(Number),
          recipe_id: recipe[0].id,
          step_index: 1,
          instruction: 'Step 1',
          image_url: null,
        },
        {
          id: expect.any(Number),
          recipe_id: recipe[0].id,
          step_index: 2,
          instruction: 'Step 2',
          image_url: null,
        },
      ],
      variants: [
        {
          id: expect.any(Number),
          recipe_id: recipe[0].id,
          variant_name: 'Variant 1',
        },
        {
          id: expect.any(Number),
          recipe_id: recipe[0].id,
          variant_name: 'Variant 2',
        },
      ],
    });
  });

  it('should handle database errors gracefully', async () => {
    // Mock database error by using invalid table name
    (getDatabase as jest.Mock).mockRejectedValueOnce(
      new Error('Database error'),
    );

    const result = await getRecipeById('1');
    expect(result).toEqual({
      data: null,
      status: 'error',
      error: "Couldn't load recipe: Database error",
    });
  });
});
