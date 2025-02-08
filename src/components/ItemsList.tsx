import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import {
  Button,
  Card,
  Container,
  Flex,
  Heading,
  Text,
  TextField,
} from '@radix-ui/themes';

type Props = {
  data: {
    id: number;
    name: string;
    description: string;
    href: string;
  }[];
  title?: string;
};

export default function ItemsList({ title, data }: Props) {
  return (
    <Container size={'1'}>
      <Flex direction={'column'} gap={'4'}>
        {title && <Heading align={'center'}>{title}</Heading>}
        <Flex gap={'2'}>
          <TextField.Root
            placeholder="Search…"
            style={{
              width: '100%',
            }}
          >
            <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" />
            </TextField.Slot>
          </TextField.Root>
          <Button asChild>
            <a href={'/recipes/new'}>Add new</a>
          </Button>
        </Flex>
        <Flex direction={'column'} gap={'2'}>
          {data.map((item) => (
            <Card key={item.id} asChild variant={'classic'}>
              <a href={item.href}>
                <Text as={'div'} size={'2'} weight={'bold'}>
                  {item.name}
                </Text>
                <Text as={'div'} color={'gray'}>
                  {item.description}
                </Text>
              </a>
            </Card>
          ))}
        </Flex>
      </Flex>
    </Container>
  );
}
