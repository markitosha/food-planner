import React from 'react';

import { stackServerApp } from '@/stack';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await stackServerApp.getUser({ or: 'redirect' });

  return children;
}
