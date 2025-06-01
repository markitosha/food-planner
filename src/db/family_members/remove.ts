'use server';

import getDatabase from '@/db/utils/getDatabase';
import { revalidatePath } from 'next/cache';

export async function removeMemberById(memberId: string, familyId: string) {
  const sql = await getDatabase();

  await sql`
    DELETE FROM family_members
      WHERE user_id = ${memberId} AND family_id = ${familyId};`;

  revalidatePath('/families');
}
