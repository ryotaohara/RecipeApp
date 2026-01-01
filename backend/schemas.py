# This script enforces data contracts of input from the frontend based on "pydantic"

from pydantic import BaseModel, Field
from typing import List

class RecipeIngredientItem(BaseModel):
    ingredient_id: int
    quantity: float = Field(..., gt=0)

# Ingredient contract on "RecipeForm"
class RecipeSubmission(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    prep_time: int = Field(..., ge=0)
    cook_time: int = Field(..., ge=0)
    steps: str = Field(..., min_length=1, max_length=1000)
    ingredients: List[RecipeIngredientItem]

class CalculationResponse(BaseModel):
    id: int
    calories: float
    price: float

    class Config:
        from_attributes = True

# Ingredient contract on "IngredientForm"
class IngredientSubmission(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1, max_length=255)
    calories_per_g: int
    price_per_g: int