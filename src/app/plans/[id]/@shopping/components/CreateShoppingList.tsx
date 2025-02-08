'use client';

import createShoppingList from '@/db/createShoppingList';
import { Button, Flex, Text } from '@radix-ui/themes';
import { useParams } from 'next/navigation';

export default function CreateShoppingList() {
  const { id } = useParams<{ id: string }>();

  return (
    <Flex mt={'4'} direction={'column'} align={'center'} gap={'4'}>
      <Text color={'gray'}>
        Shopping list hasn&#39;t been created yet. Click on button below to
        create it.
      </Text>
      <Button onClick={() => createShoppingList(id)}>
        Create shopping list
      </Button>
    </Flex>
  );
}
