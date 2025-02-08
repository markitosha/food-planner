'use server';

import getDababase from '@/db/getDababase';
import { MealPlan } from '@/db/types';

async function getAllPlans(id: string) {
  const sql = getDababase();
  const data =
    (await sql`SELECT * FROM meal_plans where id=${id};`) as MealPlan[];

  return data.at(0);
}

export default getAllPlans;
