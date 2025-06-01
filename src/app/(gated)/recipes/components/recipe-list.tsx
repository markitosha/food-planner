'use client';

import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Flex, TextField } from '@radix-ui/themes';
import { useMemo, useState } from 'react';
import { RecipeCard } from './recipe-card';
import type { RecipeWithVariantCount } from '@/db/recipe';

export function RecipeList({ recipes }: { recipes: RecipeWithVariantCount[] }) {
  const [search, setSearch] = useState('');

  const filteredRecipes = useMemo(
    () =>
      recipes.filter(
        (recipe) =>
          recipe.name.toLowerCase().includes(search.toLowerCase()) ||
          recipe.description?.toLowerCase().includes(search.toLowerCase()),
      ),
    [search, recipes],
  );

  return (
    <>
      <Flex direction={'column'} gap={'2'}>
        <TextField.Root
          placeholder={'Search'}
          onChange={(e) => setSearch(e.target.value)}
        >
          <TextField.Slot>
            <MagnifyingGlassIcon height="16" width="16" />
          </TextField.Slot>
        </TextField.Root>
        {filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </Flex>
    </>
  );
}
