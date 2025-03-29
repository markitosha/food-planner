'use server';

import getDatabase from '@/db/getDatabase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deleteFamilyById(id: number) {
  const sql = await getDatabase();

  await sql`DELETE FROM families
            WHERE id = ${id};`;

  revalidatePath('/families');
  revalidatePath('/plans');

  redirect('/families');
}
