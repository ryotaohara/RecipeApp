import React, { useEffect, useState } from 'react';

export const IngredientList: React.FC = () => {
  const [ingredients, setIngredients] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/ingredients')
      .then(res => res.json())
      .then(setIngredients)
      .catch(err => console.error("Error fetching ingredients:", err));
  }, []);

  const selectedIngredient = ingredients.find(i => i["id"] === selectedId);

if (selectedIngredient) {
    return (
      <div className="detail-container">
        <div className="back-btn">
          <button onClick={() => setSelectedId(null)}>
            Back to Ingredient List
          </button>
        </div>
        
        <div className="detail-container">
          <h2 className="detail-header">{selectedIngredient["name"]}</h2>
          <p className="detail-card">Ingredient ID: #{selectedIngredient["id"]}</p>
          <p className="detail-card">Calories: {selectedIngredient["calories_per_g"]} cal/g</p>
          <p className="detail-card">Price: {selectedIngredient["price_per_g"]} Yen/g</p>
          <p className="detail-card">Description: {(selectedIngredient as any).description || "No description available."}</p>
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
            <th className="table-header">Ingredient Name</th>
            <th className="table-header">Calories per 100g</th>
            <th className="table-header">Price per 100g</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.length === 0 ? (
            <tr>
              <td>
                No ingredients saved yet.
              </td>
            </tr>
          ) : (
            ingredients.map((ing) => (
              <tr key ={ing["id"]} onClick={() => setSelectedId(ing["id"])}>
                <td className="table-cell">{ing["id"]}</td>
                <td className="table-cell">{ing["name"]}</td>
                <td className="table-cell">{ing["calories_per_g"]}</td>
                <td className="table-cell">{ing["price_per_g"]}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};