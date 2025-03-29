'use client';

import { addMemberToFamilyByEmail } from '@/db/family/members';
import { DoubleArrowLeftIcon, PlusIcon } from '@radix-ui/react-icons';
import { Button, Flex, TextField, Text } from '@radix-ui/themes';
import { useState } from 'react';

export default function AddMember({ familyId }: { familyId: string }) {
  const [input, setInput] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: any) => {
    const res = await addMemberToFamilyByEmail(familyId, e.target.value);

    setMessage(res);
    setInput(false);
  };

  if (input) {
    return (
      <Flex gap={'4'} align={'center'}>
        <Button
          variant={'ghost'}
          color={'gray'}
          onClick={() => setInput(false)}
        >
          <DoubleArrowLeftIcon />
          Return
        </Button>
        <TextField.Root
          placeholder={'Type email'}
          onBlur={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit(e);
            }
          }}
        />
      </Flex>
    );
  }

  return (
    <Flex direction={'column'} align={'start'} gap={'2'}>
      <Button variant={'ghost'} color={'gray'} onClick={() => setInput(true)}>
        <PlusIcon />
        Click to invite
      </Button>
      <Text size={'1'} color={'ruby'}>
        {message}
      </Text>
    </Flex>
  );
}
