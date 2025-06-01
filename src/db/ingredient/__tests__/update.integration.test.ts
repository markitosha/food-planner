import { neon } from '@neondatabase/serverless';
import { resetDatabase } from '@/db/__tests__/setup';
import { updateIngredient } from '../update';
import { revalidatePath } from 'next/cache';
import getDatabase from '@/db/utils/getDatabase';
import { Ingredient } from '@/db/schema';

// Use test database URL from environment variable
const sql = neon(process.env.TEST_DATABASE_URL!);

describe('updateIngredient', () => {
  let familyId: number;
  let recipeId: number;
  let variantId: number;
  let productId: number;
  let unitId: number;
  let ingredientId: number;

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

    // Create a product
    const product = await sql`
      INSERT INTO products (name)
      VALUES ('Test Product')
      RETURNING id
    `;
    productId = product[0].id;

    // Create a unit
    const unit = await sql`
      INSERT INTO units (name)
      VALUES ('Test Unit')
      RETURNING id
    `;
    unitId = unit[0].id;

    // Create an ingredient
    const ingredient = await sql`
      INSERT INTO ingredients (recipe_variant_id, product_id, unit_id, amount, comment)
      VALUES (${variantId}, ${productId}, ${unitId}, 1, 'Test comment')
      RETURNING id
    `;
    ingredientId = ingredient[0].id;
  });

  it('should update ingredient amount and units', async () => {
    const ingredient: Ingredient = {
      id: ingredientId,
      amount: '2.00',
      unit_id: unitId,
      product_id: productId,
      recipe_variant_id: variantId,
      comment: 'Test comment'
    };

    await updateIngredient(ingredient);

    // Verify update in database
    const updatedIngredient = await sql`
      SELECT i.*, p.name as product, u.name as unit
      FROM ingredients i
      JOIN products p ON p.id = i.product_id
      JOIN units u ON u.id = i.unit_id
      WHERE i.id = ${ingredientId}
    `;
    expect(updatedIngredient[0].amount).toBe('2.00');
    expect(updatedIngredient[0].unit_id).toBe(unitId);
    expect(updatedIngredient[0].product_id).toBe(productId);
    expect(revalidatePath).toHaveBeenCalledWith('/recipes');
  });

  it('should handle database errors gracefully', async () => {
    const ingredient: Ingredient = {
      id: ingredientId,
      amount: '2.00',
      unit_id: unitId,
      product_id: productId,
      recipe_variant_id: variantId,
      comment: 'Test comment'
    };

    // Mock database error
    (getDatabase as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

    await expect(updateIngredient(ingredient))
      .rejects.toThrow('Database error');
  });
}); 