'use client';

import { EditableText } from '@/components';
import { updateRecipe } from '@/db/recipe';
import { Text } from '@radix-ui/themes';

export function EditableSubtitle({
  id,
  children,
}: {
  id: number;
  children: React.ReactNode;
}) {
  return (
    <Text as={'div'} color={'gray'}>
      <EditableText
        type={'input'}
        onBlur={(value) => updateRecipe({ description: value, recipeId: id })}
      >
        {children}
      </EditableText>
    </Text>
  );
}
