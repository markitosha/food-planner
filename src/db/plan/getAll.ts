'use server';

import getDatabase from '@/db/getDatabase';
import { MealPlan } from '@/db/types';

export async function getAllPlans() {
  const sql = await getDatabase();
  const data = (await sql`SELECT * FROM meal_plans`) as MealPlan[];

  return data;
}
