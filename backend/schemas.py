from pydantic import BaseModel, Field
from typing import List

class IngredientItem(BaseModel):
    ingredient_id: int = Field(..., description="The ID of the ingredient from the database")
    quantity: float = Field(..., gt=0, description="Quantity in grams, must be greater than 0")

class RecipeSubmission(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    prep_time: int = Field(..., ge=0)
    cook_time: int = Field(..., ge=0)
    ingredients: List[IngredientItem]

class CalculationResponse(BaseModel):
    id: int
    calories: float
    price: float
    time: int

    class Config:
        from_attributes = True