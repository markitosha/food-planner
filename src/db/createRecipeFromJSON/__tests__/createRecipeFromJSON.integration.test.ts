import { neon } from '@neondatabase/serverless';
import { resetDatabase } from '@/db/__tests__/setup';
import { createRecipeFromJSON } from '../createRecipeFromJSON';
import { put } from '@vercel/blob';
import { realRecipeData } from './testData';
import getDatabase from '@/db/utils/getDatabase';

// Use test database URL from environment variable
const sql = neon(process.env.TEST_DATABASE_URL!);

describe('createRecipeFromJSON Integration Test', () => {
  let familyId: number;

  beforeEach(async () => {
    await resetDatabase();

    const result = await sql`
      INSERT INTO families (name)
      VALUES ('Test Family')
      RETURNING id
    `;
    familyId = result[0].id;
  });

  it('should create a recipe with all its components', async () => {
    const result = await createRecipeFromJSON({
      hf_data: JSON.stringify(realRecipeData),
      family_id: familyId
    });

    console.log(result);

    expect(result.status).toBe('success');
    expect(result.data).toBeDefined();

    // Check recipe
    const recipe = await sql`
      SELECT name, description, image_url
      FROM recipes
      WHERE id = ${result.data}
    `;
    expect(recipe[0].name).toBe('Cremet prosciuttopasta');
    expect(recipe[0].description).toBe('med grøn rucolasalat og græskarkerner');
    expect(recipe[0].image_url).toBe('https://example.com/mocked-image.jpg');

    // Verify Vercel Blob was called correctly
    expect(put).toHaveBeenCalledWith(
      `recipes/${result.data}.jpeg`,
      expect.any(Blob),
      { access: 'public' }
    );

    // Check variants
    const variants = await sql`
      SELECT variant_name
      FROM recipe_variants
      WHERE recipe_id = ${result.data}
      ORDER BY variant_name
    `;
    expect(variants).toHaveLength(2);
    expect(variants[0].variant_name).toBe('2 People');
    expect(variants[1].variant_name).toBe('4 People');

    // Check products
    const products = await sql`
      SELECT name
      FROM products
      WHERE name IN ('Kruspersille', 'Prosciutto', 'Tomat', 'Hvidløgsfed', 'Agurk', 'Spaghetti', 'Crème fraiche', 'Kyllingebouillon', 'Finrevet ost', 'Rucola', 'Honning-sennepsdressing', 'Græskarkerner')
      ORDER BY name
    `;
    expect(products).toHaveLength(12);
    expect(products[0].name).toBe('Agurk');
    expect(products[1].name).toBe('Crème fraiche');
    expect(products[2].name).toBe('Finrevet ost');
    expect(products[3].name).toBe('Græskarkerner');
    expect(products[4].name).toBe('Honning-sennepsdressing');
    expect(products[5].name).toBe('Hvidløgsfed');
    expect(products[6].name).toBe('Kruspersille');
    expect(products[7].name).toBe('Kyllingebouillon');
    expect(products[8].name).toBe('Prosciutto');
    expect(products[9].name).toBe('Rucola');
    expect(products[10].name).toBe('Spaghetti');
    expect(products[11].name).toBe('Tomat');

    // Check units
    const units = await sql`
      SELECT name
      FROM units
      WHERE name IN ('pose', 'g', 'stk', 'pakke')
      ORDER BY name
    `;
    expect(units).toHaveLength(4);
    expect(units[0].name).toBe('g');
    expect(units[1].name).toBe('pakke');
    expect(units[2].name).toBe('pose');
    expect(units[3].name).toBe('stk');

    // Check ingredients
    const ingredients = await sql`
      SELECT p.name as product_name, u.name as unit_name, i.amount
      FROM ingredients i
      JOIN products p ON i.product_id = p.id
      JOIN units u ON i.unit_id = u.id
      JOIN recipe_variants v ON i.recipe_variant_id = v.id
      WHERE v.recipe_id = ${result.data}
      ORDER BY p.name, v.variant_name
    `;
    expect(ingredients).toHaveLength(24); // 12 ingredients * 2 variants
    expect(ingredients[0]).toMatchObject({
      product_name: 'Agurk',
      unit_name: 'stk',
      amount: '1.00'
    });

    // Check steps
    const steps = await sql`
      SELECT instruction, image_url
      FROM steps
      WHERE recipe_id = ${result.data}
      ORDER BY step_index
    `;
    expect(steps).toHaveLength(6);
    expect(steps[0].instruction).toBe('Bring en stor gryde med saltet vand i kog. Hak prosciutto, tomat og persille groft. Pres eller hak hvidløg fint. Skræl agurk til lange, tynde bånd. Skyl rucola under koldt vand i et dørslag. TIP: Vandet skal være salt som havvand.');
    expect(steps[0].image_url).toBe('https://example.com/mocked-image.jpg');
    expect(steps[1].instruction).toBe('Tilsæt pasta til gryden med kogende vand, og kog i 8-9 min, eller indtil ‘al dente\'. Gem en smule pastavand [1 dl | 2 dl], og hæld resten fra. Vend eventuelt pasta med en smule olivenolie i gryden. TIP: ‘Al dente’ betyder, at pastaen er kogt, men stadig har en mule bid.');
    expect(steps[1].image_url).toBe('https://example.com/mocked-image.jpg');
  });

  it('should handle invalid JSON data', async () => {
    const result = await createRecipeFromJSON({
      hf_data: 'invalid json',
      family_id: familyId
    });

    expect(result.status).toBe('error');
    expect(result.error).toContain("Can't parse JSON");
    expect(result.data).toBeNull();
  });

  it('should handle database errors gracefully', async () => {
    (getDatabase as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

    const result = await createRecipeFromJSON({
      hf_data: JSON.stringify(realRecipeData),
      family_id: familyId
    });

    expect(result.status).toBe('error');
    expect(result.error).toContain("Can't create recipe");
    expect(result.data).toBeNull();
  });
}); 