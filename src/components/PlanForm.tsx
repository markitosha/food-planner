'use client';

import ItemsList from '@/components/items-list';
import createNewMealPlan from '@/db/createNewMealPlan';
import { Meal, MealPlan, Recipe } from '@/db/types';
import updateMealPlan from '@/db/updateMealPlan';
import {
  Button,
  Flex,
  ScrollArea,
  Separator,
  TextField,
} from '@radix-ui/themes';

type Props = {
  recipes: Recipe[];
  defaultValue?: MealPlan;
  meals?: Meal[];
  id?: string;
  disabled?: boolean;
};

export default function PlanForm({
  recipes,
  defaultValue,
  meals = [],
  id,
  disabled,
}: Props) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        if (disabled) {
          return;
        }

        const formData = new FormData(e.currentTarget);

        if (id) {
          updateMealPlan(id, formData, meals);
          return;
        }

        createNewMealPlan(formData);
      }}
    >
      <Flex direction={'column'} gap={'4'}>
        <TextField.Root
          placeholder="Name"
          name={'name'}
          defaultValue={defaultValue?.name}
          disabled={disabled}
        />
        <TextField.Root
          placeholder="Description"
          name={'description'}
          defaultValue={defaultValue?.description}
          disabled={disabled}
        />
        <Separator
          style={{
            width: '100%',
          }}
        />
        <ScrollArea>
          <ItemsList
            data={recipes.map((recipe) => ({
              id: recipe.id,
              name: recipe.name,
              description: recipe.description,
            }))}
            defaultValue={meals.map((meal) => meal.recipe_id.toString())}
            checkbox
            disabled={disabled}
          />
        </ScrollArea>
        <Button type={'submit'} disabled={disabled}>
          Save
        </Button>
      </Flex>
    </form>
  );
}
