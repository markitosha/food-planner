import { HFRecipe } from '@/db/createNewRecipe';
import getDatabase from '@/db/getDatabase';

export default async function updateUnits(recipe: HFRecipe) {
  const sql = await getDatabase();

  const units = recipe.yields.reduce((acc, item) => {
    item.ingredients.forEach((i) => {
      acc.add(i.unit);
    });

    return acc;
  }, new Set<string>());

  await sql.transaction(
    Array.from(units).map(
      (unit) =>
        sql`INSERT INTO units (name) VALUES (${unit}) ON CONFLICT (name) DO NOTHING;`,
    ),
  );

  return units;
}
