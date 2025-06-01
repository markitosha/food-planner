import { Badge, Card, Flex, Inset, Text } from '@radix-ui/themes';
import Image from 'next/image';
import type { RecipeWithVariantCount } from '@/db/recipe';

export function RecipeCard({ recipe }: { recipe: RecipeWithVariantCount }) {
  return (
    <Card variant={'classic'} asChild>
      <a href={`/recipes/${recipe.id}`}>
        <Flex gap={'2'}>
          {recipe.image_url && (
            <Inset side={'left'}>
              <Image
                src={recipe.image_url}
                alt={'recipe image'}
                width={'150'}
                height={'105'}
                style={{
                  height: '100%',
                  width: 'auto',
                  objectFit: 'cover',
                }}
              />
            </Inset>
          )}
          <Flex direction={'column'}>
            <Text weight={'medium'}>{recipe.name}</Text>
            <Text color={'gray'}>{recipe.description}</Text>
            <div>
              <Badge variant={'soft'} color={'blue'}>
                {recipe.variant_count} variants
              </Badge>
            </div>
          </Flex>
        </Flex>
      </a>
    </Card>
  );
}
