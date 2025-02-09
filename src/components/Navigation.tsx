'use client';

import { TabNav } from '@radix-ui/themes';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <TabNav.Root justify={'end'} size={'2'}>
      <TabNav.Link href="/" active={!pathname.includes('/recipes')}>
        Plans
      </TabNav.Link>
      <TabNav.Link href="/recipes" active={pathname.includes('/recipes')}>
        Recipes
      </TabNav.Link>
    </TabNav.Root>
  );
}
