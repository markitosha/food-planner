import { getName } from '@/db/utils';
import getDatabase from '@/db/utils/getDatabase';

import { HFRecipe } from './createRecipeFromJSON';

export default async function updateProducts(recipe: HFRecipe) {
  const sql = await getDatabase();

  const products = recipe.ingredients.map((ingredient) =>
    getName(ingredient.name),
  );
  await sql.transaction(
    products.map(
      (product) =>
        sql`INSERT INTO products (name) VALUES (${product}) ON CONFLICT (name) DO NOTHING;`,
    ),
  );

  return products;
}
