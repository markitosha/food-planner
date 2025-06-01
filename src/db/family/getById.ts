'use server';

import getDatabase from '@/db/utils/getDatabase';
import { Family } from '@/db/schema';

export async function getFamilyById(id: string): Promise<Family> {
  const sql = await getDatabase();
  const data = await sql`SELECT * FROM families where id = ${id};`;

  return data.at(0) as Family;
}
