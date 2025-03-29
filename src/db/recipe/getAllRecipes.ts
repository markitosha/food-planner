'use server';

import getDatabase from '@/db/getDatabase';
import { Recipe } from '@/db/types';

export async function getAllRecipes() {
  const sql = await getDatabase();
  const data = (await sql`SELECT * FROM recipes;`) as Recipe[];

  return data;
}
