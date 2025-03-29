'use server';

import getDatabase from '@/db/getDatabase';
import { Family } from '@/db/types';

export async function getFamilyById(id: string): Promise<Family> {
  const sql = await getDatabase();
  const data = await sql`SELECT * FROM families where id = ${id};`;

  return data.at(0) as Family;
}
