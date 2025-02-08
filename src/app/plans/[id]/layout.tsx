import getPlan from '@/db/getPlan';
import { Box, Container, Heading, Section, Tabs } from '@radix-ui/themes';
import { ReactNode } from 'react';

export default async function Layout({
  params,
  meals,
  shopping,
}: {
  params: Promise<{ id: string }>;
  meals: ReactNode;
  shopping: ReactNode;
}) {
  const { id } = await params;
  const plan = await getPlan(id);

  return (
    <Section>
      <Container size={'2'}>
        <Heading align={'center'}>{plan?.name}</Heading>
        <Tabs.Root defaultValue={'meals'}>
          <Tabs.List>
            <Tabs.Trigger value={'meals'}>Meals</Tabs.Trigger>
            <Tabs.Trigger value={'shopping-list'}>Shopping List</Tabs.Trigger>
          </Tabs.List>

          <Box pt="3">
            <Tabs.Content value="meals">{meals}</Tabs.Content>

            <Tabs.Content value="shopping-list">{shopping}</Tabs.Content>
          </Box>
        </Tabs.Root>
      </Container>
    </Section>
  );
}
