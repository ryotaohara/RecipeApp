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

export interface Ingredient {
  id: number;
  name: string;
  description: string;
  calories_per_g: number;
  price_per_g: number;
}

export interface Recipe {
  id: number;
  title: string;
  prep_time: number;
  cook_time: number;
  calories?: number;
  price?: number;
}

export interface RecipeSubmission {
  title: string;
  prep_time: number;
  cook_time: number;
  ingredients: {
    ingredient_id: number;
    quantity: number;
  }[];
}