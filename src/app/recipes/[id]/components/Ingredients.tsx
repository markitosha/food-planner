'use client';

import { Recipe } from '@/db/types';
import { DataList, SegmentedControl } from '@radix-ui/themes';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Ingredients({ recipe }: { recipe: Recipe }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const variant = searchParams.get('variant');
  const variantIndex =
    variant !== null
      ? recipe.variants.findIndex((item) => item.id.toString() === variant)
      : 0;

  return (
    <>
      <SegmentedControl.Root
        defaultValue={recipe.variants.at(variantIndex)?.id.toString()}
        onValueChange={(value) => router.replace(`?variant=${value}`)}
      >
        {recipe.variants.map((variant) => (
          <SegmentedControl.Item value={variant.id.toString()} key={variant.id}>
            {variant.name}
          </SegmentedControl.Item>
        ))}
      </SegmentedControl.Root>
      <DataList.Root>
        {recipe.variants.at(variantIndex)?.ingredients.map((ingredient) => (
          <DataList.Item key={ingredient.id}>
            <DataList.Label>
              {ingredient.product}{' '}
              {ingredient.comment ? `(${ingredient.comment})` : ''}
            </DataList.Label>
            <DataList.Value>
              {ingredient.amount} {ingredient.unit}
            </DataList.Value>
          </DataList.Item>
        ))}
      </DataList.Root>
    </>
  );
}
