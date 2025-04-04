import EditableName from '@/app/(gated)/recipes/[id]/components/EditableName';
import EditableSubtitle from '@/app/(gated)/recipes/[id]/components/EditableSubtitle';
import Ingredients from '@/app/(gated)/recipes/[id]/components/Ingredients';
import RemoveButton from '@/app/(gated)/recipes/[id]/components/RemoveButton';
import StepEditableIndex from '@/app/(gated)/recipes/[id]/components/StepEditableIndex';
import StepEditableText from '@/app/(gated)/recipes/[id]/components/StepEditableText';
import getRecipe from '@/db/getRecipe';
import { getAllProducts } from '@/db/product';
import { getAllUnits } from '@/db/unit';
import { Box, Flex, Heading, Table, Text } from '@radix-ui/themes';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = await getRecipe(id);
  const units = await getAllUnits();
  const products = await getAllProducts();

  if (!recipe) {
    return <Text>Recipe not found</Text>;
  }

  return (
    <Flex gap={'4'} direction={'column'}>
      <Flex justify={'between'} align={'center'}>
        <Box>
          <Heading>
            <EditableName id={id}>{recipe.name}</EditableName>
          </Heading>
          <Text as={'div'} color={'gray'}>
            <EditableSubtitle id={id}>{recipe.description}</EditableSubtitle>
          </Text>
        </Box>
        <RemoveButton id={recipe.id} />
      </Flex>
      <Ingredients recipe={recipe} units={units} products={products} />
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
              <Table.Cell>
                <StepEditableIndex step={step} id={id} />
              </Table.Cell>
              <Table.Cell>
                <StepEditableText step={step} id={id} />
              </Table.Cell>
            </Table.Row>
          ))}
          {/*<Table.Row>*/}
          {/*  <Table.Cell></Table.Cell>*/}
          {/*  <Table.Cell>*/}
          {/*    <Button variant={'soft'} color={'gray'}>Add new...</Button>*/}
          {/*  </Table.Cell>*/}
          {/*</Table.Row>*/}
        </Table.Body>
      </Table.Root>
    </Flex>
  );
}
