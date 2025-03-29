'use server';

import getDatabase from '@/db/getDatabase';
import { Step } from '@/db/types';
import { revalidatePath } from 'next/cache';

export default async function updateStepIndex(
  step: Step,
  value: string,
  recipeId: string,
) {
  const sql = await getDatabase();

  await sql`UPDATE steps
            SET step_index = step_index + 1
            WHERE step_index >= ${value} AND recipe_id = ${recipeId};`;
  await sql`UPDATE steps
            SET step_index = ${value}
            WHERE id = ${step.id};`;
  await sql`WITH updated_steps AS (
    SELECT
      id,
      step_index,
      ROW_NUMBER() OVER (ORDER BY step_index) AS new_step_index
    FROM steps
    WHERE recipe_id = ${recipeId}
  )

  UPDATE steps s
  SET step_index = us.new_step_index
    FROM updated_steps us
  WHERE s.id = us.id;`;

  revalidatePath(`/recipes/${recipeId}`);
}
