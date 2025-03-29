'use server';

import getDatabase from '@/db/getDatabase';
import { Unit } from '@/db/types';

export async function getAllUnits() {
  const sql = await getDatabase();
  const data = (await sql`SELECT * FROM units;`) as Unit[];

  return data;
}
