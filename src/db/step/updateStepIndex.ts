'use server';

import getDatabase from '@/db/getDatabase';
import { DbReturn, Step } from '@/db/types';
import { revalidatePath } from 'next/cache';

export async function updateStepIndex(
  step1: Step,
  step2: Step,
  recipeId: string,
): Promise<DbReturn<null>> {
  try {
    const sql = await getDatabase();

    await sql`UPDATE steps
              SET step_index = CASE
                WHEN id = ${step1.id} THEN ${step2.step_index}
                WHEN id = ${step2.id} THEN ${step1.step_index}
                ELSE step_index
              END
              WHERE id IN (${step1.id}, ${step2.id});`;

    revalidatePath(`/recipes/${recipeId}`);

    return {
      data: null,
      status: 'success',
    };
  } catch (error) {
    return {
      data: null,
      status: 'error',
      error: `Couldn't update step index: ${error}`,
    };
  }
}
