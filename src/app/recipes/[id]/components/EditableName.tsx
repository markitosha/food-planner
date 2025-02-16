'use client';

import EditableText from '@/components/EditableText';
import { Step } from '@/db/types';
import updateRecipe from '@/db/updateRecipe';
import updateStepIndex from '@/db/updateStepIndex';

export default function EditableName({ id, children }: {
    id: string,
    children: string,
}) {
    return <EditableText type={'input'} onBlur={value => updateRecipe({ name: value, recipeId: id })}>{children}</EditableText>;
}
