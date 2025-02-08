import getAllIngredients from '@/db/getAllIngredients';
import { Table } from '@radix-ui/themes';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ingredients = await getAllIngredients(id);

  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Amount</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Unit</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {ingredients.map((ingredient) => (
          <Table.Row key={ingredient.product_id + '-' + ingredient.unit}>
            <Table.RowHeaderCell>{ingredient.name}</Table.RowHeaderCell>
            <Table.Cell>{parseFloat(ingredient.amount)}</Table.Cell>
            <Table.Cell>{ingredient.unit}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
