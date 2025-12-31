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
    allow_origins=["*"],  # In production, replace with your specific domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Endpoints ---

# Returns a list of ingredients for the dropdown on the frontend
@app.get("/ingredients")
def read_ingredients(db: Session = Depends(get_db)):
    return db.query(models.Ingredient).all() # SELECT * from "ingredients"

# Returns all recipes
@app.get("/recipes")
def list_recipes(db: Session = Depends(get_db)):
    return db.query(models.Recipe).all()

# Inserts a new recipe with the frontend inputs
@app.post("/recipes/calculate", response_model=schemas.CalculationResponse)
async def calculate_and_save_recipe(submission: schemas.RecipeIngredient, db: Session = Depends(get_db)):
    # 1. Database Phase: Create the Recipe Record
    new_recipe = models.Recipe(
        title     = submission.title,
        prep_time = submission.prep_time,
        cook_time = submission.cook_time
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
    
    return {
        "id": new_recipe.id,
        "calories": round(total_calories, 1),
        "price": round(total_price, 2),
        "time": submission.prep_time + submission.cook_time
    }

# Adds an ingredient
@app.post("/add_ingredients")
async def add_ingredient(item: schemas.Ingredient, db: Session = Depends(get_db)):
    new_ing  = models.Ingredient(
        name  = item.name,
        calories_per_g = item.calories_per_g,
        price_per_g = item.price_per_g
    )
    db.add(new_ing)
    db.commit()

@app.get("/health")
def health_check():
    """Used by Kubernetes Liveness/Readiness probes."""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)