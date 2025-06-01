import { neon } from '@neondatabase/serverless';
import { resetDatabase } from '@/db/__tests__/setup';
import { getIngredientsByVariant } from '../getAllByVariant';
import getDatabase from '@/db/utils/getDatabase';

// Use test database URL from environment variable
const sql = neon(process.env.TEST_DATABASE_URL!);

describe('getIngredientsByVariant', () => {
  let familyId: number;
  let recipeId: number;
  let variantId: number;
  let productId1: number;
  let productId2: number;
  let unitId: number;

  beforeEach(async () => {
    await resetDatabase();

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
      VALUES (${recipeId}, 'Test Variant')
      RETURNING id
    `;
    variantId = variant[0].id;

    // Create products
    const product1 = await sql`
      INSERT INTO products (name)
      VALUES ('Test Product 1')
      RETURNING id
    `;
    productId1 = product1[0].id;

    const product2 = await sql`
      INSERT INTO products (name)
      VALUES ('Test Product 2')
      RETURNING id
    `;
    productId2 = product2[0].id;

    // Create a unit
    const unit = await sql`
      INSERT INTO units (name)
      VALUES ('Test Unit')
      RETURNING id
    `;
    unitId = unit[0].id;

    // Create ingredients
    await sql`
      INSERT INTO ingredients (recipe_variant_id, product_id, unit_id, amount, comment)
      VALUES 
        (${variantId}, ${productId1}, ${unitId}, 1, 'Test comment 1'),
        (${variantId}, ${productId2}, ${unitId}, 2, 'Test comment 2')
    `;
  });

  it('should return ingredients for a variant with product and unit information', async () => {
    const result = await getIngredientsByVariant(variantId.toString());

    expect(result.status).toBe('success');
    expect(result.data).toHaveLength(2);
    expect(result.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          amount: '1.00',
          comment: 'Test comment 1',
          product_id: productId1,
          product: 'Test Product 1',
          unit_id: unitId,
          unit: 'Test Unit'
        }),
        expect.objectContaining({
          id: expect.any(Number),
          amount: '2.00',
          comment: 'Test comment 2',
          product_id: productId2,
          product: 'Test Product 2',
          unit_id: unitId,
          unit: 'Test Unit'
        })
      ])
    );
  });

  it('should return empty array for non-existent variant', async () => {
    const result = await getIngredientsByVariant('999999');

    expect(result.status).toBe('success');
    expect(result.data).toHaveLength(0);
  });

  it('should handle database errors gracefully', async () => {
    // Mock database error
    (getDatabase as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

    const result = await getIngredientsByVariant(variantId.toString());

    expect(result.status).toBe('error');
    expect(result.data).toEqual([]);
    expect(result.error).toBe('Couldn\'t get ingredients by variant: Error: Database error');
  });
}); 