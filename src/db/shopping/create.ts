'use server';

import { getAllIngredients } from './getAllIngredients';
import getDatabase from '@/db/utils/getDatabase';
import { revalidatePath } from 'next/cache';

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