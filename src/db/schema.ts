export type Family = {
  id: number;
  name: string;
}

export type FamilyMember = {
  user_id: string;
  family_id: number;
}

export type Ingredient = {
  id: number;
  amount: string;
  unit_id: number;
  product_id: number;
  recipe_variant_id: number;
  comment: string | null;
}

export type MealPlan = {
  id: number;
  name: string;
  description: string | null;
  family_id: number;
}

export type Meal = {
  id: number;
  meal_plan_id: number;
  recipe_variant_id: number;
}

export type Product = {
  id: number;
  name: string;
}

export type RecipeVariant = {
  id: number;
  recipe_id: number;
  variant_name: string;
}

export type Recipe = {
  id: number;
  name: string;
  description: string | null;
  hf_json: any; // JSONB type
  family_id: number;
  public: boolean;
  image_url: string | null;
}

export type Shopping = {
  id: number;
  meal_plan_id: number;
  product_id: number;
  checked: boolean;
  amount: string;
  deleted: boolean;
}

export type Step = {
  id: number;
  recipe_id: number;
  step_index: number;
  instruction: string;
  image_url: string | null;
}

export type Unit = {
  id: number;
  name: string;
}
