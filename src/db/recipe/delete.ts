'use server';

import getDatabase from '@/db/utils/getDatabase';
import { DbReturn } from '@/db/types';
import { Recipe } from '@/db/schema';
import { revalidatePath } from 'next/cache';

export async function deleteRecipe(
  id: number,
): Promise<DbReturn<Recipe | null>> {
  try {
    const sql = await getDatabase();
    const data = (await sql`DELETE
                           FROM recipes
                           WHERE id = ${id}
                           RETURNING *;`) as Recipe[];

    revalidatePath('/recipes');

    return {
      data: data[0] || null,
      status: 'success',
    };
  } catch (error: any) {
    return {
      data: null,
      status: 'error',
      error: `Couldn't delete recipe: ${error.message}`,
    };
  }
}
