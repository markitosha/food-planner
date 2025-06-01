'use server';

import { revalidatePath } from 'next/cache';

import { DbReturn } from '@/db/types';
import getDatabase from '@/db/utils/getDatabase';

export async function updateRecipe({
  name,
  description,
  recipeId,
}: {
  name?: string;
  description?: string;
  recipeId: number;
}): Promise<DbReturn<null>> {
  try {
    const sql = await getDatabase();

    if (name) {
      await sql`UPDATE recipes
                SET name = ${name}
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

    return {
      data: null,
      status: 'success',
    };
  } catch (error: any) {
    return {
      data: null,
      status: 'error',
      error: `Couldn't update recipe: ${error.message}`,
    };
  }
}
