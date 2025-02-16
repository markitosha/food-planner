'use client';

import EditableText from '@/components/EditableText';
import { Step } from '@/db/types';
import updateStepIndex from '@/db/updateStepIndex';

export default function StepEditableIndex({ step, id }: {
    step: Step,
    id: string,
}) {
    return <EditableText onBlur={value => updateStepIndex(step, value, id)}>{step.step_index}</EditableText>;
}
