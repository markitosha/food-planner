'use server';

import getDatabase from '@/db/utils/getDatabase';
import { Step } from '@/db/schema';
import { revalidatePath } from 'next/cache';

export async function updateStep(step: Step, value: string, recipeId: string) {
  const sql = await getDatabase();

  await sql`UPDATE steps
            SET instruction = ${value}
            WHERE id = ${step.id} and step_index = ${step.step_index};`;

  revalidatePath(`/recipes/${recipeId}`);
}
