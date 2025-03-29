import { stackServerApp } from '@/stack';
import { neon } from '@neondatabase/serverless';

export default async function getDatabase(
  { publicRequest } = {
    publicRequest: false,
  },
) {
  const databaseUrl = publicRequest
    ? process.env.DATABASE_URL
    : process.env.DATABASE_AUTHENTICATED_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not defined');
  }

  if (publicRequest) {
    return neon(databaseUrl);
  }

  const user = await stackServerApp.getUser();
  const authToken = (await user?.getAuthJson())?.accessToken;

  return neon(databaseUrl!, {
    authToken: authToken ?? undefined,
  });
}
