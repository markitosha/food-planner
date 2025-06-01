'use server';

import getDatabase from '@/db/utils/getDatabase';
import { MealPlan } from '@/db/schema';

export async function getAllPlans() {
  const sql = await getDatabase();
  const data = (await sql`SELECT * FROM meal_plans`) as MealPlan[];

  return data;
}
