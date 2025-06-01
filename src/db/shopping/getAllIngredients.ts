'use server';

import getDatabase from '@/db/utils/getDatabase';

type ShoppingIngredient = {
  product_id: string;
  name: string;
  amount: string;
  checked: boolean;
  deleted: boolean;
  unit: string;
  unit_id: string;
};

export async function getAllIngredients(mealPlanId: string) {
  const sql = await getDatabase();
  const rawData = (await sql`SELECT
                            products.id AS product_id,
                            products.name AS name,
                            SUM(ingredients.amount) AS amount,
                            units.name AS unit,
                            units.id AS unit_id,
                            COALESCE(shopping.checked, FALSE) AS checked,
                            COALESCE(shopping.deleted, FALSE) AS deleted
                          FROM meals
                                 JOIN recipe_variants ON meals.recipe_variant_id = recipe_variants.id
                                 JOIN ingredients ON recipe_variants.id = ingredients.recipe_variant_id
                                 JOIN products ON ingredients.product_id = products.id
                                 JOIN units ON ingredients.unit_id = units.id
                                 LEFT JOIN shopping ON shopping.product_id = products.id AND shopping.meal_plan_id = meals.meal_plan_id
                          WHERE meals.meal_plan_id = ${mealPlanId}
                          GROUP BY products.id, units.name, shopping.checked, units.id
                          ORDER BY shopping.checked, products.name;`) as ShoppingIngredient[];

  const data = rawData.reduce((acc, ingredient, currentIndex) => {
    const prevItem = acc.at(-1);

    if (currentIndex === 0 || prevItem?.product_id !== ingredient.product_id) {
      acc.push({
        product_id: ingredient.product_id,
        name: ingredient.name,
        amount: `${parseFloat(ingredient.amount)} ${ingredient.unit}`,
        checked: ingredient.checked,
        deleted: ingredient.deleted,
      });

      return acc;
    }

    const prevAmount = prevItem.amount;

    prevItem.amount = `${prevAmount} + ${parseFloat(ingredient.amount)} ${ingredient.unit}`;

    return acc;
  }, [] as Partial<ShoppingIngredient>[]);

  return data;
}
