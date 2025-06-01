import { redirect } from 'next/navigation';

import { addFamily } from '@/db/family';

export default async function Page() {
  const newFamily = await addFamily();

  redirect(`/families/${newFamily.id}`);
}
