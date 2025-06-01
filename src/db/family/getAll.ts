'use server';

import getDatabase from '@/db/utils/getDatabase';
import { Family } from '@/db/schema';

export async function getAllFamilies(): Promise<Family[]> {
  const sql = await getDatabase();
  const data = await sql`SELECT * FROM families;`;

  return data as Family[];
}
