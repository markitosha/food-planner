'use server';

import getDatabase from '@/db/utils/getDatabase';
import { FamilyMember } from '@/db/schema';

type FamilyMemberWithUser = FamilyMember & {
  id: string;
  email: string;
  name: string;
};

export async function getAllFamilyMembers(
  familyId: string,
): Promise<FamilyMemberWithUser[]> {
  const sql = await getDatabase();
  const data = await sql`SELECT
                u.id,
                u.email,
                u.name
              FROM family_members fm
                     JOIN neon_auth.users_sync u ON fm.user_id = u.id
              WHERE fm.family_id = ${familyId};`;

  return data as FamilyMemberWithUser[];
}
