import React, { useEffect, useState } from 'react';

export const IngredientList: React.FC = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/ingredients')
      .then(res => res.json())
      .then(setRecipes);
  }, []);

  return (
    <div className="form-stack">
      {recipes.length === 0 ? (
        <p>No ingredients saved yet.</p>
      ) : (
        recipes.map((r: any) => (
          <div key={r.id} className="items">
            <strong>{r.name}</strong>
            <span>{r.description}</span>
            <span>{r.calories_per_g}</span>
            <span>{r.price_per_g}</span>
          </div>
        ))
      )}
    </div>
  );
};