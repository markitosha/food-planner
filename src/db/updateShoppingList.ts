'use server';

import getDababase from '@/db/getDababase';
import { Ingredient } from '@/db/types';
import { revalidatePath } from 'next/cache';

export default async function updateShoppingList({
  checked,
  deleted = false,
  id,
}: Ingredient) {
  const sql = getDababase();

  const data =
    await sql`UPDATE shopping SET checked = ${checked}, deleted = ${deleted} WHERE id=${id};`;

  revalidatePath('/plans/1@shopping');

  return data;
}
