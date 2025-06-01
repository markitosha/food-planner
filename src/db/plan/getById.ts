'use server';

import getDatabase from '@/db/utils/getDatabase';
import { MealPlan } from '@/db/schema';
import { DbReturn } from '@/db/types';

export async function getMealPlanById(
  id: string,
): Promise<DbReturn<MealPlan | null>> {
  try {
    const sql = await getDatabase();
    const data = (await sql`
      SELECT * 
      FROM meal_plans 
      WHERE id = ${id}
    `) as MealPlan[];

    return {
      data: data.at(0) || null,
      status: 'success',
    };
  } catch (error: any) {
    return {
      data: null,
      status: 'error',
      error: `Couldn't get meal plan: ${error}`,
    };
  }
}
