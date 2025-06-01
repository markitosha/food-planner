'use server';

import getDatabase from '@/db/utils/getDatabase';
import { Shopping } from '@/db/schema';

export type ShoppingWithProduct = Shopping & {
  name: string;
};

export async function getShoppingList(
  id: string,
): Promise<ShoppingWithProduct[]> {
  const sql = await getDatabase();
  const data = (await sql`SELECT
        products.name,
        shopping.id,
        shopping.checked,
        shopping.product_id,
        shopping.amount,
        shopping.deleted
    FROM shopping
      JOIN products on shopping.product_id = products.id
    where meal_plan_id=${id} and deleted = false
    ORDER BY checked, name;`) as ShoppingWithProduct[];

  return data;
}
