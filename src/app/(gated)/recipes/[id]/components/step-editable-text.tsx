'use client';

import { EditableText } from '@/components';
import { Step } from '@/db/types';
import { updateStep } from '@/db/step';

export function StepEditableText({ step, id }: { step: Step; id: string }) {
  return (
    <EditableText onBlur={(value) => updateStep(step, value, id)}>
      {step.instruction}
    </EditableText>
  );
}
