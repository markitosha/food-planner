import { neon } from '@neondatabase/serverless';
import { resetDatabase } from '@/db/__tests__/setup';
import updateProducts from '../updateProducts';
import getDatabase from '@/db/utils/getDatabase';
import { HFRecipe } from '../createRecipeFromJSON';

// Use test database URL from environment variable
const sql = neon(process.env.TEST_DATABASE_URL!);

describe('updateProducts', () => {
  const mockRecipe: HFRecipe = {
    name: 'Test Recipe',
    headline: 'Test Headline',
    imagePath: '/test-image.jpg',
    yields: [],
    ingredients: [
      { id: 'ing1', name: 'Test Ingredient 1' },
      { id: 'ing2', name: 'Test Ingredient 2' }
    ],
    steps: []
  };

  beforeEach(async () => {
    await resetDatabase();
  });

  it('should create new products', async () => {
    const products = await updateProducts(mockRecipe);

    expect(products).toHaveLength(2);
    expect(products).toContain('Test Ingredient 1');
    expect(products).toContain('Test Ingredient 2');

    // Verify products were created in database
    const dbProducts = await sql`
      SELECT * FROM products 
      WHERE name IN ('Test Ingredient 1', 'Test Ingredient 2')
    `;
    expect(dbProducts).toHaveLength(2);
  });

  it('should not create duplicate products', async () => {
    // First insert
    await updateProducts(mockRecipe);

    // Second insert with same ingredients
    const products = await updateProducts(mockRecipe);

    expect(products).toHaveLength(2);

    // Verify only unique products exist
    const dbProducts = await sql`
      SELECT * FROM products 
      WHERE name IN ('Test Ingredient 1', 'Test Ingredient 2')
    `;
    expect(dbProducts).toHaveLength(2);
  });

  it('should handle database errors gracefully', async () => {
    // Mock database error
    (getDatabase as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

    await expect(updateProducts(mockRecipe))
      .rejects.toThrow('Database error');
  });
}); 