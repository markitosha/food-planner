import { neon } from '@neondatabase/serverless';
import { resetDatabase } from '@/db/__tests__/setup';
import { addFamily } from '../addNew';

// Use test database URL from environment variable
const sql = neon(process.env.TEST_DATABASE_URL!);

describe('addFamily', () => {
  beforeEach(async () => {
    await resetDatabase();
    jest.clearAllMocks();
  });

  it('should create new family and add current user as member', async () => {
    const family = await addFamily();

    // Verify family was created
    expect(family).toEqual({
      id: expect.any(Number),
      name: 'Family',
    });

    // Verify family exists in database
    const createdFamily = await sql`
      SELECT * FROM families WHERE id = ${family.id}
    `;
    expect(createdFamily).toHaveLength(1);
    expect(createdFamily[0].name).toBe('Family');

    // Verify user was added as family member
    const familyMember = await sql`
      SELECT * FROM family_members 
      WHERE family_id = ${family.id} 
      AND user_id = 'test-user-id'
    `;
    expect(familyMember).toHaveLength(1);
  });
});
