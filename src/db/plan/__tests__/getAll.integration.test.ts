import { neon } from '@neondatabase/serverless';
import { resetDatabase } from '@/db/__tests__/setup';
import { getAllPlans } from '../getAll';
import getDatabase from '@/db/utils/getDatabase';

// Use test database URL from environment variable
const sql = neon(process.env.TEST_DATABASE_URL!);

describe('getAllPlans', () => {
  let familyId: number;

  beforeEach(async () => {
    await resetDatabase();

    // Create a family for testing
    const family = await sql`
      INSERT INTO families (name)
      VALUES ('Test Family')
      RETURNING id
    `;
    familyId = family[0].id;

    // Create meal plans
    await sql`
      INSERT INTO meal_plans (name, description, family_id)
      VALUES 
        ('Test Meal Plan 1', 'Test Description 1', ${familyId}),
        ('Test Meal Plan 2', 'Test Description 2', ${familyId})
    `;
  });

  it('should return all meal plans', async () => {
    const plans = await getAllPlans();

    expect(plans).toHaveLength(2);
    expect(plans).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Test Meal Plan 1',
          description: 'Test Description 1',
          family_id: familyId
        }),
        expect.objectContaining({
          name: 'Test Meal Plan 2',
          description: 'Test Description 2',
          family_id: familyId
        })
      ])
    );
  });

  it('should return empty array when no meal plans exist', async () => {
    await sql`DELETE FROM meal_plans`;
    const plans = await getAllPlans();

    expect(plans).toHaveLength(0);
  });

  it('should handle database errors gracefully', async () => {
    // Mock database error
    (getDatabase as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

    await expect(getAllPlans())
      .rejects.toThrow('Database error');
  });
}); 