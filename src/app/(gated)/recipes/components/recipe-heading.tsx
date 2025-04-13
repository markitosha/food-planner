import { Button, Flex, Heading } from '@radix-ui/themes';

export const RecipeHeading = () => {
  return (
    <Flex justify={'between'}>
      <Heading mb={'4'}>Recipes</Heading>
      <Button variant={'soft'} asChild>
        <a href={'/recipes/new'}>Add new</a>
      </Button>
    </Flex>
  );
};
