'use client';

import createNewRecipe from '@/db/createNewRecipe';
import {
  Button,
  Container,
  Flex,
  Heading,
  Section,
  TextArea,
} from '@radix-ui/themes';

export default function Page() {
  return (
    <Section>
      <Container size={'2'}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData.entries());

            await createNewRecipe(data as never);
          }}
        >
          <Flex direction={'column'} gap={'2'}>
            <Heading align={'center'} mb={'4'}>
              New recipe
            </Heading>
            {/*<TextField.Root name="name" placeholder={'Name'} required />*/}
            {/*<TextField.Root name="description" placeholder={'Description'} />*/}
            <TextArea placeholder="Put HF request here" name={'hf_data'} />
            <Button type={'submit'}>Save</Button>
          </Flex>
        </form>
      </Container>
    </Section>
  );
}
