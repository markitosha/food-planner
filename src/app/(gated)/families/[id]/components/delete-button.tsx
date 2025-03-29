'use client';

import { deleteFamilyById } from '@/db/family/deleteById';
import { Button } from '@radix-ui/themes';

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
