# This script defines each table in the PostgreSQL database

from sqlalchemy import Column, Integer, String, Float, ForeignKey
from databases import Base

class Ingredient(Base):
    __tablename__ = "ingredients"
    id             = Column(Integer, primary_key=True, index=True)
    name           = Column(String, nullable=False, unique=True)
    description    = Column(String, nullable=True)
    calories_per_g = Column(Integer, nullable=False)
    price_per_g    = Column(Integer, nullable=False)

class Recipe(Base):
    __tablename__ = "recipes"
    id        = Column(Integer, primary_key=True, index=True)
    title     = Column(String, nullable=False)
    prep_time = Column(Integer)
    cook_time = Column(Integer)
    steps     = Column(String, nullable=False)

class RecipeIngredient(Base):
    __tablename__ = "recipe_ingredients"
    recipe_id     = Column(Integer, ForeignKey("recipes.id"), primary_key=True)     # Composite primary key
    ingredient_id = Column(Integer, ForeignKey("ingredients.id"), primary_key=True) # Composite primary key
    quantity      = Column(Float, nullable=False)