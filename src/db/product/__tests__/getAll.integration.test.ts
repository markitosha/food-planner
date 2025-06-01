import { neon } from '@neondatabase/serverless';

import { resetDatabase } from '@/db/__tests__/setup';

import { getAllProducts } from '../getAll';

// Use test database URL from environment variable
const sql = neon(process.env.TEST_DATABASE_URL!);

describe('getAllProducts', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it('should return empty array when no products exist', async () => {
    const products = await getAllProducts();
    expect(products).toEqual([]);
  });

  it('should return all products in alphabetical order', async () => {
    // Insert test data in random order
    await sql`
      INSERT INTO products (name) VALUES 
        ('zucchini'),
        ('apple'),
        ('banana'),
        ('carrot')
    `;

    const products = await getAllProducts();

    expect(products).toHaveLength(4);
    expect(products.map((p) => p.name)).toEqual([
      'apple',
      'banana',
      'carrot',
      'zucchini',
    ]);
  });

  it('should return products in correct format', async () => {
    // Insert a single product
    await sql`
      INSERT INTO products (name) VALUES ('apple')
    `;

    const products = await getAllProducts();

    expect(products[0]).toEqual({
      id: expect.any(Number),
      name: 'apple',
    });
  });

  it('should handle products with special characters', async () => {
    // Insert products with special characters
    await sql`
      INSERT INTO products (name) VALUES 
        ('café'),
        ('crème brûlée'),
        ('jalapeño')
    `;

    const products = await getAllProducts();

    expect(products).toHaveLength(3);
    expect(products.map((p) => p.name)).toEqual([
      'café',
      'crème brûlée',
      'jalapeño',
    ]);
  });
});
