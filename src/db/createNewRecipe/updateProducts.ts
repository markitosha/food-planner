import { HFRecipe } from '@/db/createNewRecipe';
import getDababase from '@/db/getDababase';

export const getName = (name: string) => {
  const splittedName = name.split(' til ');

  return splittedName.at(0) || name;
};

export default async function updateProducts(recipe: HFRecipe) {
  const sql = getDababase();

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
