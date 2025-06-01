'use client';

import { CheckIcon, Cross1Icon, TrashIcon } from '@radix-ui/react-icons';
import { IconButton } from '@radix-ui/themes';

import { ShoppingWithProduct, updateShoppingList } from '@/db/shopping';

type Props = ShoppingWithProduct;

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
