import ItemsList from '@/components/ItemsList';
import getAllRecipes from '@/db/getAllRecipes';

export default async function Page() {
  const recipes = await getAllRecipes();

  return (
    <ItemsList
      data={recipes.map((recipe) => ({
        id: recipe.id,
        name: recipe.name,
        description: recipe.description,
        href: `/recipes/${recipe.id}`,
      }))}
      title={'Recipes'}
      newHref={'/recipes/new'}
    />
  );
}
