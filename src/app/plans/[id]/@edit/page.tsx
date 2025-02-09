import PlanForm from '@/components/PlanForm';
import getAllRecipes from '@/db/getAllRecipes';
import getMeals from '@/db/getMeals';
import getPlan from '@/db/getPlan';
import getShoppingList from '@/db/getShoppingList';
import { Container, Flex, Callout } from '@radix-ui/themes';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plan = await getPlan(id);
  const recipes = await getAllRecipes();
  const meals = await getMeals(id);
  const shoppingList = await getShoppingList(id);

  return (
    <>
      {!!shoppingList.length && (
        <Callout.Root mb={'4'}>
          <Callout.Text>
            Can&#39;t change after shopping list was created
          </Callout.Text>
        </Callout.Root>
      )}
      <Container size={'2'}>
        <Flex direction={'column'} gap={'2'}>
          <PlanForm
            recipes={recipes}
            defaultValue={plan}
            meals={meals}
            id={id}
            disabled={!!shoppingList.length}
          />
        </Flex>
      </Container>
    </>
  );
}
