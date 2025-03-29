'use server';

import getDatabase from '@/db/getDatabase';
import { Family } from '@/db/types';

async function getFamily() {
  const sql = await getDatabase();
  const data =
    (await sql`SELECT * FROM families where id=1 limit 1;`) as Family[];

  return data.at(0);
}

export default getFamily;
