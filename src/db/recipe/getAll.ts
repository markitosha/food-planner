'use server';

import getDatabase from '@/db/getDatabase';
import { DbReturn, RecipeSummary } from '@/db/types';

export async function getAllRecipes(): Promise<DbReturn<RecipeSummary[]>> {
  try {
    const sql = await getDatabase();
    const data = (await sql`SELECT
                   r.id,
                   r.name,
                   r.description,
                   r.image_url,
                   COUNT(rv.id) AS variant_count
                 FROM recipes r
                        LEFT JOIN recipe_variants rv ON rv.recipe_id = r.id
                 GROUP BY r.id, r.name, r.description, r.image_url
                 ORDER BY r.id DESC;`) as RecipeSummary[];

    return {
      data,
      status: 'success',
    };
  } catch (err: any) {
    return {
      data: [],
      status: 'error',
      error: `Couldn't load recipes: ${err.message}`,
    };
  }
}
