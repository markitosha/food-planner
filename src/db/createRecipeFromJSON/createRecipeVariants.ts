import { createVariantNames } from '@/db/utils';
import getDatabase from '@/db/utils/getDatabase';

import { HFRecipe } from './createRecipeFromJSON';

export default async function createRecipeVariants(
  recipe: HFRecipe,
  id: number,
) {
  const sql = await getDatabase();

  const variants = createVariantNames(recipe.yields);
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
