import { neon } from '@neondatabase/serverless';
import { resetDatabase } from '@/db/__tests__/setup';
import { getMeals } from '../getAll';

// Use test database URL from environment variable
const sql = neon(process.env.TEST_DATABASE_URL!);

describe('getMeals Integration Test', () => {
  let familyId: number;
  let mealPlanId: number;
  let recipeId: number;
  let recipeVariantId: number;

  beforeEach(async () => {
    await resetDatabase();

    // Create a family
    const familyResult = await sql`
      INSERT INTO families (name)
      VALUES ('Test Family')
      RETURNING id
    `;
    familyId = familyResult[0].id;

    // Create a meal plan
    const mealPlanResult = await sql`
      INSERT INTO meal_plans (name, family_id)
      VALUES ('Test Meal Plan', ${familyId})
      RETURNING id
    `;
    mealPlanId = mealPlanResult[0].id;

    // Create a recipe
    const recipeResult = await sql`
      INSERT INTO recipes (name, description, family_id)
      VALUES ('Test Recipe', 'Test Description', ${familyId})
      RETURNING id
    `;
    recipeId = recipeResult[0].id;

    // Create a recipe variant
    const variantResult = await sql`
      INSERT INTO recipe_variants (recipe_id, variant_name)
      VALUES (${recipeId}, '2 People')
      RETURNING id
    `;
    recipeVariantId = variantResult[0].id;

    // Create a meal
    await sql`
      INSERT INTO meals (meal_plan_id, recipe_variant_id)
      VALUES (${mealPlanId}, ${recipeVariantId})
    `;
  });

  it('should get meals for a meal plan', async () => {
    const meals = await getMeals(mealPlanId.toString());

    expect(meals).toHaveLength(1);
    expect(meals[0]).toMatchObject({
      id: expect.any(Number),
      recipe_variant_id: recipeVariantId,
      variant: '2 People',
      recipe_id: recipeId,
      name: 'Test Recipe',
      description: 'Test Description',
    });
  });

  it('should return empty array for non-existent meal plan', async () => {
    const meals = await getMeals('999999');

    expect(meals).toHaveLength(0);
  });

  it('should get multiple meals for a meal plan', async () => {
    // Create another recipe and variant
    const recipe2Result = await sql`
      INSERT INTO recipes (name, description, family_id)
      VALUES ('Test Recipe 2', 'Test Description 2', ${familyId})
      RETURNING id
    `;
    const recipe2Id = recipe2Result[0].id;

    const variant2Result = await sql`
      INSERT INTO recipe_variants (recipe_id, variant_name)
      VALUES (${recipe2Id}, '4 People')
      RETURNING id
    `;
    const variant2Id = variant2Result[0].id;

    // Create another meal
    await sql`
      INSERT INTO meals (meal_plan_id, recipe_variant_id)
      VALUES (${mealPlanId}, ${variant2Id})
    `;

    const meals = await getMeals(mealPlanId.toString());

    expect(meals).toHaveLength(2);
    expect(meals).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Test Recipe',
          variant: '2 People',
        }),
        expect.objectContaining({
          name: 'Test Recipe 2',
          variant: '4 People',
        }),
      ]),
    );
  });

  it('should handle database errors gracefully', async () => {
    // Simulate a database error by dropping the meals table
    await sql`DROP TABLE meals CASCADE`;

    await expect(getMeals(mealPlanId.toString())).rejects.toThrow();
  });
});
