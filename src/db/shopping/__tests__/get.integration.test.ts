import { neon } from '@neondatabase/serverless';

import { resetDatabase } from '@/db/__tests__/setup';

import { getShoppingList } from '../get';

// Use test database URL from environment variable
const sql = neon(process.env.TEST_DATABASE_URL!);

describe('getShoppingList Integration Test', () => {
  let familyId: number;
  let mealPlanId: number;
  let productId: number;

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

    // Create a product
    const productResult = await sql`
      INSERT INTO products (name)
      VALUES ('Test Product')
      RETURNING id
    `;
    productId = productResult[0].id;

    // Create a shopping list item
    await sql`
      INSERT INTO shopping (meal_plan_id, product_id, amount, checked, deleted)
      VALUES (${mealPlanId}, ${productId}, '100 g', false, false)
    `;
  });

  it('should get shopping list items', async () => {
    const shoppingList = await getShoppingList(mealPlanId.toString());

    expect(shoppingList).toHaveLength(1);
    expect(shoppingList[0]).toMatchObject({
      name: 'Test Product',
      amount: '100 g',
      checked: false,
      deleted: false,
    });
  });

  it('should order items by checked status and name', async () => {
    // Create another product and shopping item
    const product2Result = await sql`
      INSERT INTO products (name)
      VALUES ('Another Product')
      RETURNING id
    `;
    const product2Id = product2Result[0].id;

    await sql`
      INSERT INTO shopping (meal_plan_id, product_id, amount, checked, deleted)
      VALUES (${mealPlanId}, ${product2Id}, '200 g', true, false)
    `;

    const shoppingList = await getShoppingList(mealPlanId.toString());

    expect(shoppingList).toHaveLength(2);
    expect(shoppingList[0].checked).toBe(false);
    expect(shoppingList[1].checked).toBe(true);
    expect(shoppingList[0].name).toBe('Test Product');
    expect(shoppingList[1].name).toBe('Another Product');
  });

  it('should not return deleted items', async () => {
    // Mark the item as deleted
    await sql`
      UPDATE shopping
      SET deleted = true
      WHERE meal_plan_id = ${mealPlanId}
    `;

    const shoppingList = await getShoppingList(mealPlanId.toString());
    expect(shoppingList).toHaveLength(0);
  });

  it('should return empty array for non-existent meal plan', async () => {
    const shoppingList = await getShoppingList('999999');
    expect(shoppingList).toHaveLength(0);
  });

  it('should handle database errors gracefully', async () => {
    // Simulate a database error by dropping the shopping table
    await sql`DROP TABLE shopping CASCADE`;

    await expect(getShoppingList(mealPlanId.toString())).rejects.toThrow();
  });
});
