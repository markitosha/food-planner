import { neon } from '@neondatabase/serverless';
import { resetDatabase } from '@/db/__tests__/setup';
import { getAllFamilyMembers } from '../getAll';

// Use test database URL from environment variable
const sql = neon(process.env.TEST_DATABASE_URL!);

describe('getAllFamilyParticipants', () => {
  beforeEach(async () => {
    await resetDatabase();
    jest.clearAllMocks();
  });

  it('should return empty array when family has no members', async () => {
    // Create a family
    const family = await sql`
      INSERT INTO families (name) 
      VALUES ('Test Family') 
      RETURNING id
    `;

    const members = await getAllFamilyMembers(family[0].id.toString());
    expect(members).toEqual([]);
  });

  it('should return all family members', async () => {
    // Create a family
    const family = await sql`
      INSERT INTO families (name) 
      VALUES ('Test Family') 
      RETURNING id
    `;

    // Add test user as family member
    await sql`
      INSERT INTO family_members (family_id, user_id)
      VALUES (${family[0].id}, 'test-user-id')
    `;

    const members = await getAllFamilyMembers(family[0].id.toString());
    expect(members).toHaveLength(1);
    expect(members[0]).toEqual({
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User'
    });
  });
}); 