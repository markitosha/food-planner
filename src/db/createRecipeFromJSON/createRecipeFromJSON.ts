'use server';

import createIngredients from './createIngredients';
import createRecipe from './createRecipe';
import createRecipeVariants from './createRecipeVariants';
import createSteps from './createSteps';
import updateProducts from './updateProducts';
import updateUnits from './updateUnits';
import { DbReturn } from '@/db/types';
import { revalidatePath } from 'next/cache';

export type HFRecipe = {
  name: string;
  headline: string;
  imagePath: string;
  yields: {
    yields: number;
    ingredients: { unit: string; id: string; amount: number }[];
  }[];
  ingredients: { name: string; id: string }[];
  steps: {
    index: number;
    instructions: string;
    images: {
      path: string;
    }[];
  }[];
};

export async function createRecipeFromJSON({
  hf_data,
  family_id = 1,
}: {
  hf_data: string;
  family_id: number;
}): Promise<DbReturn<number | null>> {
  let recipe: HFRecipe;

  try {
    const parsedData = JSON.parse(hf_data);

    recipe = parsedData.pageProps.ssrPayload.recipe;
  } catch (e: any) {
    return {
      data: null,
      error: `Can't parse JSON: ${e.message}`,
      status: 'error',
    };
  }

  try {
    const id = await createRecipe(recipe, family_id);

    const vData = await createRecipeVariants(recipe, id);

    await updateProducts(recipe);

    await updateUnits(recipe);

    await createIngredients(recipe, vData);

    await createSteps(recipe, id);

    revalidatePath('/');

    return {
      data: id,
      status: 'success',
    };
  } catch (error: any) {
    return {
      data: null,
      error: `Can't create recipe: ${error.message}`,
      status: 'error',
    };
  }
}
