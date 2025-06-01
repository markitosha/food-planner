'use client';

import { Button, Flex, Heading, TextArea } from '@radix-ui/themes';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { createRecipeFromJSON } from '@/db/createRecipeFromJSON';

export default function Page() {
  const [loading, setLoading] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const res = await createRecipeFromJSON(data as never);

        if (res.status === 'error') {
          toast.error(res.error);
        } else {
          redirect(`/recipes/${res.data}`);
        }

        setLoading(false);
      }}
    >
      <Flex direction={'column'} gap={'2'}>
        <Heading align={'center'} mb={'4'}>
          New recipe
        </Heading>
        <TextArea placeholder="Put HF request here" name={'hf_data'} />
        <Button type={'submit'} loading={loading}>
          Save
        </Button>
      </Flex>
    </form>
  );
}
