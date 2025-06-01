'use client';

import { Button } from '@radix-ui/themes';

import { deleteFamilyById } from '@/db/family';

export default function DeleteButton({ familyId }: { familyId: number }) {
  return (
    <Button
      variant={'soft'}
      color={'red'}
      onClick={() => deleteFamilyById(familyId)}
    >
      Delete family
    </Button>
  );
}
