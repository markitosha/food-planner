'use client';

import { Cross1Icon } from '@radix-ui/react-icons';
import { IconButton } from '@radix-ui/themes';

import { removeMemberById } from '@/db/family_members';

export default function RemoveButton({
  familyId,
  memberId,
}: {
  familyId: string;
  memberId: string;
}) {
  return (
    <IconButton
      variant={'outline'}
      color={'red'}
      onClick={() => removeMemberById(memberId, familyId)}
    >
      <Cross1Icon />
    </IconButton>
  );
}
