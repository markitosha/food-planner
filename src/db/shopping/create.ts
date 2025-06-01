'use server';

import { revalidatePath } from 'next/cache';

import getDatabase from '@/db/utils/getDatabase';

import { getAllIngredients } from './getAllIngredients';

export async function createShoppingList(mealPlanId: string) {
  const ingredients = await getAllIngredients(mealPlanId);

  const sql = await getDatabase();

  const data = await sql.transaction(
    ingredients.map(
      (p) =>
        sql`INSERT INTO shopping (meal_plan_id, product_id, amount) VALUES (${mealPlanId}, ${p.product_id}, ${p.amount});`,
    ),
  );

  revalidatePath('/plans');

  return data;
}
