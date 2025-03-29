import ItemsList from '@/components/items-list';
import getAllPlans from '@/db/getAllPlans';
import getFamily from '@/db/getFamily';
import { Section } from '@radix-ui/themes';

export default async function Home() {
  const family = await getFamily();
  const data = await getAllPlans();

  return (
    <Section>
      <ItemsList
        data={data.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          href: `/plans/${item.id}`,
        }))}
        title={family?.name}
        newHref={'/plans/new'}
      />
    </Section>
  );
}
