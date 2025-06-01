import { neon } from '@neondatabase/serverless';
import { revalidatePath } from 'next/cache';

import { resetDatabase } from '@/db/__tests__/setup';

import { removeMemberById } from '../remove';

// Use test database URL from environment variable
const sql = neon(process.env.TEST_DATABASE_URL!);

describe('removeMemberById', () => {
  beforeEach(async () => {
    await resetDatabase();
    jest.clearAllMocks();
  });

  it('should remove member from family', async () => {
    // Create a family
    const family = await sql`
      INSERT INTO families (name) 
      VALUES ('Test Family') 
      RETURNING id
    `;

    // Add test user as family member
    await sql`
      INSERT INTO family_members (family_id, user_id)
      VALUES (${family[0].id}, 'test-user-id-second')
    `;

    // Remove member using user_id
    await removeMemberById('test-user-id-second', family[0].id.toString());
    expect(revalidatePath).toHaveBeenCalledWith('/families');

    // Verify member was removed
    const members = await sql`
      SELECT * FROM family_members 
      WHERE family_id = ${family[0].id} 
      AND user_id = 'test-user-id-second'
    `;
    expect(members).toHaveLength(0);
  });

  it('should not throw error when removing non-existent member', async () => {
    // Create a family
    const family = await sql`
      INSERT INTO families (name) 
      VALUES ('Test Family') 
      RETURNING id
    `;

    // Try to remove non-existent member
    await expect(
      removeMemberById('999', family[0].id.toString()),
    ).resolves.not.toThrow();
    expect(revalidatePath).toHaveBeenCalledWith('/families');
  });
});
