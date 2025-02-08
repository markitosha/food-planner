import { HFRecipe } from '@/db/createNewRecipe';
import getDababase from '@/db/getDababase';

export default async function createRecipeVariants(
  recipe: HFRecipe,
  id: number,
) {
  const sql = getDababase();

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
