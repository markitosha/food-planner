import PlanForm from '@/components/PlanForm';
import { getAllRecipes } from '@/db/recipe';
import { Container, Flex, Heading, Section } from '@radix-ui/themes';

export default async function Page() {
  const recipes = await getAllRecipes();

  return (
    <Section>
      <Container size={'2'}>
        <Flex direction={'column'} gap={'2'}>
          <Heading align={'center'}>New plan</Heading>
          <PlanForm recipes={recipes} />
        </Flex>
      </Container>
    </Section>
  );
}
