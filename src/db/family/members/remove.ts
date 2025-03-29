'use server';

import getDatabase from '@/db/getDatabase';
import { revalidatePath } from 'next/cache';

export async function removeMemberById(memberId: number, familyId: string) {
  const sql = await getDatabase();

  await sql`
    DELETE FROM family_members
      WHERE user_id = ${memberId} AND family_id = ${familyId};`;

  revalidatePath('/families');
}
