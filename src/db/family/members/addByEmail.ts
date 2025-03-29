'use server';

import getDatabase from '@/db/getDatabase';
import { revalidatePath } from 'next/cache';

export async function addMemberToFamilyByEmail(
  familyId: string,
  email: string,
) {
  if (!email) {
    return 'Email is required';
  }

  const sql = await getDatabase();
  const data = await sql`INSERT INTO family_members (user_id, family_id)
        SELECT u.id, ${familyId}
        FROM neon_auth.users_sync u
        WHERE u.email = ${email}
        ON CONFLICT DO NOTHING
        RETURNING user_id, family_id;`;

  revalidatePath('/families');

  return data.length ? '' : 'User not found or already in family';
}
