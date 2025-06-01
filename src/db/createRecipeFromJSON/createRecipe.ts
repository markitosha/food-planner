import { put } from '@vercel/blob';

import getDatabase from '@/db/utils/getDatabase';

import { HFRecipe } from './createRecipeFromJSON';

export default async function createRecipe(
  recipe: HFRecipe,
  family_id: number = 1,
) {
  const sql = await getDatabase();

  const name = recipe.name;
  const description = recipe.headline;

  const data =
    await sql`INSERT INTO recipes (name, description, hf_json, family_id) VALUES (${name}, ${description}, ${recipe}, ${family_id}) RETURNING id;`;

  const id = data.at(0)?.id;

  try {
    const img = 'https://img.hellofresh.com/hellofresh_s3' + recipe.imagePath;

    const res = await fetch(img);
    const blob = await res.blob();
    const { url } = await put(`recipes/${id}.jpeg`, blob, {
      access: 'public',
    });

    await sql`UPDATE recipes
              SET image_url = ${url}
              WHERE id = ${id};`;
  } catch (error) {
    console.error(error);
  }

  return data.at(0)?.id;
}
