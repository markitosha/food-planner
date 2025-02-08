'use server';

import getDababase from '@/db/getDababase';
import { Recipe } from '@/db/types';

async function getAllRecipes() {
  const sql = getDababase();
  const data = (await sql`SELECT * FROM recipes;`) as Recipe[];

  return data;
}

export default getAllRecipes;
