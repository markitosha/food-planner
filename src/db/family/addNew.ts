'use server';

import getDatabase from '@/db/getDatabase';
import { Family } from '@/db/types';
import { stackServerApp } from '@/stack';

export async function addFamily() {
  const sql = await getDatabase({
    publicRequest: true,
  });
  const data =
    await sql`INSERT INTO families (name) VALUES ('Family') RETURNING id;`;
  const family = data.at(0);

  if (family) {
    const user = await stackServerApp.getUser();

    await sql`INSERT INTO family_members (family_id, user_id)
              VALUES (${family.id}, ${user?.id});`;
  }

  return family as Family;
}
