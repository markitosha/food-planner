'use server';

import getDatabase from '@/db/getDatabase';
import { Product } from '@/db/types';

export async function getAllProducts() {
  const sql = await getDatabase();
  const data = (await sql`SELECT * FROM products ORDER BY name;`) as Product[];

  return data;
}
