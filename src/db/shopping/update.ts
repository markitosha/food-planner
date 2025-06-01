'use server';

import getDatabase from '@/db/utils/getDatabase';
import { ShoppingIngredient } from '@/db/types';
import { revalidatePath } from 'next/cache';
import { DbReturn } from '@/db/types';

export async function updateShoppingList({
  checked,
  deleted = false,
  id,
}: ShoppingIngredient): Promise<DbReturn<null>> {
  try {
    const sql = await getDatabase();

    await sql`UPDATE shopping SET checked = ${checked}, deleted = ${deleted} WHERE id=${id};`;

    revalidatePath('/plans');

    return {
      data: null,
      status: 'success'
    };
  } catch (error: any) {
    return {
      data: null,
      status: 'error',
      error: `Couldn't update shopping list: ${error}`
    };
  }
} 