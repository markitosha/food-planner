import { neon } from '@neondatabase/serverless';
import { resetDatabase } from '@/db/__tests__/setup';
import { addMemberToFamilyByEmail } from '../addByEmail';
import { revalidatePath } from 'next/cache';

// Use test database URL from environment variable
const sql = neon(process.env.TEST_DATABASE_URL!);

describe('addMemberToFamilyByEmail', () => {
  beforeEach(async () => {
    await resetDatabase();
    jest.clearAllMocks();
  });

  it('should return error when email is empty', async () => {
    const family = await sql`
      INSERT INTO families (name) 
      VALUES ('Test Family') 
      RETURNING id
    `;

    const result = await addMemberToFamilyByEmail(family[0].id.toString(), '');
    expect(result).toBe('Email is required');
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it('should add member to family when user exists', async () => {
    const family = await sql`
      INSERT INTO families (name) 
      VALUES ('Test Family') 
      RETURNING id
    `;

    const result = await addMemberToFamilyByEmail(
      family[0].id.toString(),
      'test@example.com',
    );
    expect(result).toBe('');
    expect(revalidatePath).toHaveBeenCalledWith('/families');

    // Verify member was added
    const members = await sql`
      SELECT * FROM family_members 
      WHERE family_id = ${family[0].id} 
      AND user_id = 'test-user-id'
    `;
    expect(members).toHaveLength(1);
  });

  it('should return error when user not found', async () => {
    const family = await sql`
      INSERT INTO families (name) 
      VALUES ('Test Family') 
      RETURNING id
    `;

    const result = await addMemberToFamilyByEmail(
      family[0].id.toString(),
      'nonexistent@example.com',
    );
    expect(result).toBe('User not found or already in family');
    expect(revalidatePath).toHaveBeenCalledWith('/families');
  });

  it('should not add duplicate members', async () => {
    const family = await sql`
      INSERT INTO families (name) 
      VALUES ('Test Family') 
      RETURNING id
    `;

    // Add member first time
    await addMemberToFamilyByEmail(family[0].id.toString(), 'test@example.com');
    expect(revalidatePath).toHaveBeenCalledWith('/families');

    // Try to add same member again
    const result = await addMemberToFamilyByEmail(
      family[0].id.toString(),
      'test@example.com',
    );
    expect(result).toBe('User not found or already in family');
    expect(revalidatePath).toHaveBeenCalledWith('/families');

    // Verify only one member exists
    const members = await sql`
      SELECT * FROM family_members 
      WHERE family_id = ${family[0].id} 
      AND user_id = 'test-user-id'
    `;
    expect(members).toHaveLength(1);
  });
});
