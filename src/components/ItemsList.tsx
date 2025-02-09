import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import {
  Button,
  Card,
  Container,
  Flex,
  Heading,
  Text,
  TextField,
  CheckboxCards,
} from '@radix-ui/themes';

type Props = {
  data: {
    id: number;
    name: string;
    description: string;
    href?: string;
  }[];
  title?: string;
  newHref?: string;
  checkbox?: boolean;
  buttonLabel?: string;
  defaultValue?: string[];
  disabled?: boolean;
};

export default function ItemsList({
  title,
  data,
  newHref,
  checkbox,
  buttonLabel,
  defaultValue,
  disabled,
}: Props) {
  const CardComponent = checkbox ? CheckboxCards.Item : Card;

  return (
    <Container size={'1'} p={'1'}>
      <Flex direction={'column'} gap={'4'}>
        {title && <Heading align={'center'}>{title}</Heading>}
        <Flex gap={'2'}>
          <TextField.Root
            placeholder="Search…"
            style={{
              width: '100%',
            }}
            disabled={disabled}
          >
            <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" />
            </TextField.Slot>
          </TextField.Root>
          {newHref && (
            <Button asChild>
              <a href={newHref}>{buttonLabel || 'Add new'}</a>
            </Button>
          )}
        </Flex>
        <CheckboxCards.Root
          variant={'classic'}
          name={'recipes'}
          defaultValue={defaultValue}
          disabled={disabled}
        >
          <Flex direction={'column'} gap={'2'}>
            {data.map((item) => (
              <CardComponent
                value={item.id.toString()}
                key={item.id}
                asChild={!checkbox}
              >
                <a href={item.href}>
                  <Text as={'div'} size={'2'} weight={'bold'}>
                    {item.name}
                  </Text>
                  <Text as={'div'} color={'gray'}>
                    {item.description}
                  </Text>
                </a>
              </CardComponent>
            ))}
          </Flex>
        </CheckboxCards.Root>
      </Flex>
    </Container>
  );
}
