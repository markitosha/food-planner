'use server';

import getDatabase from '@/db/getDatabase';
import { Meal } from '@/db/types';

async function getMeals(id: string) {
  const sql = getDatabase();
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
               WHERE meals.meal_plan_id = ${id};`) as Meal[];

  return data;
}

export default getMeals;
