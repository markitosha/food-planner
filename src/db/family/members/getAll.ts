'use server';

import getDatabase from '@/db/getDatabase';
import { FamilyMemberUser } from '@/db/types';

export async function getAllFamilyParticipants(
  familyId: string,
): Promise<FamilyMemberUser[]> {
  const sql = await getDatabase();
  const data = await sql`SELECT
                u.id,
                u.email,
                u.name
              FROM family_members fm
                     JOIN neon_auth.users_sync u ON fm.user_id = u.id
              WHERE fm.family_id = ${familyId};`;

  return data as FamilyMemberUser[];
}
