'use server';

import getDatabase from '@/db/getDatabase';
import { Ingredient } from '@/db/types';

async function getShoppingList(id: string) {
  const sql = await getDatabase();
  const data = (await sql`SELECT
        products.name,
        shopping.id,
        shopping.checked,
        shopping.product_id,
        shopping.amount
    FROM shopping
      JOIN products on shopping.product_id = products.id
    where meal_plan_id=${id} and deleted = false
    ORDER BY checked, name;`) as Ingredient[];

  return data;
}

export default getShoppingList;
