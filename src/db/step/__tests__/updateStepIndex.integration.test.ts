import { neon } from '@neondatabase/serverless';
import { revalidatePath } from 'next/cache';

import { resetDatabase } from '@/db/__tests__/setup';
import { Step } from '@/db/schema';
import getDatabase from '@/db/utils/getDatabase';

import { updateStepIndex } from '../updateStepIndex';

// Use test database URL from environment variable
const sql = neon(process.env.TEST_DATABASE_URL!);

describe('updateStepIndex', () => {
  let familyId: number;
  let recipeId: number;
  let step1Id: number;
  let step2Id: number;

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

    // Create steps
    const steps = await sql`
      INSERT INTO steps (recipe_id, step_index, instruction)
      VALUES 
        (${recipeId}, 1, 'Step 1'),
        (${recipeId}, 2, 'Step 2')
      RETURNING id
    `;
    step1Id = steps[0].id;
    step2Id = steps[1].id;
  });

  it('should swap step indices', async () => {
    const step1: Step = {
      id: step1Id,
      step_index: 1,
      instruction: 'Step 1',
      image_url: null,
      recipe_id: recipeId,
    };

    const step2: Step = {
      id: step2Id,
      step_index: 2,
      instruction: 'Step 2',
      image_url: null,
      recipe_id: recipeId,
    };

    const result = await updateStepIndex(step1, step2, recipeId.toString());

    expect(result.status).toBe('success');
    expect(revalidatePath).toHaveBeenCalledWith(`/recipes/${recipeId}`);

    // Verify indices were swapped in database
    const updatedSteps = await sql`
      SELECT * FROM steps WHERE id IN (${step1Id}, ${step2Id})
      ORDER BY step_index
    `;
    expect(updatedSteps[0].id).toBe(step2Id);
    expect(updatedSteps[0].step_index).toBe(1);
    expect(updatedSteps[1].id).toBe(step1Id);
    expect(updatedSteps[1].step_index).toBe(2);
  });

  it('should handle database errors gracefully', async () => {
    const step1: Step = {
      id: step1Id,
      step_index: 1,
      instruction: 'Step 1',
      image_url: null,
      recipe_id: recipeId,
    };

    const step2: Step = {
      id: step2Id,
      step_index: 2,
      instruction: 'Step 2',
      image_url: null,
      recipe_id: recipeId,
    };

    // Mock database error
    (getDatabase as jest.Mock).mockRejectedValueOnce(
      new Error('Database error'),
    );

    const result = await updateStepIndex(step1, step2, recipeId.toString());
    expect(result).toEqual({
      data: null,
      status: 'error',
      error: "Couldn't update step index: Database error",
    });
  });
});
