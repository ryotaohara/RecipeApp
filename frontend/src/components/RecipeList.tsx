import React, { useEffect, useState } from 'react';

export const RecipeList: React.FC = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [recipeIngredients, setRecipeIngredients] = useState([])

  useEffect(() => {
    fetch('http://localhost:8000/recipes')
      .then(res => res.json())
      .then(setRecipes)
      .catch(err => console.error("Error fetching recipes:", err));
  }, []);

  useEffect(() => {
    if (selectedId !== null) {
      fetch(`http://localhost:8000/recipes/${selectedId}`)
        .then(res => res.json())
        .then(data => setRecipeIngredients(data.ingredients || data))
        .catch(err => console.error("Error fetching recipe details:", err));
    }
  }, [selectedId]);

  const selectedRecipe = recipes.find(i => i["id"] === selectedId);

if (selectedRecipe) {
    return (
      <div className="detail-container">
        <div className="back-btn">
          <button onClick={() => setSelectedId(null)}>
            Back to Ingredient List
          </button>
        </div>
        
        <div className="detail-container">
          <h2 className="detail-header">{selectedRecipe["title"]}</h2>
          <p className="detail-card">Recipe ID: #{selectedRecipe["id"]}</p>
          <p className="detail-card">Prep Time: {selectedRecipe["prep_time"]} min</p>
          <p className="detail-card">Cook Time: {selectedRecipe["cook_time"]} min</p>
          <p className="detail-card">Steps: {(selectedRecipe as any)["steps"] || "No steps provided for this item."}</p>
          <table>
            <thead>
              <tr>
                <th className="table-header">Ingredient</th>
                <th className="table-header">Quantity (g)</th>
              </tr>
            </thead>
            <tbody>
              {recipeIngredients.map((ri) => (
                <tr key ={ri["recipe_id"]}>
                  <td className="table-cell">{ri["name"]}</td>
                  <td className="table-cell">{ri["quantity"]}</td>
                </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="form-stack">
      <table>
        <thead>
          <tr>
            <th className="table-header">ID</th>
            <th className="table-header">Recipe Title</th>
            <th className="table-header">Total Time</th>
          </tr>
        </thead>
        <tbody>
          {recipes.length === 0 ? (
            <tr>
              <td>
                No recipes saved yet.
              </td>
            </tr>
          ) : (
            recipes.map((r) => (
              <tr key ={r["id"]} onClick={() => setSelectedId(r["id"])}>
                <td className="table-cell">{r["id"]}</td>
                <td className="table-cell">{r["title"]}</td>
                <td className="table-cell">{r["prep_time"] + r["cook_time"]}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};