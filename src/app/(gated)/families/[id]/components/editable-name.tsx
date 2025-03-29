'use client';

import EditableText from '@/components/EditableText';
import { updateFamilyById } from '@/db/family';

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
      onBlur={(value) => updateFamilyById({ name: value, id })}
    >
      {children}
    </EditableText>
  );
}
