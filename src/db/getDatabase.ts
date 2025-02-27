import { neon } from '@neondatabase/serverless';

export default function getDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }

  return neon(process.env.DATABASE_URL);
}
