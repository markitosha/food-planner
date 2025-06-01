'use server';

import { revalidatePath } from 'next/cache';

import { Step } from '@/db/schema';
import getDatabase from '@/db/utils/getDatabase';

export async function updateStep(step: Step, value: string, recipeId: string) {
  const sql = await getDatabase();

  await sql`UPDATE steps
            SET instruction = ${value}
            WHERE id = ${step.id} and step_index = ${step.step_index};`;

  revalidatePath(`/recipes/${recipeId}`);
}
