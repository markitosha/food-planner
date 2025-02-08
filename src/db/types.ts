export type Meal = {
  id: number;
  name: string;
  description: string;
  variant: string;
  recipe_variant_id: number;
  recipe_id: number;
};

export type Family = {
  id: number;
  name: string;
};

export type MealPlan = {
  id: number;
  family_id: number;
  name: string;
  description: string;
};

export type Ingredient = {
  amount: string;
  product_id: number;
  name: string;
  checked: boolean;
  id: number;
  deleted: boolean;
};

export type Recipe = {
  id: number;
  name: string;
  description: string;
};
