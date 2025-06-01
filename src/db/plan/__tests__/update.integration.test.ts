import { neon } from '@neondatabase/serverless';
import { resetDatabase } from '@/db/__tests__/setup';
import { updateMealPlan } from '../update';
import getDatabase from '@/db/utils/getDatabase';
import { Meal } from '@/db/schema';

type MealWithRecipeId = Meal & {
  recipe_id: number;
};

// Use test database URL from environment variable
const sql = neon(process.env.TEST_DATABASE_URL!);

describe('updateMealPlan', () => {
  let familyId: number;
  let mealPlanId: number;
  let recipeId1: number;
  let recipeId2: number;
  let variantId1: number;
  let variantId2: number;
  let mealId: number;

  beforeEach(async () => {
    await resetDatabase();

    // Create a family for testing
    const family = await sql`
      INSERT INTO families (name)
      VALUES ('Test Family')
      RETURNING id
    `;
    familyId = family[0].id;

    // Create a meal plan
    const mealPlan = await sql`
      INSERT INTO meal_plans (name, description, family_id)
      VALUES ('Test Meal Plan', 'Test Description', ${familyId})
      RETURNING id
    `;
    mealPlanId = mealPlan[0].id;

    // Create recipes
    const recipe1 = await sql`
      INSERT INTO recipes (name, description, family_id, public)
      VALUES ('Test Recipe 1', 'Test Description 1', ${familyId}, true)
      RETURNING id
    `;
    recipeId1 = recipe1[0].id;

    const recipe2 = await sql`
      INSERT INTO recipes (name, description, family_id, public)
      VALUES ('Test Recipe 2', 'Test Description 2', ${familyId}, true)
      RETURNING id
    `;
    recipeId2 = recipe2[0].id;

    // Create variants
    const variant1 = await sql`
      INSERT INTO recipe_variants (recipe_id, variant_name)
      VALUES (${recipeId1}, '2 People')
      RETURNING id
    `;
    variantId1 = variant1[0].id;

    const variant2 = await sql`
      INSERT INTO recipe_variants (recipe_id, variant_name)
      VALUES (${recipeId2}, '2 People')
      RETURNING id
    `;
    variantId2 = variant2[0].id;

    // Create a meal
    const meal = await sql`
      INSERT INTO meals (meal_plan_id, recipe_variant_id)
      VALUES (${mealPlanId}, ${variantId1})
      RETURNING id
    `;
    mealId = meal[0].id;
  });

  it('should update meal plan and its meals', async () => {
    const formData = new FormData();
    formData.append('name', 'Updated Meal Plan');
    formData.append('description', 'Updated Description');
    formData.append('family_id', familyId.toString());
    formData.append('recipes', recipeId2.toString());

    const meals: MealWithRecipeId[] = [
      {
        id: mealId,
        meal_plan_id: mealPlanId,
        recipe_variant_id: variantId1,
        recipe_id: recipeId1,
      },
    ];

    await updateMealPlan(mealPlanId.toString(), formData, meals);

    // Verify meal plan was updated
    const updatedMealPlan = await sql`
      SELECT * FROM meal_plans 
      WHERE id = ${mealPlanId}
    `;
    expect(updatedMealPlan[0]).toEqual(
      expect.objectContaining({
        name: 'Updated Meal Plan',
        description: 'Updated Description',
        family_id: familyId,
      }),
    );

    // Verify old meal was removed
    const oldMeal = await sql`
      SELECT * FROM meals 
      WHERE meal_plan_id = ${mealPlanId} 
      AND recipe_variant_id = ${variantId1}
    `;
    expect(oldMeal).toHaveLength(0);

    // Verify new meal was added
    const newMeal = await sql`
      SELECT * FROM meals 
      WHERE meal_plan_id = ${mealPlanId} 
      AND recipe_variant_id = ${variantId2}
    `;
    expect(newMeal).toHaveLength(1);
  });

  it('should handle database errors gracefully', async () => {
    const formData = new FormData();
    formData.append('name', 'Updated Meal Plan');
    formData.append('description', 'Updated Description');
    formData.append('family_id', familyId.toString());
    formData.append('recipes', recipeId2.toString());

    const meals: MealWithRecipeId[] = [
      {
        id: mealId,
        meal_plan_id: mealPlanId,
        recipe_variant_id: variantId1,
        recipe_id: recipeId1,
      },
    ];

    // Mock database error
    (getDatabase as jest.Mock).mockRejectedValueOnce(
      new Error('Database error'),
    );

    await expect(
      updateMealPlan(mealPlanId.toString(), formData, meals),
    ).rejects.toThrow('Database error');
  });
});
