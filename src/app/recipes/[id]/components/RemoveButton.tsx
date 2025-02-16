'use client';

import deleteRecipe from '@/db/deleteRecipe';
import { Button } from '@radix-ui/themes';

export default function RemoveButton({ id }: { id: number }) {
  return (
    <Button color={'red'} variant={'soft'} onClick={() => deleteRecipe(id)}>
      Delete recipe
    </Button>
  );
}
