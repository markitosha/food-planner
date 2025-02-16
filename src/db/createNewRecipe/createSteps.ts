import { HFRecipe } from '@/db/createNewRecipe';
import getDatabase from '@/db/getDatabase';

export default async function createSteps(recipe: HFRecipe, id: number) {
  const sql = getDatabase();

  return sql.transaction(
    recipe.steps.map((step) => {
      return sql`INSERT INTO steps (recipe_id, step_index, instruction)
                VALUES (${id}, ${step.index}, ${step.instructions});`;
    }),
  );
}
