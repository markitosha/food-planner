import ActionButtons from '@/app/plans/[id]/@shopping/components/ActionButtons';
import CreateShoppingList from '@/app/plans/[id]/@shopping/components/CreateShoppingList';
import getAllIngredients from '@/db/getAllIngredients';
import getMeals from '@/db/getMeals';
import getShoppingList from '@/db/getShoppingList';
import { Box, Table, Text } from '@radix-ui/themes';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ingredients = await getShoppingList(id);
  const meals = await getMeals(id);

  if (!meals.length) {
    return (
      <Box>
        <Text as={'div'} align={'center'} size={'4'} color={'gray'} mt={'4'}>
          Add meals to the plan to view shopping list
        </Text>
      </Box>
    );
  }

  if (!ingredients.length) {
    return <CreateShoppingList />;
  }

  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell align={'right'}>
            Amount
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell align={'right'} />
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {ingredients.map((ingredient) => (
          <Table.Row
            key={ingredient.product_id}
            style={{
              textDecoration: ingredient.checked ? 'line-through' : 'none',
              backgroundColor: ingredient.checked
                ? 'rgba(0, 0, 0, 0.05)'
                : 'transparent',
            }}
          >
            <Table.RowHeaderCell>{ingredient.name}</Table.RowHeaderCell>
            <Table.Cell align={'right'}>{ingredient.amount}</Table.Cell>
            <Table.Cell align={'right'}>
              <ActionButtons {...ingredient} />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
