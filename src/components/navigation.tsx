'use client';

import { TabNav } from '@radix-ui/themes';
import { usePathname } from 'next/navigation';

const Tabs = [
  { href: '/plans', label: 'Plans' },
  { href: '/recipes', label: 'Recipes' },
  { href: '/families', label: 'Families' },
  { href: '/handler/account-settings', label: 'Account' },
];

export default function Navigation() {
  const pathname = usePathname();
  const tabs = Tabs.map((tab) => ({
    ...tab,
    active: pathname.includes(tab.href),
  }));

  return (
    <TabNav.Root justify={'end'} size={'2'}>
      {tabs.map((tab) => (
        <TabNav.Link href={tab.href} active={tab.active} key={tab.href}>
          {tab.label}
        </TabNav.Link>
      ))}
    </TabNav.Root>
  );
}
