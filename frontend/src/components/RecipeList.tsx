import React, { useEffect, useState } from 'react';

export const RecipeList: React.FC = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/recipes')
      .then(res => res.json())
      .then(setRecipes);
  }, []);

  return (
    <div className="list">
      {recipes.length === 0 ? (
        <p>No recipes saved yet.</p>
      ) : (
        recipes.map((r: any) => (
          <div key={r.id} className="items">
            <strong>{r.title}</strong>
            <span>{r.prep_time + r.cook_time} mins total</span>
          </div>
        ))
      )}
    </div>
  );
};