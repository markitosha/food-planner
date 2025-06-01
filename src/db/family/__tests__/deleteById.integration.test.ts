import { neon } from '@neondatabase/serverless';
import { resetDatabase } from '@/db/__tests__/setup';
import { deleteFamilyById } from '../deleteById';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const sql = neon(process.env.TEST_DATABASE_URL!);

describe('deleteFamilyById', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it('should delete family and trigger revalidation', async () => {
    // Insert test data
    const result = await sql`
      INSERT INTO families (name) 
      VALUES ('Smith Family')
      RETURNING id
    `;
    const id = result[0].id;

    // Delete the family
    await deleteFamilyById(id);

    // Verify family is deleted
    const deletedFamily = await sql`
      SELECT * FROM families WHERE id = ${id}
    `;
    expect(deletedFamily).toHaveLength(0);

    // Verify revalidation was called
    expect(revalidatePath).toHaveBeenCalledWith('/families');
    expect(revalidatePath).toHaveBeenCalledWith('/plans');

    // Verify redirect was called
    expect(redirect).toHaveBeenCalledWith('/families');
  });

  it('should handle non-existent family', async () => {
    // Try to delete non-existent family
    await deleteFamilyById(999);

    // Verify revalidation was called
    expect(revalidatePath).toHaveBeenCalledWith('/families');
    expect(revalidatePath).toHaveBeenCalledWith('/plans');

    // Verify redirect was called
    expect(redirect).toHaveBeenCalledWith('/families');
  });
});
