'use server';

import { Unit } from '@/db/schema';
import getDatabase from '@/db/utils/getDatabase';

export async function getAllUnits() {
  const sql = await getDatabase();
  const data = (await sql`SELECT * FROM units;`) as Unit[];

  return data;
}
