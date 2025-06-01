'use server';

import getDatabase from '@/db/utils/getDatabase';
import { Unit } from '@/db/schema';

export async function getAllUnits() {
  const sql = await getDatabase();
  const data = (await sql`SELECT * FROM units;`) as Unit[];

  return data;
}
