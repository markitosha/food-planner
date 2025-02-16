import { Container, Section } from '@radix-ui/themes';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Section>
      <Container size={'2'}>{children}</Container>
    </Section>
  );
}
