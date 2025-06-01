import { Container, Flex, Callout } from '@radix-ui/themes';

import { PlanForm } from '@/components/plan-form';
import { getAllFamilies } from '@/db/family';
import { getMeals } from '@/db/meal';
import { getMealPlanById } from '@/db/plan';
import { getAllRecipes } from '@/db/recipe';
import { getShoppingList } from '@/db/shopping';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: plan } = await getMealPlanById(id);

  const recipes = await getAllRecipes();
  const meals = await getMeals(id);
  const shoppingList = await getShoppingList(id);
  const families = await getAllFamilies();

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
            recipes={recipes.data}
            defaultValue={plan}
            meals={meals}
            id={id}
            disabled={!!shoppingList.length}
            families={families}
          />
        </Flex>
      </Container>
    </>
  );
}
