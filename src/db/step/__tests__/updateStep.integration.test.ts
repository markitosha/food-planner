import { neon } from '@neondatabase/serverless';
import { revalidatePath } from 'next/cache';

import { resetDatabase } from '@/db/__tests__/setup';
import { Step } from '@/db/schema';
import getDatabase from '@/db/utils/getDatabase';

import { updateStep } from '../updateStep';

// Use test database URL from environment variable
const sql = neon(process.env.TEST_DATABASE_URL!);

describe('updateStep', () => {
  let familyId: number;
  let recipeId: number;
  let stepId: number;

  beforeEach(async () => {
    await resetDatabase();

    // Create a family for testing
    const family = await sql`
      INSERT INTO families (name)
      VALUES ('Test Family')
      RETURNING id
    `;
    familyId = family[0].id;

    // Create a recipe
    const recipe = await sql`
      INSERT INTO recipes (name, description, family_id, public)
      VALUES ('Test Recipe', 'Test Description', ${familyId}, true)
      RETURNING id
    `;
    recipeId = recipe[0].id;

    // Create a step
    const step = await sql`
      INSERT INTO steps (recipe_id, step_index, instruction)
      VALUES (${recipeId}, 1, 'Original instruction')
      RETURNING id
    `;
    stepId = step[0].id;
  });

  it('should update step instruction', async () => {
    const step: Step = {
      id: stepId,
      step_index: 1,
      instruction: 'Original instruction',
      image_url: null,
      recipe_id: recipeId,
    };

    await updateStep(step, 'Updated instruction', recipeId.toString());

    // Verify update in database
    const updatedStep = await sql`
      SELECT * FROM steps WHERE id = ${stepId}
    `;
    expect(updatedStep[0].instruction).toBe('Updated instruction');
    expect(revalidatePath).toHaveBeenCalledWith(`/recipes/${recipeId}`);
  });

  it('should handle database errors gracefully', async () => {
    const step: Step = {
      id: stepId,
      step_index: 1,
      instruction: 'Original instruction',
      image_url: null,
      recipe_id: recipeId,
    };

    // Mock database error
    (getDatabase as jest.Mock).mockRejectedValueOnce(
      new Error('Database error'),
    );

    await expect(
      updateStep(step, 'Updated instruction', recipeId.toString()),
    ).rejects.toThrow('Database error');
  });
});
