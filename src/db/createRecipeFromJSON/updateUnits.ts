import { collectUniqueUnits } from '@/db/utils';
import getDatabase from '@/db/utils/getDatabase';

import { HFRecipe } from './createRecipeFromJSON';

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
