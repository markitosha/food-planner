'use server';

import getDatabase from '@/db/getDatabase';
import { MealPlan } from '@/db/types';

async function getAllPlans() {
  const sql = getDatabase();
  const data =
    (await sql`SELECT * FROM meal_plans where family_id=1;`) as MealPlan[];

  return data;
}

export default getAllPlans;
