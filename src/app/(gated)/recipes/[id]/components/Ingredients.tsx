'use client';

import { Ingredient, Product, Recipe, Unit } from '@/db/types';
import {
  DataList,
  Flex,
  SegmentedControl,
  Select,
  TextField,
} from '@radix-ui/themes';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

function splitArray(arr: any[]) {
  const mid = Math.floor(arr.length / 2);
  const firstHalf = arr.slice(0, mid);
  const secondHalf = arr.slice(mid);

  return [firstHalf, secondHalf];
}

function IngredientEdit({
  ingredient,
  units,
  products,
}: {
  ingredient: Ingredient;
  units: Unit[];
  products: Product[];
}) {
  const [editing, setEditing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editing) {
      return;
    }

    const handler = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        // hack to prevent closing when clicking on the select
        event.target !== document.body
      ) {
        setEditing(false);
      }
    };

    document.addEventListener('click', handler);

    return () => {
      document.removeEventListener('click', handler);
    };
  }, [editing]);

  return (
    <DataList.Item onClick={() => setEditing(true)} ref={ref}>
      {editing ? (
        <>
          <DataList.Label>
            <Select.Root defaultValue={ingredient.product_id.toString()}>
              <Select.Trigger />
              <Select.Content>
                {products.map((product) => (
                  <Select.Item value={product.id.toString()} key={product.id}>
                    {product.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </DataList.Label>
          <DataList.Value>
            <Flex gap={'1'}>
              <TextField.Root
                defaultValue={ingredient.amount}
                type={'number'}
                style={{
                  width: '50px',
                }}
              />
              <Select.Root defaultValue={ingredient.unit_id.toString()}>
                <Select.Trigger />
                <Select.Content>
                  {units.map((unit) => (
                    <Select.Item value={unit.id.toString()} key={unit.id}>
                      {unit.name}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Flex>
          </DataList.Value>
        </>
      ) : (
        <>
          <DataList.Label>
            {ingredient.product}{' '}
            {ingredient.comment ? `(${ingredient.comment})` : ''}
          </DataList.Label>
          <DataList.Value>
            {ingredient.amount} {ingredient.unit}
          </DataList.Value>
        </>
      )}
    </DataList.Item>
  );
}

function IngredientList({
  ingredients,
  units,
  products,
}: {
  ingredients: Ingredient[];
  units: Unit[];
  products: Product[];
}) {
  return (
    <DataList.Root>
      {ingredients.map((ingredient) => (
        <IngredientEdit
          ingredient={ingredient}
          key={ingredient.id}
          units={units}
          products={products}
        />
      ))}
    </DataList.Root>
  );
}

export default function Ingredients({
  recipe,
  units,
  products,
}: {
  recipe: Recipe;
  units: Unit[];
  products: Product[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const variant = searchParams.get('variant');
  const variantIndex =
    variant !== null
      ? recipe.variants.findIndex((item) => item.id.toString() === variant)
      : 0;

  const [firstHalf, secondHalf] = splitArray(
    recipe.variants.at(variantIndex)?.ingredients || [],
  );

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
      <Flex
        justify={'between'}
        gap={'4'}
        direction={{
          initial: 'column',
          sm: 'row',
        }}
      >
        <IngredientList
          ingredients={firstHalf}
          units={units}
          products={products}
        />
        <IngredientList
          ingredients={secondHalf}
          units={units}
          products={products}
        />
      </Flex>
    </>
  );
}
