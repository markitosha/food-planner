'use server';

import { revalidatePath } from 'next/cache';

import getDatabase from '@/db/utils/getDatabase';

export async function removeMemberById(memberId: string, familyId: string) {
  const sql = await getDatabase();

  await sql`
    DELETE FROM family_members
      WHERE user_id = ${memberId} AND family_id = ${familyId};`;

  revalidatePath('/families');
}
