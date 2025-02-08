'use server';

import getDababase from '@/db/getDababase';
import { Ingredient } from '@/db/types';

async function getAllIngredients(mealPlanId: string) {
  const sql = getDababase();
  const data = (await sql`SELECT
                            products.id AS product_id,
                            products.name AS name,
                            SUM(ingredients.amount) AS amount,
                            units.name AS unit
                          FROM meals
                                 JOIN recipe_variants ON meals.recipe_variant_id = recipe_variants.id
                                 JOIN ingredients ON recipe_variants.id = ingredients.recipe_variant_id
                                 JOIN products ON ingredients.product_id = products.id
                                 JOIN units ON ingredients.unit_id = units.id
                          WHERE meals.meal_plan_id = ${mealPlanId}
                          GROUP BY unit, products.id
                          ORDER BY products.name;`) as Ingredient[];

  return data;
}

export default getAllIngredients;
