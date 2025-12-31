export interface IngredientOption {
  id: number;
  name: string;
}

export interface RecipeIngredient {
  ingredient_id: number | string;
  quantity: number;
}

export interface RecipeData {
  title: string;
  servings: number;
  prep_time: number;
  cook_time: number;
  instructions: string;
  ingredients: RecipeIngredient[];
}

export interface CalculationTotals {
  calories: number;
  price: number;
  time: number;
}