import { Flex, Spinner } from '@radix-ui/themes';

export default function Loading() {
  return (
    <Flex width={'100vw'} height={'100vh'} align={'center'} justify={'center'}>
      <Spinner size={'3'} />
    </Flex>
  );
}
