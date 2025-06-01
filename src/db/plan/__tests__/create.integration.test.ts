import { neon } from '@neondatabase/serverless';
import { resetDatabase } from '@/db/__tests__/setup';
import { createNewMealPlan } from '../create';
import getDatabase from '@/db/utils/getDatabase';
import { redirect } from 'next/navigation';

// Use test database URL from environment variable
const sql = neon(process.env.TEST_DATABASE_URL!);

describe('createNewMealPlan', () => {
  let familyId: number;
  let recipeId: number;
  let variantId: number;

  beforeEach(async () => {
    await resetDatabase();
    jest.clearAllMocks();

    // Create a family for testing
    const family = await sql`
      INSERT INTO families (name)
      VALUES ('Test Family')
      RETURNING id
    `;
    familyId = family[0].id;

    // Create a recipe
    const recipe = await sql`
      INSERT INTO recipes (name, description, family_id, public)
      VALUES ('Test Recipe', 'Test Description', ${familyId}, true)
      RETURNING id
    `;
    recipeId = recipe[0].id;

    // Create a variant
    const variant = await sql`
      INSERT INTO recipe_variants (recipe_id, variant_name)
      VALUES (${recipeId}, '2 People')
      RETURNING id
    `;
    variantId = variant[0].id;
  });

  it('should create a new meal plan with meals', async () => {
    const formData = new FormData();
    formData.append('name', 'Test Meal Plan');
    formData.append('description', 'Test Description');
    formData.append('family_id', familyId.toString());
    formData.append('recipes', recipeId.toString());

    await createNewMealPlan(formData);

    // Verify meal plan was created
    const mealPlan = await sql`
      SELECT * FROM meal_plans 
      WHERE name = 'Test Meal Plan' 
      AND description = 'Test Description' 
      AND family_id = ${familyId}
    `;
    expect(mealPlan).toHaveLength(1);

    // Verify meal was created
    const meal = await sql`
      SELECT * FROM meals 
      WHERE meal_plan_id = ${mealPlan[0].id} 
      AND recipe_variant_id = ${variantId}
    `;
    expect(meal).toHaveLength(1);

    // Verify redirect was called
    expect(redirect).toHaveBeenCalledWith('/');
  });

  it('should handle database errors gracefully', async () => {
    const formData = new FormData();
    formData.append('name', 'Test Meal Plan');
    formData.append('description', 'Test Description');
    formData.append('family_id', familyId.toString());
    formData.append('recipes', recipeId.toString());

    // Mock database error
    (getDatabase as jest.Mock).mockRejectedValueOnce(
      new Error('Database error'),
    );

    await expect(createNewMealPlan(formData)).rejects.toThrow('Database error');

    // Verify redirect was not called on error
    expect(redirect).not.toHaveBeenCalled();
  });
});
