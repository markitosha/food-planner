'use server';

import getDatabase from '@/db/utils/getDatabase';
import { DbReturn } from '@/db/types';
import { Recipe, Step, RecipeVariant } from '@/db/schema';

export type FullRecipe = Recipe & {
  steps: Step[];
  variants: RecipeVariant[];
};

export async function getRecipeById(
  id: string,
): Promise<DbReturn<FullRecipe | null>> {
  try {
    const sql = await getDatabase();
    const recipe =
      (await sql`SELECT name, description, id, image_url from recipes where id = ${id} LIMIT 1;`) as Recipe[];
    const steps =
      (await sql`SELECT * FROM steps WHERE recipe_id = ${id} ORDER BY step_index ASC;`) as Step[];
    const variants =
      (await sql`SELECT * from recipe_variants where recipe_id = ${id};`) as RecipeVariant[];

    return {
      data: {
        ...recipe[0],
        steps,
        variants,
      },
      status: 'success',
    };
  } catch (error: any) {
    return {
      data: null,
      status: 'error',
      error: `Couldn't load recipe: ${error.message}`,
    };
  }
}
