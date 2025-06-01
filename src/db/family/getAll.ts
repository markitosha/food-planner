'use server';

import { Family } from '@/db/schema';
import getDatabase from '@/db/utils/getDatabase';

export async function getAllFamilies(): Promise<Family[]> {
  const sql = await getDatabase();
  const data = await sql`SELECT * FROM families;`;

  return data as Family[];
}
