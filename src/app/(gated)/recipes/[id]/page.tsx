import { Flex, Text } from '@radix-ui/themes';

import { Error } from '@/components';
import { getRecipeById } from '@/db/recipe';

import { HeaderCard, Steps, Variants } from './components';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = await getRecipeById(id);

  if (!recipe.data) {
    return <Text>Recipe not found</Text>;
  }

  return (
    <Flex direction={'column'} gap={'2'}>
      <HeaderCard recipe={recipe.data} />
      <Variants recipe={recipe.data} />
      <Steps steps={recipe.data.steps} recipeId={id} />
      <Error error={recipe.error} />
    </Flex>
  );
}
