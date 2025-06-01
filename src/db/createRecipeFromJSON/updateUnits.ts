import { HFRecipe } from './createRecipeFromJSON';
import getDatabase from '@/db/utils/getDatabase';
import { collectUniqueUnits } from '@/db/utils';

export default async function updateUnits(recipe: HFRecipe) {
  const sql = await getDatabase();

  const units = collectUniqueUnits(recipe.yields);

  await sql.transaction(
    Array.from(units).map(
      (unit) =>
        sql`INSERT INTO units (name) VALUES (${unit}) ON CONFLICT (name) DO NOTHING;`,
    ),
  );

  return units;
}
