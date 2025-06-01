import { neon } from '@neondatabase/serverless';
import { resetDatabase } from '@/db/__tests__/setup';
import { updateFamilyById } from '../updateById';
import { revalidatePath } from 'next/cache';

// Use test database URL from environment variable
const sql = neon(process.env.TEST_DATABASE_URL!);

describe('updateFamilyById', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it('should update family name and trigger revalidation', async () => {
    // Insert test data
    const result = await sql`
      INSERT INTO families (name) 
      VALUES ('Smith Family')
      RETURNING id
    `;
    const id = result[0].id;

    // Update the family
    await updateFamilyById({
      id: id.toString(),
      name: 'Updated Smith Family',
    });

    // Verify family is updated
    const updatedFamily = await sql`
      SELECT * FROM families WHERE id = ${id}
    `;
    expect(updatedFamily[0].name).toBe('Updated Smith Family');

    // Verify revalidation was called
    expect(revalidatePath).toHaveBeenCalledWith('/families');
    expect(revalidatePath).toHaveBeenCalledWith('/plans');
  });

  it('should handle non-existent family', async () => {
    // Try to update non-existent family
    await updateFamilyById({
      id: '999',
      name: 'New Name',
    });

    // Verify revalidation was called
    expect(revalidatePath).toHaveBeenCalledWith('/families');
    expect(revalidatePath).toHaveBeenCalledWith('/plans');
  });

  it('should handle special characters in name', async () => {
    // Insert test data
    const result = await sql`
      INSERT INTO families (name) 
      VALUES ('Original Name')
      RETURNING id
    `;
    const id = result[0].id;

    // Update with special characters
    await updateFamilyById({
      id: id.toString(),
      name: `O'Connor Family`,
    });

    // Verify family is updated
    const updatedFamily = await sql`
      SELECT * FROM families WHERE id = ${id}
    `;
    expect(updatedFamily[0].name).toBe(`O'Connor Family`);

    // Verify revalidation was called
    expect(revalidatePath).toHaveBeenCalledWith('/families');
    expect(revalidatePath).toHaveBeenCalledWith('/plans');
  });
});
