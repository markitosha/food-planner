'use server';

import getDatabase from '@/db/getDatabase';
import { Ingredient } from '@/db/types';
import { revalidatePath } from 'next/cache';

export default async function updateShoppingList({
  checked,
  deleted = false,
  id,
}: Ingredient) {
  const sql = await getDatabase();

  const data =
    await sql`UPDATE shopping SET checked = ${checked}, deleted = ${deleted} WHERE id=${id};`;

  revalidatePath('/plans/1@shopping');

  return data;
}
