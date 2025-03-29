'use server';

import getDatabase from '@/db/getDatabase';
import { Family } from '@/db/types';

export async function getAllFamilies(): Promise<Family[]> {
  const sql = await getDatabase();
  const data = await sql`SELECT * FROM families;`;

  return data as Family[];
}
