'use client';

import { Button } from '@radix-ui/themes';
import { redirect } from 'next/navigation';
import { useState } from 'react';

import { Error } from '@/components';
import { deleteRecipe } from '@/db/recipe';

export function RemoveButton({ id }: { id: number }) {
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleClick = async () => {
    setDisabled(true);
    const res = await deleteRecipe(id);

    if (res.status === 'error') {
      setDisabled(false);
      setError(res.error);
      return;
    }

    redirect('/recipes');
  };

  return (
    <>
      <Button
        color={'red'}
        variant={'ghost'}
        disabled={disabled}
        onClick={handleClick}
      >
        Delete recipe
      </Button>
      <Error error={error} />
    </>
  );
}
