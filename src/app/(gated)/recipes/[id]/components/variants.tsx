'use client';

import { Ingredients } from './ingredients';
import { FullRecipe } from '@/db/types';
import { Card, Flex, IconButton, SegmentedControl } from '@radix-ui/themes';
import { Edit } from 'lucide-react';
import { useState } from 'react';

export function Variants({ recipe }: { recipe: FullRecipe }) {
  const [current, setCurrent] = useState(recipe.variants[0].id.toString());

  return (
    <Card>
      <Flex justify={'between'}>
        <SegmentedControl.Root
          defaultValue={current}
          onValueChange={(value) => setCurrent(value)}
        >
          {recipe.variants.map((variant) => (
            <SegmentedControl.Item
              value={variant.id.toString()}
              key={variant.id}
            >
              {variant.variant_name}
            </SegmentedControl.Item>
          ))}
        </SegmentedControl.Root>
        <IconButton variant={'soft'} disabled>
          <Edit />
        </IconButton>
      </Flex>
      <Ingredients variant={current} />
    </Card>
  );
}
