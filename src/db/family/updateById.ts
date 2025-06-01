'use server';

import { revalidatePath } from 'next/cache';

import getDatabase from '@/db/utils/getDatabase';

export async function updateFamilyById({
  name,
  id,
}: {
  name: string;
  id: string;
}) {
  const sql = await getDatabase();

  await sql`UPDATE families
                  SET name = ${name}
                  WHERE id = ${id};`;

  revalidatePath('/families');
  revalidatePath('/plans');
}
