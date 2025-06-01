'use server';

import { Ingredient } from '@/db/schema';
import { DbReturn } from '@/db/types';
import getDatabase from '@/db/utils/getDatabase';

export type IngredientWithProductAndUnit = Ingredient & {
  product: string;
  unit: string;
};

export async function getIngredientsByVariant(
  variantId: string,
): Promise<DbReturn<IngredientWithProductAndUnit[]>> {
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
                                               WHERE i.recipe_variant_id = ${variantId}
                                               ORDER BY p.name;`) as IngredientWithProductAndUnit[];

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
