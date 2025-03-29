'use server';

import getDatabase from '@/db/getDatabase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createNewMealPlan(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const recipes = formData.getAll('recipes') as string[];
  const familyId = formData.get('family_id') as string;

  const sql = await getDatabase();

  const data =
    await sql`INSERT INTO meal_plans (name, description, family_id) VALUES (${name}, ${description}, ${familyId}) RETURNING id;`;
  const id = data.at(0)?.id;

  const current = recipes.map((recipe) => +recipe);

  for (const recipe of current) {
    await sql`INSERT INTO meals (meal_plan_id, recipe_variant_id)
                VALUES (${id}, (SELECT id from recipe_variants where recipe_id = ${recipe} and variant_name = '2 People'));`;
  }

  revalidatePath(`/`);
  redirect(`/`);
}
