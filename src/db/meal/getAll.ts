'use server';

import getDatabase from '@/db/utils/getDatabase';
import { Meal } from '@/db/schema';

export type MealWithRecipe = Meal & {
  recipe_variant_id: string;
  variant: string;
  recipe_id: string;
  name: string;
  description: string;
};

export async function getMeals(id: string) {
  const sql = await getDatabase();
  const data = (await sql`SELECT
                 meals.id,
                 recipe_variants.id AS recipe_variant_id,
                 recipe_variants.variant_name AS variant,
                 recipes.id as recipe_id,
                 recipes.name,
                 recipes.description
               FROM meals
                      JOIN recipe_variants ON meals.recipe_variant_id = recipe_variants.id
                      JOIN recipes ON recipe_variants.recipe_id = recipes.id
               WHERE meals.meal_plan_id = ${id};`) as MealWithRecipe[];

  return data;
}
