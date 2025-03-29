import { HFRecipe } from '@/db/createNewRecipe';
import { getName } from '@/db/createNewRecipe/updateProducts';
import getDatabase from '@/db/getDatabase';
import { NeonQueryFunction } from '@neondatabase/serverless';

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
                    VALUES (${variantId}, (SELECT id FROM products WHERE name = ${name}), ${ingredient.amount}, (SELECT id FROM units WHERE name = ${ingredient.unit}), ${comment});`;
    }),
  );
}

export default async function createIngredients(
  recipe: HFRecipe,
  vData: { id: number; variant: string; yields: number }[],
) {
  const sql = await getDatabase();

  const ingredientsNames = recipe.ingredients.reduce(
    (acc, item) => {
      const shortenName = getName(item.name);

      acc[item.id] = {
        name: shortenName,
        comment: shortenName === item.name ? undefined : item.name,
      };

      return acc;
    },
    {} as Record<
      string,
      {
        name: string;
        comment?: string;
      }
    >,
  );

  return recipe.yields.forEach(({ ingredients }, index) => {
    return createVariantIngredients(
      ingredients,
      ingredientsNames,
      vData[index].id,
      sql,
    );
  });
}
