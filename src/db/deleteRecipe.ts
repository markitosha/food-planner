'use server';

import getDatabase from '@/db/getDatabase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export default async function deleteRecipe(id: number) {
  const sql = getDatabase();
  const data = await sql`DELETE FROM recipes WHERE id = ${id} RETURNING *;`;

  revalidatePath('/recipes');
  revalidatePath('/recipes/[id]');

  redirect('/recipes');

  return data;
}
