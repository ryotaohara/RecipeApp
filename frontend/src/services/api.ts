import axios from 'axios';
import { RecipeData, IngredientOption, CalculationTotals } from '../types';

/**
 * V-Model: System Design
 * The API_BASE_URL points to your local Python backend on your Mac.
 * In Kubernetes, this would eventually point to the LoadBalancer or Ingress.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create an axios instance with default config
const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  /**
   * Requirement: Fetch ingredients for the dropdown menu.
   * Maps to FastAPI: GET /ingredients
   */
  getIngredients: async (): Promise<IngredientOption[]> => {
    try {
      const response = await client.get<IngredientOption[]>('/ingredients');
      return response.data;
    } catch (error) {
      console.error("V-Model Error: Could not fetch ingredients from Logic Tier", error);
      // Return empty array so UI doesn't crash during DB downtime
      return [];
    }
  },

  /**
   * Requirement: Send recipe data and receive calculated totals.
   * Maps to FastAPI: POST /recipes/calculate
   */
  saveRecipe: async (data: RecipeData): Promise<CalculationTotals> => {
    try {
      // We send the full RecipeData object which matches the Python 'RecipeSubmission' class
      const response = await client.post<CalculationTotals>('/recipes/calculate', data);
      
      console.log("V-Model Integration: Math received from Backend", response.data);
      return response.data;
    } catch (error) {
      console.error("V-Model Error: Calculation request failed", error);
      throw new Error("Failed to communicate with the calculation engine.");
    }
  }
};