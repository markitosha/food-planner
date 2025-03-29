'use client';

import ItemsList from '@/components/items-list';
import { createNewMealPlan, updateMealPlan } from '@/db/plan';
import { Family, Meal, MealPlan, Recipe } from '@/db/types';
import {
  Button,
  Flex,
  ScrollArea,
  Select,
  Separator,
  TextField,
} from '@radix-ui/themes';

type Props = {
  recipes: Recipe[];
  defaultValue?: MealPlan;
  meals?: Meal[];
  id?: string;
  disabled?: boolean;
  families: Family[];
};

export default function PlanForm({
  recipes,
  defaultValue,
  meals = [],
  id,
  disabled,
  families,
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
        <Select.Root
          defaultValue={
            defaultValue?.family_id.toString() || families.at(0)?.id.toString()
          }
          name={'family_id'}
          disabled={disabled}
        >
          <Select.Trigger />
          <Select.Content>
            {families.map((family) => (
              <Select.Item key={family.id} value={family.id.toString()}>
                {family.name}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
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
