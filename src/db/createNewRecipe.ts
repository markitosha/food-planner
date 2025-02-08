'use server';

import createIngredients from '@/db/createNewRecipe/createIngredients';
import createRecipe from '@/db/createNewRecipe/createRecipe';
import createRecipeVariants from '@/db/createNewRecipe/createRecipeVariants';
import createSteps from '@/db/createNewRecipe/createSteps';
import updateProducts from '@/db/createNewRecipe/updateProducts';
import updateUnits from '@/db/createNewRecipe/updateUnits';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type HFRecipe = {
  name: string;
  headline: string;
  yields: {
    yields: number;
    ingredients: { unit: string; id: string; amount: number }[];
  }[];
  ingredients: { name: string; id: string }[];
  steps: {
    index: number;
    instructions: string;
  }[];
};

export default async function createNewRecipe({
  hf_data,
}: {
  hf_data: string;
}) {
  const parsedData = JSON.parse(hf_data);
  const recipe: HFRecipe = parsedData.pageProps.ssrPayload.recipe;

  const id = await createRecipe(recipe);

  const vData = await createRecipeVariants(recipe, id);

  await updateProducts(recipe);

  await updateUnits(recipe);

  const res = await createIngredients(recipe, vData);

  await createSteps(recipe, id);

  revalidatePath('/recipes');
  redirect('/recipes');

  return res;
}
