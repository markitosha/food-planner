import { neon } from '@neondatabase/serverless';
import { resetDatabase } from '@/db/__tests__/setup';
import { updateRecipe } from '../update';
import { revalidatePath } from 'next/cache';
import getDatabase from '@/db/utils/getDatabase';

// Use test database URL from environment variable
const sql = neon(process.env.TEST_DATABASE_URL!);

describe('updateRecipe', () => {
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

  it('should update recipe name', async () => {
    // Create a recipe
    const recipe = await sql`
      INSERT INTO recipes (name, description, family_id, public)
      VALUES ('Old Name', 'Old Description', ${familyId}, true)
      RETURNING id
    `;

    const result = await updateRecipe({
      recipeId: recipe[0].id,
      name: 'New Name'
    });

    expect(result.status).toBe('success');
    expect(revalidatePath).toHaveBeenCalledWith(`/recipes/${recipe[0].id}`);
    expect(revalidatePath).toHaveBeenCalledWith('/recipes');
    expect(revalidatePath).toHaveBeenCalledWith('/plans');

    // Verify update in database
    const updatedRecipe = await sql`
      SELECT * FROM recipes WHERE id = ${recipe[0].id}
    `;
    expect(updatedRecipe[0].name).toBe('New Name');
    expect(updatedRecipe[0].description).toBe('Old Description');
  });

  it('should update recipe description', async () => {
    // Create a recipe
    const recipe = await sql`
      INSERT INTO recipes (name, description, family_id, public)
      VALUES ('Test Recipe', 'Old Description', ${familyId}, true)
      RETURNING id
    `;

    const result = await updateRecipe({
      recipeId: recipe[0].id,
      description: 'New Description'
    });

    expect(result.status).toBe('success');
    expect(revalidatePath).toHaveBeenCalledWith(`/recipes/${recipe[0].id}`);
    expect(revalidatePath).toHaveBeenCalledWith('/recipes');
    expect(revalidatePath).toHaveBeenCalledWith('/plans');

    // Verify update in database
    const updatedRecipe = await sql`
      SELECT * FROM recipes WHERE id = ${recipe[0].id}
    `;
    expect(updatedRecipe[0].name).toBe('Test Recipe');
    expect(updatedRecipe[0].description).toBe('New Description');
  });

  it('should update both name and description', async () => {
    // Create a recipe
    const recipe = await sql`
      INSERT INTO recipes (name, description, family_id, public)
      VALUES ('Old Name', 'Old Description', ${familyId}, true)
      RETURNING id
    `;

    const result = await updateRecipe({
      recipeId: recipe[0].id,
      name: 'New Name',
      description: 'New Description'
    });

    expect(result.status).toBe('success');
    expect(revalidatePath).toHaveBeenCalledWith(`/recipes/${recipe[0].id}`);
    expect(revalidatePath).toHaveBeenCalledWith('/recipes');
    expect(revalidatePath).toHaveBeenCalledWith('/plans');

    // Verify update in database
    const updatedRecipe = await sql`
      SELECT * FROM recipes WHERE id = ${recipe[0].id}
    `;
    expect(updatedRecipe[0].name).toBe('New Name');
    expect(updatedRecipe[0].description).toBe('New Description');
  });

  it('should handle database errors gracefully', async () => {
    // Mock database error
    (getDatabase as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

    const result = await updateRecipe({
      recipeId: 1,
      name: 'New Name'
    });

    expect(result).toEqual({
      data: null,
      status: 'error',
      error: 'Couldn\'t update recipe: Database error'
    });
  });
}); 