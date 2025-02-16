'use client';

import EditableText from '@/components/EditableText';
import { Step } from '@/db/types';
import updateRecipe from '@/db/updateRecipe';
import updateStepIndex from '@/db/updateStepIndex';

export default function EditableSubtitle({ id, children }: {
    id: string,
    children: string,
}) {
    return <EditableText type={'input'} onBlur={value => updateRecipe({ description: value, recipeId: id })}>{children}</EditableText>;
}
