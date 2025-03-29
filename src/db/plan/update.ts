'use server';

import getDatabase from '@/db/getDatabase';
import { Meal } from '@/db/types';
import { revalidatePath } from 'next/cache';

export async function updateMealPlan(
  id: string,
  formData: FormData,
  meals: Meal[],
) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const recipes = formData.getAll('recipes') as string[];
  const familyId = formData.get('family_id') as string;

  console.log(familyId);

  const sql = await getDatabase();

  await sql`UPDATE meal_plans
            SET name        = ${name},
                description = ${description},
                family_id   = ${familyId}
            WHERE id = ${id};`;

  const old = new Set(meals.map((meal) => meal.recipe_id));
  const current = new Set(recipes.map((recipe) => +recipe));

  const addRecipes = current.difference(old);
  const removeRecipes = old.difference(current);

  for (const recipe of removeRecipes) {
    await sql`DELETE
              FROM meals
              WHERE meal_plan_id = ${id}
                AND recipe_variant_id = (SELECT id from recipe_variants where recipe_id = ${recipe} and variant_name = '2 People');`;
  }

  for (const recipe of addRecipes) {
    await sql`INSERT INTO meals (meal_plan_id, recipe_variant_id)
                VALUES (${id}, (SELECT id from recipe_variants where recipe_id = ${recipe} and variant_name = '2 People'));`;
  }

  revalidatePath(`/plans`);
  revalidatePath(`/plans/${id}`);
}
