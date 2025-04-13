import { RecipeSummary } from '@/db/types';
import { Badge, Card, Flex, Inset, Text } from '@radix-ui/themes';
import Image from 'next/image';

export function RecipeCard({ recipe }: { recipe: RecipeSummary }) {
  return (
    <Card variant={'classic'} asChild>
      <a href={`/recipes/${recipe.id}`}>
        <Flex gap={'2'}>
          {recipe.image_url && (
            <Inset side={'left'}>
              <Image
                src={recipe.image_url}
                alt={'recipe image'}
                width={'200'}
                height={'140'}
                objectFit={'cover'}
                style={{
                  height: '100%',
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
