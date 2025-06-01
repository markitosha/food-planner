import { neon } from '@neondatabase/serverless';

import { resetDatabase } from '@/db/__tests__/setup';
import getDatabase from '@/db/utils/getDatabase';

import { getMealPlanById } from '../getById';

// Use test database URL from environment variable
const sql = neon(process.env.TEST_DATABASE_URL!);

describe('getMealPlanById', () => {
  let familyId: number;
  let mealPlanId: number;

  beforeEach(async () => {
    await resetDatabase();

    // Create a family for testing
    const family = await sql`
      INSERT INTO families (name)
      VALUES ('Test Family')
      RETURNING id
    `;
    familyId = family[0].id;

    // Create a meal plan
    const mealPlan = await sql`
      INSERT INTO meal_plans (name, description, family_id)
      VALUES ('Test Meal Plan', 'Test Description', ${familyId})
      RETURNING id
    `;
    mealPlanId = mealPlan[0].id;
  });

  it('should return meal plan by id', async () => {
    const result = await getMealPlanById(mealPlanId.toString());

    expect(result.status).toBe('success');
    expect(result.data).toEqual(
      expect.objectContaining({
        id: mealPlanId,
        name: 'Test Meal Plan',
        description: 'Test Description',
        family_id: familyId,
      }),
    );
  });

  it('should return null for non-existent meal plan', async () => {
    const result = await getMealPlanById('999999');

    expect(result.status).toBe('success');
    expect(result.data).toBeNull();
  });

  it('should handle database errors gracefully', async () => {
    // Mock database error
    (getDatabase as jest.Mock).mockRejectedValueOnce(
      new Error('Database error'),
    );

    const result = await getMealPlanById(mealPlanId.toString());

    expect(result.status).toBe('error');
    expect(result.data).toBeNull();
    expect(result.error).toBe("Couldn't get meal plan: Error: Database error");
  });
});
