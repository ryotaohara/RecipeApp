import React, { useState, useEffect } from 'react';
import { Plus, Trash2} from 'lucide-react';

export const RecipeForm = () => {
  const [rows, setRows] = useState([{ ingredient_id: 0, quantity: 0 }]);
  const [title, setTitle] = useState('');
  const [prepTime, setPrepTime] = useState(0);
  const [cookTime, setCookTime] = useState(0);
  const [steps, setSteps] = useState('');
  const [availableIngredients, setAvailableIngredients] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/ingredients')
      .then(res => res.json())
      .then(setAvailableIngredients)
      .catch(err => console.error("Could not load ingredients", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title,
      prep_time: prepTime,
      cook_time: cookTime,
      steps,
      ingredients: rows.filter(r => r.ingredient_id > 0 && r.quantity > 0)
    };

    if (!payload.title || payload.ingredients.length === 0) {
      alert("Please provide a title and at least one ingredient.");
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert("Recipe Saved!");
      } else {
        alert("Backend error. Check your terminal.");
      }
    } catch (err) {
      alert("Connection failed. Is the backend running?");
    }
  };

  {/* Actual Rendered Page */}
  return (
    <form onSubmit={handleSubmit} className="form-stack">
      {/* Recipe Title */}
      <div className="input-group">
        <label className="input-title">Recipe Title</label>
        <input
          className="input-box"
          placeholder="e.g. Spicy Chicken Alfredo"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>

      {/* Prep and Cook Times */}
      <div className="row">
        <div className="input-group-flex">
          <label className="input-title">Prep Time (Min)</label>
          <input 
            type="number"
            value={prepTime}
            onChange={e => setPrepTime(parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="input-group-flex">
          <label className="input-title">Cook Time (Min)</label>
          <input 
            type="number" 
            value={cookTime}
            onChange={e => setCookTime(parseInt(e.target.value) || 0)}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="input-group">
        <label className="input-title">Steps</label>
        <textarea
          className="input-box"
          placeholder="e.g. 1. Dice tomatoes &#10; 2. Add olive oil"
          value={steps}
          onChange={e => setSteps(e.target.value)}
        />
      </div>

      {/* Ingredients Section */}
      <div className="input-group">
        <label>Ingredients</label>
        
        {rows.map((row, i) => (
          <div key={i} className="input-group-ing">
            <select 
              className="input-group-flex"
              value={row.ingredient_id}
              onChange={e => {
                const newRows = [...rows];
                newRows[i].ingredient_id = parseInt(e.target.value);
                setRows(newRows);
              }}
            >
              <option value="0">Choose Ingredient...</option>
              {availableIngredients.map(ing => (
                <option key={ing["id"]} value={ing["id"]}>{ing["name"]}</option>
              ))}
            </select>
            <input 
              type="number" 
              placeholder="g"
              onChange={e => {
                const newRows = [...rows];
                newRows[i].quantity = parseFloat(e.target.value) || 0;
                setRows(newRows);
              }}
            />
            {rows.length > 1 && (
              <button 
                type="button"
                onClick={() => setRows(rows.filter((_, idx) => idx !== i))}
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        ))}
        
        <button
          type="button"
          className="add-btn-ing"
          onClick={() => setRows([...rows, { ingredient_id: 0, quantity: 0 }])}
        >
          <Plus size={16} /> Add Ingredient
        </button>
      </div>

      <button type="submit" className="add-btn">Save
      </button>
    </form>
  );
};