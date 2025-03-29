'use client';

import { removeMemberById } from '@/db/family/members/remove';
import { Cross1Icon } from '@radix-ui/react-icons';
import { IconButton } from '@radix-ui/themes';

export default function RemoveButton({
  familyId,
  memberId,
}: {
  familyId: string;
  memberId: number;
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
