import AddMember from './components/add-member';
import DeleteButton from './components/delete-button';
import RemoveButton from './components/remove-button';
import { getAllFamilyMembers } from '@/db/family_members';
import EditableName from './components/editable-name';
import { getFamilyById } from '@/db/family';
import { Flex, Heading, Table } from '@radix-ui/themes';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const family = await getFamilyById(id);
  const members = await getAllFamilyMembers(id);

  if (!family) {
    return <div>Family not found</div>;
  }

  return (
    <Flex direction={'column'} gap={'4'}>
      <Flex justify={'between'} align={'center'}>
        <Heading>
          <EditableName id={id}>{family.name}</EditableName>
        </Heading>
        <DeleteButton familyId={family.id} />
      </Flex>
      <Table.Root variant={'surface'}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {members.map((member) => (
            <Table.Row key={member.id} align={'center'}>
              <Table.Cell>{member.name}</Table.Cell>
              <Table.Cell>{member.email}</Table.Cell>
              <Table.Cell align={'right'}>
                <RemoveButton memberId={member.id} familyId={id} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <AddMember familyId={id} />
    </Flex>
  );
}
