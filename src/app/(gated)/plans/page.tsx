import ItemsList from '@/components/items-list';
import { getAllFamilies } from '@/db/family';
import { getAllPlans } from '@/db/plan';

export default async function Home() {
  const families = await getAllFamilies();
  const data = await getAllPlans(families);

  return (
    <ItemsList
      data={data.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        href: `/plans/${item.id}`,
      }))}
      title={families.map((item) => item.name).join(' & ')}
      newHref={'/plans/new'}
    />
  );
}
