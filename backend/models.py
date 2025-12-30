from sqlalchemy import Column, Integer, String, Float, ForeignKey
from database import Base

class Ingredient(Base):
    __tablename__ = "ingredients"
    id             = Column(Integer, primary_key=True, index=True)
    name           = Column(String, unique=True, nullable=False)
    calories_per_g = Column(Float, nullable=False)
    price_per_g    = Column(Float, nullable=False)

class Recipe(Base):
    __tablename__ = "recipes"
    id        = Column(Integer, primary_key=True, index=True)
    title     = Column(String, nullable=False)
    prep_time = Column(Integer)
    cook_time = Column(Integer)

class RecipeIngredient(Base):
    __tablename__ = "recipe_ingredients"
    # Composite Primary Key (Requirement: An ingredient appears once per recipe)
    recipe_id     = Column(Integer, ForeignKey("recipes.id"), primary_key=True)
    ingredient_id = Column(Integer, ForeignKey("ingredients.id"), primary_key=True)
    quantity      = Column(Float, nullable=False)