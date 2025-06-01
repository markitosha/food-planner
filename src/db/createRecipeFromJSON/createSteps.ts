import { HFRecipe } from './createRecipeFromJSON';
import getDatabase from '@/db/utils/getDatabase';
import { put } from '@vercel/blob';

export default async function createSteps(recipe: HFRecipe, id: number) {
  const sql = await getDatabase();

  await sql.transaction(
    recipe.steps.map((step) => {
      return sql`INSERT INTO steps (recipe_id, step_index, instruction)
                VALUES (${id}, ${step.index}, ${step.instructions});`;
    }),
  );

  for (const item of recipe.steps) {
    try {
      const img =
        'https://img.hellofresh.com/hellofresh_s3' + item.images[0].path;

      const res = await fetch(img);
      const blob = await res.blob();
      const { url } = await put(`steps/${id}_${item.index}.jpeg`, blob, {
        access: 'public',
      });

      await sql`UPDATE steps
                SET image_url = ${url}
                WHERE recipe_id = ${id}
                  AND step_index = ${item.index};`;
    } catch (error) {
      console.error(error);
    }
  }
}
