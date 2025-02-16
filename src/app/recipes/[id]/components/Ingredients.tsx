'use client';

import { Ingredient, Recipe } from '@/db/types';
import { DataList, Flex, SegmentedControl } from '@radix-ui/themes';
import { useRouter, useSearchParams } from 'next/navigation';

function splitArray(arr: any[]) {
    const mid = Math.floor(arr.length / 2);
    const firstHalf = arr.slice(0, mid);
    const secondHalf = arr.slice(mid);
    return [firstHalf, secondHalf];
}

function IngredientList({ ingredients }: { ingredients: Ingredient[] }) {
    return (
        <DataList.Root>
            {ingredients.map((ingredient) => (
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
    )
}

export default function Ingredients({ recipe }: { recipe: Recipe }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const variant = searchParams.get('variant');
  const variantIndex =
    variant !== null
      ? recipe.variants.findIndex((item) => item.id.toString() === variant)
      : 0;

  const [firstHalf, secondHalf] = splitArray(recipe.variants.at(variantIndex)?.ingredients || []);

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
      <Flex justify={'between'} direction={{
          initial: 'column',
          sm: 'row',
      }}>
        <IngredientList ingredients={firstHalf} />
        <IngredientList ingredients={secondHalf} />
      </Flex>
    </>
  );
}
