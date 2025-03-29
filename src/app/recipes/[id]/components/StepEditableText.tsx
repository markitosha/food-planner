'use client';

import EditableText from '@/components/EditableText';
import { Step } from '@/db/types';
import updateStep from '@/db/updateStep';

export default function StepEditableText({
  step,
  id,
}: {
  step: Step;
  id: string;
}) {
  return (
    <EditableText onBlur={(value) => updateStep(step, value, id)}>
      {step.instruction}
    </EditableText>
  );
}
