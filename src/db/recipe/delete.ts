'use server';

import getDatabase from '@/db/getDatabase';
import { DbReturn, RecipeSummary } from '@/db/types';
import { revalidatePath } from 'next/cache';

export async function deleteRecipe(
  id: number,
): Promise<DbReturn<RecipeSummary | null>> {
  try {
    const sql = await getDatabase();
    const data = (await sql`DELETE
                           FROM recipes
                           WHERE id = ${id}
                           RETURNING *;`) as RecipeSummary[];

    revalidatePath('/recipes');

    return {
      data: data[0] || null,
      status: 'success',
    };
  } catch (error: any) {
    return {
      data: null,
      status: 'error',
      error: `Couldn't delete recipe: ${error}`,
    };
  }
}
