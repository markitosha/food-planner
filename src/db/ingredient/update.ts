'use server';

import getDatabase from '@/db/utils/getDatabase';
import { Ingredient } from '@/db/schema';
import { revalidatePath } from 'next/cache';

export async function updateIngredient(ingredient: Ingredient) {
  const sql = await getDatabase();

  await sql`UPDATE ingredients
        SET amount = ${ingredient.amount},
            unit_id = ${ingredient.unit_id},
            product_id = ${ingredient.product_id}
        WHERE id=${ingredient.id};`;

  revalidatePath('/recipes');
}
