'use server';

import getDatabase from '@/db/getDatabase';
import { Recipe } from '@/db/types';

async function getAllRecipes() {
  const sql = getDatabase();
  const data = (await sql`SELECT * FROM recipes;`) as Recipe[];

  return data;
}

export default getAllRecipes;
