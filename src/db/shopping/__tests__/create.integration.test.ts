import { neon } from '@neondatabase/serverless';
import { resetDatabase } from '@/db/__tests__/setup';
import { createShoppingList } from '../create';

// Use test database URL from environment variable
const sql = neon(process.env.TEST_DATABASE_URL!);

describe('createShoppingList Integration Test', () => {
  let familyId: number;
  let mealPlanId: number;
  let recipeId: number;
  let recipeVariantId: number;
  let productId: number;
  let unitId: number;

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

    // Create a product
    const productResult = await sql`
      INSERT INTO products (name)
      VALUES ('Test Product')
      RETURNING id
    `;
    productId = productResult[0].id;

    // Create a unit
    const unitResult = await sql`
      INSERT INTO units (name)
      VALUES ('g')
      RETURNING id
    `;
    unitId = unitResult[0].id;

    // Create an ingredient
    await sql`
      INSERT INTO ingredients (recipe_variant_id, product_id, unit_id, amount)
      VALUES (${recipeVariantId}, ${productId}, ${unitId}, '100')
    `;

    // Create a meal
    await sql`
      INSERT INTO meals (meal_plan_id, recipe_variant_id)
      VALUES (${mealPlanId}, ${recipeVariantId})
    `;
  });

  it('should create a shopping list from meal plan ingredients', async () => {
    const result = await createShoppingList(mealPlanId.toString());

    expect(result).toBeDefined();

    // Verify shopping list was created
    const shoppingList = await sql`
      SELECT products.name, shopping.amount, shopping.checked, shopping.deleted
      FROM shopping
      JOIN products ON shopping.product_id = products.id
      WHERE shopping.meal_plan_id = ${mealPlanId}
    `;

    expect(shoppingList).toHaveLength(1);
    expect(shoppingList[0]).toMatchObject({
      name: 'Test Product',
      amount: '100 g',
      checked: false,
      deleted: false,
    });
  });

  it('should handle multiple ingredients for the same product', async () => {
    // Add another ingredient with the same product
    await sql`
      INSERT INTO ingredients (recipe_variant_id, product_id, unit_id, amount)
      VALUES (${recipeVariantId}, ${productId}, ${unitId}, '200')
    `;

    await createShoppingList(mealPlanId.toString());

    const shoppingList = await sql`
      SELECT products.name, shopping.amount, shopping.checked, shopping.deleted
      FROM shopping
      JOIN products ON shopping.product_id = products.id
      WHERE shopping.meal_plan_id = ${mealPlanId}
    `;

    expect(shoppingList).toHaveLength(1);
    expect(shoppingList[0].amount).toBe('300 g'); // 100g + 200g
  });

  it('should handle multiple products', async () => {
    // Create another product and ingredient
    const product2Result = await sql`
      INSERT INTO products (name)
      VALUES ('Test Product 2')
      RETURNING id
    `;
    const product2Id = product2Result[0].id;

    await sql`
      INSERT INTO ingredients (recipe_variant_id, product_id, unit_id, amount)
      VALUES (${recipeVariantId}, ${product2Id}, ${unitId}, '150')
    `;

    await createShoppingList(mealPlanId.toString());

    const shoppingList = await sql`
      SELECT products.name, shopping.amount, shopping.checked, shopping.deleted
      FROM shopping
      JOIN products ON shopping.product_id = products.id
      WHERE shopping.meal_plan_id = ${mealPlanId}
      ORDER BY products.name
    `;

    expect(shoppingList).toHaveLength(2);
    expect(shoppingList[0]).toMatchObject({
      name: 'Test Product',
      amount: '100 g',
    });
    expect(shoppingList[1]).toMatchObject({
      name: 'Test Product 2',
      amount: '150 g',
    });
  });

  it('should handle non-existent meal plan', async () => {
    await expect(createShoppingList('999999')).resolves.toEqual([]);
  });

  it('should handle database errors gracefully', async () => {
    // Simulate a database error by dropping the shopping table
    await sql`DROP TABLE shopping CASCADE`;

    await expect(createShoppingList(mealPlanId.toString())).rejects.toThrow();
  });
});
