'use client';

import { Heading } from '@radix-ui/themes';

import { EditableText } from '@/components';
import { updateRecipe } from '@/db/recipe';

export function EditableName({
  id,
  children,
}: {
  id: number;
  children: string;
}) {
  return (
    <Heading>
      <EditableText
        type={'input'}
        onBlur={(value) => updateRecipe({ name: value, recipeId: id })}
      >
        {children}
      </EditableText>
    </Heading>
  );
}
