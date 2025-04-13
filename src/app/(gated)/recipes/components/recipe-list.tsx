import { Flex } from '@radix-ui/themes';
import { RecipeCard } from './recipe-card';
import { RecipeSummary } from '@/db/types';

export function RecipeList({ recipes }: { recipes: RecipeSummary[] }) {
  return (
    <Flex direction={'column'} gap={'2'}>
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </Flex>
  );
}
