export interface Recipe {
  ingredients: string[];
  instructions: string[];
}

export interface Meal {
  name: string;
  description: string;
  cookingTimeMinutes: number;
  recipe: Recipe;
}

export interface DayPlan {
  day: string;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
}

export interface ShoppingItem {
  item: string;
  quantity: string;
  category: string;
  notes?: string;
  estimatedPrice: number; // Price in Euros
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface WeeklyPlanResponse {
  locationConfirmed: string;
  supermarketContext: string;
  weeklyPlan: DayPlan[];
  shoppingList: ShoppingItem[];
  sources?: GroundingSource[];
}

export interface UserInput {
  address: string;
  supermarket: string;
  peopleCount: number;
  budget?: string;
  diet?: string;
  unwantedIngredients?: string;
}

export enum AppState {
  IDLE,
  LOADING,
  SUCCESS,
  ERROR
}