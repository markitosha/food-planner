'use client';

import EditableText from '@/components/EditableText';
import updateRecipe from '@/db/updateRecipe';

export default function EditableSubtitle({
  id,
  children,
}: {
  id: string;
  children: string;
}) {
  return (
    <EditableText
      type={'input'}
      onBlur={(value) => updateRecipe({ description: value, recipeId: id })}
    >
      {children}
    </EditableText>
  );
}
