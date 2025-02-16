'use server';

import getAllIngredients from '@/db/getAllIngredients';
import getDatabase from '@/db/getDatabase';
import { revalidatePath } from 'next/cache';

export default async function createShoppingList(mealPlanId: string) {
  const ingredients = await getAllIngredients(mealPlanId);

  const sql = getDatabase();

  const data = await sql.transaction(
    ingredients.map(
      (p) =>
        sql`INSERT INTO shopping (meal_plan_id, product_id, amount) VALUES (${mealPlanId}, ${p.product_id}, ${p.amount});`,
    ),
  );

  revalidatePath('/plans/1@shopping');

  return data;
}
