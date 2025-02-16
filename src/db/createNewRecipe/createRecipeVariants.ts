import { HFRecipe } from '@/db/createNewRecipe';
import getDatabase from '@/db/getDatabase';

export default async function createRecipeVariants(
  recipe: HFRecipe,
  id: number,
) {
  const sql = getDatabase();

  const variants = recipe.yields.map((variant) => `${variant.yields} People`);
  const vData = await sql.transaction(
    variants.map(
      (variant) =>
        sql`INSERT INTO recipe_variants (recipe_id, variant_name) VALUES (${id}, ${variant}) RETURNING id;`,
    ),
  );

  return vData.map((data, index) => ({
    id: data.at(0)?.id as number,
    variant: variants[index],
    yields: recipe.yields[index].yields,
  }));
}
