'use server';

import getDababase from '@/db/getDababase';
import { Family } from '@/db/types';

async function getFamily() {
  const sql = getDababase();
  const data =
    (await sql`SELECT * FROM families where id=1 limit 1;`) as Family[];

  return data.at(0);
}

export default getFamily;
