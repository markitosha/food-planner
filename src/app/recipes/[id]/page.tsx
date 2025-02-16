import Ingredients from '@/app/recipes/[id]/components/Ingredients';
import getRecipe from '@/db/getRecipe';
import { Box, Flex, Heading, Table, Text } from '@radix-ui/themes';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = await getRecipe(id);

  if (!recipe) {
    return <Text>Recipe not found</Text>;
  }

  return (
    <Flex gap={'4'} direction={'column'}>
      <Box>
        <Heading>{recipe.name}</Heading>
        <Text as={'div'} color={'gray'}>
          {recipe.description}
        </Text>
      </Box>
      <Table.Root variant={'surface'}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>How to cook</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {recipe.steps.map((step) => (
            <Table.Row key={step.id}>
              <Table.Cell>{step.step_index}</Table.Cell>
              <Table.Cell>{step.instruction}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Ingredients recipe={recipe} />
    </Flex>
  );
}
