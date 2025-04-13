import { Error } from '@/components';
import { getAllRecipes } from '@/db/recipe';
import { RecipeHeading, RecipeList } from './components';

export default async function Page() {
  const recipes = await getAllRecipes();

  return (
    <>
      <RecipeHeading />
      <RecipeList recipes={recipes.data} />
      <Error error={recipes.error} />
    </>
  );
}
