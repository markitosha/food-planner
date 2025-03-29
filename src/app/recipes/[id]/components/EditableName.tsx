'use client';

import EditableText from '@/components/EditableText';
import updateRecipe from '@/db/updateRecipe';

export default function EditableName({
  id,
  children,
}: {
  id: string;
  children: string;
}) {
  return (
    <EditableText
      type={'input'}
      onBlur={(value) => updateRecipe({ name: value, recipeId: id })}
    >
      {children}
    </EditableText>
  );
}
