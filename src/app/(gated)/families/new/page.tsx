import { addFamily } from '@/db/family';
import { redirect } from 'next/navigation';

export default async function Page() {
  const newFamily = await addFamily();

  redirect(`/families/${newFamily.id}`);
}
