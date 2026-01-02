import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# Import our local database modules
import models
import schemas
from databases import engine, get_db

# Initialize Database tables
# In the V-Model, this ensures the Physical Schema matches our Design
models.Base.metadata.create_all(bind=engine) # Specified tables are created

app = FastAPI(title="Recipe Engine API")

# --- CORS Configuration ---
# Essential for your Mac to allow the Frontend (Port 5173) to talk to Python (Port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend server with its port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Endpoints ---

# Returns all recipes
@app.get("/recipes")
def list_recipes(db: Session = Depends(get_db)):
    return db.query(models.Recipe).all()        # SELECT * from "recipes"

# Adds a new recipe
@app.post("/recipes")
async def calculate_and_save_recipe(submission: schemas.RecipeSubmission, db: Session = Depends(get_db)):
    # 1. Database Phase: Create the Recipe Record
    new_recipe = models.Recipe(
        title     = submission.title,
        prep_time = submission.prep_time,
        cook_time = submission.cook_time,
        steps     = submission.steps
    )
    db.add(new_recipe) # INSERT into the "recipes" table
    db.flush()  # This gets us the new_recipe.id without committing yet

    # 2. Logic Phase: Perform Calculations
    total_calories = 0.0
    total_price = 0.0

    for item in submission.ingredients:
        db_ing = db.query(models.Ingredient).filter(models.Ingredient.id == item.ingredient_id).first()
        if not db_ing:
            raise HTTPException(status_code=404, detail=f"Ingredient {item.ingredient_id} not found")
            
        total_calories += item.quantity * db_ing.calories_per_g
        total_price    += item.quantity * db_ing.price_per_g

        # Link ingredient to the new recipe
        recipe_link = models.RecipeIngredient(
            recipe_id=new_recipe.id,
            ingredient_id=item.ingredient_id,
            quantity=item.quantity
        )
        db.add(recipe_link) # INSERT into the "recipe_ingredients" table

    # 3. Commit the query
    db.commit() # Save everything to PostgreSQL


# Returns all ingredients
@app.get("/ingredients")
def read_ingredients(db: Session = Depends(get_db)):
    return db.query(models.Ingredient).all()    # SELECT * from "ingredients"

# Adds an ingredient
@app.post("/ingredients")
async def add_ingredient(submission: schemas.IngredientSubmission, db: Session = Depends(get_db)):
    new_ing = models.Ingredient(
        name           = submission.name,
        description    = submission.description,
        calories_per_g = submission.calories_per_g,
        price_per_g    = submission.price_per_g
    )
    db.add(new_ing)
    db.commit()

@app.get("/recipes/{recipe_id}")
def get_recipe_ingredients(recipe_id: int, db: Session = Depends(get_db)):
    results = db.query(
        models.RecipeIngredient.quantity,
        models.RecipeIngredient.ingredient_id,
        models.Ingredient.name
    ).filter(
        models.RecipeIngredient.recipe_id == recipe_id
    ).join(
        models.Ingredient, models.Ingredient.id == models.RecipeIngredient.ingredient_id
    ).all()
    return [{"name": r.name, "quantity": r.quantity, "ingredient_id": r.ingredient_id} for r in results]

# Used by Kubernetes Liveness/Readiness probes
@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)