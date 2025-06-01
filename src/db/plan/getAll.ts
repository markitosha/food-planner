'use server';

import { MealPlan } from '@/db/schema';
import getDatabase from '@/db/utils/getDatabase';

export async function getAllPlans() {
  const sql = await getDatabase();
  const data = (await sql`SELECT * FROM meal_plans`) as MealPlan[];

  return data;
}
