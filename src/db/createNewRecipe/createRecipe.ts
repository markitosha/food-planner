import { HFRecipe } from '@/db/createNewRecipe';
import getDatabase from '@/db/getDatabase';

export default async function createRecipe(recipe: HFRecipe) {
  const sql = await getDatabase();

  const name = recipe.name;
  const description = recipe.headline;

  const data =
    await sql`INSERT INTO recipes (name, description, hf_json) VALUES (${name}, ${description}, ${recipe}) RETURNING id;`;

  return data.at(0)?.id;
}
