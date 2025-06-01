'use server';

import { revalidatePath } from 'next/cache';

import { Shopping } from '@/db/schema';
import { DbReturn } from '@/db/types';
import getDatabase from '@/db/utils/getDatabase';

export async function updateShoppingList({
  checked,
  deleted = false,
  id,
}: Pick<Shopping, 'checked' | 'deleted' | 'id'>): Promise<DbReturn<null>> {
  try {
    const sql = await getDatabase();

    await sql`UPDATE shopping SET checked = ${checked}, deleted = ${deleted} WHERE id=${id};`;

    revalidatePath('/plans');

    return {
      data: null,
      status: 'success',
    };
  } catch (error: any) {
    return {
      data: null,
      status: 'error',
      error: `Couldn't update shopping list: ${error}`,
    };
  }
}
