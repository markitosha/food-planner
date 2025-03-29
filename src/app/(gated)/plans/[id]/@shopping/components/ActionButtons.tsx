'use client';

import { Ingredient } from '@/db/types';
import updateShoppingList from '@/db/updateShoppingList';
import { CheckIcon, Cross1Icon, TrashIcon } from '@radix-ui/react-icons';
import { IconButton } from '@radix-ui/themes';

type Props = Ingredient;

export default function ActionButtons(props: Props) {
  return (
    <>
      <IconButton
        variant={'surface'}
        mr={'2'}
        onClick={() =>
          updateShoppingList({
            ...props,
            checked: !props.checked,
          })
        }
        color={props.checked ? 'blue' : 'green'}
      >
        {!props.checked ? <CheckIcon /> : <Cross1Icon />}
      </IconButton>
      <IconButton
        variant={'surface'}
        color={'red'}
        onClick={() =>
          updateShoppingList({
            ...props,
            deleted: true,
          })
        }
      >
        <TrashIcon />
      </IconButton>
    </>
  );
}
