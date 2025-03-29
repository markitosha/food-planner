import PlanForm from '@/components/plan-form';
import { getAllFamilies } from '@/db/family';
import { getAllRecipes } from '@/db/recipe';
import { Flex, Heading, Text } from '@radix-ui/themes';

export default async function Page() {
  const recipes = await getAllRecipes();
  const families = await getAllFamilies();

  if (!families.length) {
    return (
      <Text>
        Meal plan cannot be created outside of the family. Create family (group
        of people) first.
      </Text>
    );
  }

  return (
    <Flex direction={'column'} gap={'2'}>
      <Heading align={'center'}>New plan</Heading>
      <PlanForm recipes={recipes} families={families} />
    </Flex>
  );
}
