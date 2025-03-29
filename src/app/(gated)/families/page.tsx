import ItemsList from '@/components/items-list';
import { getAllFamilies } from '@/db/family';

export default async function Page() {
  const families = await getAllFamilies();

  return (
    <ItemsList
      data={families.map((family) => ({
        id: family.id,
        name: family.name,
        href: `/families/${family.id}`,
      }))}
      title={'Families (Groups)'}
      newHref={'/families/new'}
      emptyText={
        'No user groups available, create one or ask another user to add you to one'
      }
    />
  );
}
