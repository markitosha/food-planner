import ItemsList from '@/components/ItemsList';
import getMeals from '@/db/getMeals';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meals = await getMeals(id);

  return (
    <ItemsList
      data={meals.map((meal) => ({
        id: meal.id,
        name: meal.name,
        description: meal.description,
        href: `/recipes/${meal.recipe_id}?variant=${meal.recipe_variant_id}`,
      }))}
    />
  );
}
