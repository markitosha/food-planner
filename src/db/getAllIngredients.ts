'use server';

import getDababase from '@/db/getDababase';
import { Ingredient } from '@/db/types';

export type IngredientRaw = {
  amount: string;
  product_id: number;
  name: string;
  unit: string;
  checked: boolean;
};

async function getAllIngredients(mealPlanId: string) {
  const sql = getDababase();
  const rawData = (await sql`SELECT
                            products.id AS product_id,
                            products.name AS name,
                            SUM(ingredients.amount) AS amount,
                            units.name AS unit,
                            COALESCE(shopping.checked, FALSE) AS checked  -- Ensure checked is always returned
                          FROM meals
                                 JOIN recipe_variants ON meals.recipe_variant_id = recipe_variants.id
                                 JOIN ingredients ON recipe_variants.id = ingredients.recipe_variant_id
                                 JOIN products ON ingredients.product_id = products.id
                                 JOIN units ON ingredients.unit_id = units.id
                                 LEFT JOIN shopping ON shopping.product_id = products.id AND shopping.meal_plan_id = meals.meal_plan_id
                          WHERE meals.meal_plan_id = ${mealPlanId}
                          GROUP BY products.id, units.name, shopping.checked
                          ORDER BY shopping.checked, products.name;`) as IngredientRaw[];

  const data = rawData.reduce((acc, ingredient, currentIndex) => {
    const prevItem = acc.at(-1);

    if (currentIndex === 0 || prevItem?.product_id !== ingredient.product_id) {
      acc.push({
        product_id: ingredient.product_id,
        name: ingredient.name,
        amount: `${parseFloat(ingredient.amount)} ${ingredient.unit}`,
        checked: ingredient.checked,
      });

      return acc;
    }

    const prevAmount = prevItem.amount;

    prevItem.amount = `${prevAmount} + ${parseFloat(ingredient.amount)} ${ingredient.unit}`;

    return acc;
  }, [] as Ingredient[]);

  return data;
}

export default getAllIngredients;
