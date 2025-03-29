'use server';

import getDatabase from '@/db/getDatabase';
import { revalidatePath } from 'next/cache';

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
