import { neon } from '@neondatabase/serverless';
import { resetDatabase } from '@/db/__tests__/setup';
import { deleteRecipe } from '../delete';
import { revalidatePath } from 'next/cache';
import getDatabase from '@/db/utils/getDatabase';

// Use test database URL from environment variable
const sql = neon(process.env.TEST_DATABASE_URL!);

describe('deleteRecipe', () => {
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

  it('should delete recipe and return deleted data', async () => {
    // Create a recipe
    const recipe = await sql`
      INSERT INTO recipes (name, description, family_id, public)
      VALUES ('Test Recipe', 'Test Description', ${familyId}, true)
      RETURNING id
    `;

    const result = await deleteRecipe(recipe[0].id);
    expect(result.status).toBe('success');
    expect(result.data).toEqual({
      id: recipe[0].id,
      family_id: familyId,
      public: true,
      hf_json: null,
      name: 'Test Recipe',
      description: 'Test Description',
      image_url: null
    });
    expect(revalidatePath).toHaveBeenCalledWith('/recipes');

    // Verify recipe was deleted
    const deletedRecipe = await sql`
      SELECT * FROM recipes WHERE id = ${recipe[0].id}
    `;
    expect(deletedRecipe).toHaveLength(0);
  });

  it('should return null when recipe does not exist', async () => {
    const result = await deleteRecipe(999);
    expect(result).toEqual({
      data: null,
      status: 'success'
    });
    expect(revalidatePath).toHaveBeenCalledWith('/recipes');
  });

  it('should handle database errors gracefully', async () => {
    // Mock database error
    (getDatabase as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

    const result = await deleteRecipe(1);
    expect(result).toEqual({
      data: null,
      status: 'error',
      error: 'Couldn\'t delete recipe: Database error'
    });
  });
}); 