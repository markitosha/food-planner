'use client';

import {
  getIngredientsByVariant,
  IngredientWithProductAndUnit,
} from '@/db/ingredient';
import { Box, DataList, Flex, Spinner } from '@radix-ui/themes';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function Ingredients({ variant }: { variant: string }) {
  const [loading, setLoading] = useState(true);
  const [ingredients, setIngredients] = useState<
    IngredientWithProductAndUnit[]
  >([]);

  useEffect(() => {
    setLoading(true);

    getIngredientsByVariant(variant).then((data) => {
      if (data.status === 'error') {
        toast.error(data.error);
        setLoading(false);
        return;
      }

      setIngredients(data.data);
      setLoading(false);
    });
  }, [variant]);

  if (loading) {
    return (
      <Flex align={'center'} justify={'center'}>
        <Spinner />
      </Flex>
    );
  }

  return (
    <Box p={'4'}>
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
    </Box>
  );
}
