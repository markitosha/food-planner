'use client';

import { StepEditableText } from './step-editable-text';
import { Step } from '@/db/types';
import { updateStepIndex } from '@/db/step';
import { Flex, IconButton, Table } from '@radix-ui/themes';
import { ArrowDown, ArrowUp } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

export function Steps({
  steps,
  recipeId,
}: {
  steps: Step[];
  recipeId: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleOnSortEnd = async (step1: Step, step2: Step) => {
    setLoading(true);

    const res = await updateStepIndex(step1, step2, recipeId);

    if (res.status === 'error') {
      toast.error(res.error);
    } else {
      toast.success('Step order updated');
    }

    setLoading(false);
  };

  return (
    <Table.Root variant={'surface'}>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>How to cook</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {steps.map((step, index) => (
          <Table.Row key={step.id}>
            <Table.Cell>
              <Flex direction={'column'} gap={'2'}>
                <IconButton
                  variant={'ghost'}
                  color={'gray'}
                  disabled={loading || index === 0}
                  onClick={() => handleOnSortEnd(step, steps[index - 1])}
                >
                  <ArrowUp size={'16'} />
                </IconButton>
                <IconButton
                  variant={'ghost'}
                  color={'gray'}
                  disabled={loading || index === steps.length - 1}
                  onClick={() => handleOnSortEnd(step, steps[index + 1])}
                >
                  <ArrowDown size={'16'} />
                </IconButton>
              </Flex>
            </Table.Cell>
            <Table.Cell>
              <StepEditableText step={step} id={recipeId} />
            </Table.Cell>
            <Table.Cell>
              {step.image_url && (
                <Image
                  src={step.image_url}
                  alt={'Step image'}
                  width={200}
                  height={140}
                  style={{
                    objectFit: 'cover',
                    borderRadius: '4px',
                  }}
                />
              )}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
