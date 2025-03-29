'use server';

import getDatabase from '@/db/getDatabase';
import { Family, MealPlan } from '@/db/types';

export async function getAllPlans(families: Family[] = []) {
  if (!families.length) {
    return [];
  }

  const sql = await getDatabase();
  const familyIds = families.map((family) => family.id);
  const data = (await sql`
      SELECT * FROM meal_plans
      WHERE family_id IN (${sql.unsafe(familyIds.map((id) => `'${id}'`).join(','))});
    `) as MealPlan[];

  return data;
}
