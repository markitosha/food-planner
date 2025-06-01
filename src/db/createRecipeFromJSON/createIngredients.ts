import { NeonQueryFunction } from '@neondatabase/serverless';

import { mapIngredientNames } from '@/db/utils';
import getDatabase from '@/db/utils/getDatabase';

import { HFRecipe } from './createRecipeFromJSON';

async function createVariantIngredients(
  ingredients: { id: string; unit: string; amount: number }[],
  ingredientsNames: Record<
    string,
    {
      name: string;
      comment?: string;
    }
  >,
  variantId: number,
  sql: NeonQueryFunction<false, false>,
) {
  return sql.transaction(
    ingredients.map((ingredient) => {
      const { name, comment } = ingredientsNames[ingredient.id];

      return sql`INSERT INTO ingredients (recipe_variant_id, product_id, amount, unit_id, comment)
                    VALUES (${variantId}, (SELECT id FROM products WHERE name = ${name}), ${ingredient.amount}, (SELECT id FROM units WHERE name = ${ingredient.unit || 'stk'}), ${comment});`;
    }),
  );
}

export default async function createIngredients(
  recipe: HFRecipe,
  vData: { id: number; variant: string; yields: number }[],
) {
  const sql = await getDatabase();

  const ingredientsNames = mapIngredientNames(recipe.ingredients);

  return recipe.yields.forEach(({ ingredients }, index) => {
    return createVariantIngredients(
      ingredients,
      ingredientsNames,
      vData[index].id,
      sql,
    );
  });
}
