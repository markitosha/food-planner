import { neon } from '@neondatabase/serverless';
import { resetDatabase } from '@/db/__tests__/setup';
import { updateShoppingList } from '../update';

// Use test database URL from environment variable
const sql = neon(process.env.TEST_DATABASE_URL!);

describe('updateShoppingList Integration Test', () => {
  let familyId: number;
  let mealPlanId: number;
  let productId: number;
  let shoppingId: number;

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

    // Create a unit
    await sql`
      INSERT INTO units (name)
      VALUES ('g')
    `;

    // Create a shopping list item
    const shoppingResult = await sql`
      INSERT INTO shopping (meal_plan_id, product_id, amount, checked, deleted)
      VALUES (${mealPlanId}, ${productId}, '100 g', false, false)
      RETURNING id
    `;
    shoppingId = shoppingResult[0].id;
  });

  it('should update shopping list item', async () => {
    const result = await updateShoppingList({
      id: shoppingId,
      checked: true,
      deleted: false,
    });

    expect(result.status).toBe('success');

    // Verify the update
    const updatedItem = await sql`
      SELECT amount, checked, deleted
      FROM shopping
      WHERE id = ${shoppingId}
    `;

    expect(updatedItem[0].checked).toBe(true);
    expect(updatedItem[0].deleted).toBe(false);
  });

  it('should handle non-existent item', async () => {
    const result = await updateShoppingList({
      id: 999999,
      checked: true,
      deleted: false,
    });

    expect(result.status).toBe('success'); // No error for non-existent item
  });

  it('should handle database errors gracefully', async () => {
    // Simulate a database error by dropping the shopping table
    await sql`DROP TABLE shopping CASCADE`;

    const result = await updateShoppingList({
      id: shoppingId,
      checked: true,
      deleted: false,
    });

    expect(result.status).toBe('error');
    expect(result.error).toBeDefined();
  });
});
