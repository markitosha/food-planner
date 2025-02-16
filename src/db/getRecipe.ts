'use server';

import getDababase from './getDababase';
import { Recipe } from './types';

async function getRecipe(id: string) {
  const sql = getDababase();
  const recipe = (await sql`WITH recipe_info AS (
      SELECT
        r.id AS recipe_id,
        r.name AS recipe_name,
        r.description
      FROM recipes r
      WHERE r.id = ${id}
    ),
          variant_steps AS (
            SELECT
              rv.id AS variant_id,
              JSONB_AGG(
                  JSONB_BUILD_OBJECT(
                      'id', s.id,
                      'step_index', s.step_index,
                      'instruction', s.instruction
                  )
                    ORDER BY s.step_index
              ) AS steps
            FROM recipe_variants rv
                   LEFT JOIN steps s ON rv.recipe_id = s.recipe_id
            WHERE rv.recipe_id = ${id}
            GROUP BY rv.id
          ),
      
          variant_ingredients AS (
            SELECT
              rv.id AS variant_id,
              JSONB_AGG(
                  JSONB_BUILD_OBJECT(
                      'id', i.id,
                      'amount', i.amount,
                      'comment', i.comment,
                      'unit_id', i.unit_id,
                      'unit', u.name,
                      'product_id', i.product_id,
                      'product', p.name
                  )
                  ORDER BY p.name, i.comment
              ) AS ingredients
            FROM recipe_variants rv
                   LEFT JOIN ingredients i ON rv.id = i.recipe_variant_id
                   LEFT JOIN products p ON i.product_id = p.id
                   LEFT JOIN units u ON i.unit_id = u.id
            WHERE rv.recipe_id = ${id}
            GROUP BY rv.id
          )
      
      SELECT
       ri.recipe_id AS id,
       ri.recipe_name AS name,
       ri.description,
       COALESCE(vs.steps, '[]'::jsonb) AS steps,
       JSONB_AGG(
           JSONB_BUILD_OBJECT(
               'id', rv.id,
               'name', rv.variant_name,
               'ingredients', COALESCE(vi.ingredients, '[]'::jsonb)
           )
       ) AS variants
      FROM recipe_info ri
            LEFT JOIN recipe_variants rv ON ri.recipe_id = rv.recipe_id
            LEFT JOIN variant_steps vs ON rv.id = vs.variant_id
            LEFT JOIN variant_ingredients vi ON rv.id = vi.variant_id
      GROUP BY ri.recipe_id, ri.recipe_name, ri.description, vs.steps;`) as Recipe[];

  return recipe.at(0);
}

export default getRecipe;
