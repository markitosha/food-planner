'use server';

import getDatabase from '@/db/getDatabase';
import { MealPlan } from '@/db/types';

async function getAllPlans(id: string) {
  const sql = await getDatabase();
  const data =
    (await sql`SELECT * FROM meal_plans where id=${id};`) as MealPlan[];

  return data.at(0);
}

export default getAllPlans;
