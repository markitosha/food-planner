'use server';

import getDatabase from '@/db/getDatabase';
import { revalidatePath } from 'next/cache';

export default async function updateRecipe({
  name,
  description,
  recipeId,
}: {
  name?: string;
  description?: string;
  recipeId: string;
}) {
  const sql = getDatabase();

  if (name) {
    await sql`UPDATE recipes
                  SET name        = ${name}
                  WHERE id = ${recipeId};`;
  }

  if (description) {
    await sql`UPDATE recipes
                  SET description = ${description}
                  WHERE id = ${recipeId};`;
  }

  revalidatePath(`/recipes/${recipeId}`);
  revalidatePath('/recipes');
  revalidatePath('/plans');
}
