from pydantic import BaseModel, Field
from typing import List

class Ingredient(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    calories_per_g: float
    price_per_g: float

class RecipeIngredient(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    prep_time: int = Field(..., ge=0)
    cook_time: int = Field(..., ge=0)
    ingredients: List[Ingredient]

class CalculationResponse(BaseModel):
    id: int
    calories: float
    price: float
    time: int

    class Config:
        from_attributes = True