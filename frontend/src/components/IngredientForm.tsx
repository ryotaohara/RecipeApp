import React, { useState } from 'react';

export const IngredientForm = () => {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

    const payload = {
      name: name,
      calories_per_g: parseFloat(calories),
      price_per_g: parseFloat(price)
    };

	try {
		const res = await fetch('http://localhost:8000/add_ingredients', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});

		if (res.ok) {
			alert("Ingredient added successfully!");
			// Clear the form
			setName('');
			setCalories('');
			setPrice('');
		} else {
			alert("Failed to save ingredient. Check backend console.");
		}
	} catch (error) {
		console.error("Error saving ingredient:", error);
		alert("Could not connect to the backend.");
	} finally {
		setLoading(false);
	}
};

  return (
    <form onSubmit={handleSubmit} className="form-stack">
      <div className="input-group">
        <label>Ingredient Name</label>
        <input
					value={name}
					onChange={e => setName(e.target.value)}
					placeholder="e.g. Avocado" required
				/>
      </div>
      <div className="row">
        <div className="input-group flex-1">
          <label>Calories per 100g</label>
          <input
						type="number"
						step="0.01"
						value={calories}
						onChange={e => setCalories(e.target.value)}
						placeholder="0.00" required
					/>
        </div>
        <div className="input-group flex-1">
          <label>Price per 100g</label>
          <input
						type="number"
						step="0.01"
						value={price}
						onChange={e => setPrice(e.target.value)}
						placeholder="0.00" required
					/>
        </div>
      </div>
      <button type="submit" className="primary-btn">Add to Ingredient List</button>
    </form>
  );
};