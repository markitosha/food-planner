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

export type ShoppingIngredient = Ingredient & {
  checked: boolean;
  deleted: boolean;
};

export type Variant = {
  id: number;
  variant_name: string;
};

export type Step = {
  id: number;
  step_index: number;
  instruction: string;
  image_url?: string;
};

export type FullRecipe = {
  id: number;
  name: string;
  description: string;
  image_url?: string;
  variants: Variant[];
  steps: Step[];
};

export type FamilyMember = {
  user_id: number;
  family_id: number;
};

export type User = {
  id: number;
  name: string;
  email: string;
};

export type FamilyMemberUser = FamilyMember & User;

export type Unit = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
};

export type DbReturn<T> = {
  data: T;
  status: 'success' | 'error';
  error?: string;
};

export type RecipeSummary = {
  id: number;
  name: string;
  description: string;
  image_url?: string;
  variant_count?: number;
};

export type Ingredient = {
  amount: string;
  product: string;
  product_id: number;
  name: string;
  id: number;
  unit: string;
  unit_id: number;
  comment: string;
};
