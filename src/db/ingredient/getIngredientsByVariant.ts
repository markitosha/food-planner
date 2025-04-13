'use server';

import getDatabase from '@/db/getDatabase';
import { DbReturn, Ingredient } from '@/db/types';

export async function getIngredientsByVariant(
  variantId: string,
): Promise<DbReturn<Ingredient[]>> {
  try {
    const sql = await getDatabase();

    const data = (await sql`SELECT
                                                   i.id,
                                                   i.amount,
                                                   i.comment,
                                                   i.product_id,
                                                   p.name AS product,
                                                   i.unit_id,
                                                   u.name AS unit
                                               FROM ingredients i
                                                        JOIN products p ON i.product_id = p.id
                                                        JOIN units u ON i.unit_id = u.id
                                               WHERE i.recipe_variant_id = ${variantId};`) as Ingredient[];

    return {
      data,
      status: 'success',
    };
  } catch (error: any) {
    return {
      data: [],
      status: 'error',
      error: `Couldn't get ingredients by variant: ${error}`,
    };
  }
}
