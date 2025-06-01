import Image from 'next/image';

import { FullRecipe } from '@/db/recipe';

export function RecipeImage({ recipe }: { recipe: FullRecipe }) {
  return (
    recipe.image_url && (
      <Image
        src={recipe.image_url}
        alt={recipe.name}
        width={'200'}
        height={'140'}
        style={{
          height: '100%',
          width: 'auto',
          objectFit: 'cover',
        }}
      />
    )
  );
}
