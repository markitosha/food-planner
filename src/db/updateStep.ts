'use server';

import getDatabase from '@/db/getDatabase';
import { Step } from '@/db/types';
import { revalidatePath } from 'next/cache';

export default async function updateStep(
  step: Step,
  value: string,
  recipeId: string,
) {
  const sql = getDatabase();

  await sql`UPDATE steps
            SET instruction = ${value}
            WHERE id = ${step.id} and step_index = ${step.step_index};`;

  revalidatePath(`/recipes/${recipeId}`);
}
