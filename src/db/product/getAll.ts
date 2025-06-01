'use server';

import { Product } from '@/db/schema';
import getDatabase from '@/db/utils/getDatabase';

export async function getAllProducts() {
  const sql = await getDatabase();
  const data = (await sql`SELECT * FROM products ORDER BY name;`) as Product[];

  return data;
}
