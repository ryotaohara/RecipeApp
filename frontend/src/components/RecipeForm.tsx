import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Clock } from 'lucide-react';

interface IngredientOption {
  id: number;
  name: string;
}

export const RecipeForm = ({ onSaved }: { onSaved: (data: any) => void }) => {
  const [availableIngredients, setAvailableIngredients] = useState<IngredientOption[]>([]);
  const [rows, setRows] = useState([{ ingredient_id: 0, quantity: 0 }]);
  const [title, setTitle] = useState('');
  const [prepTime, setPrepTime] = useState(10);
  const [cookTime, setCookTime] = useState(20);

  useEffect(() => {
    fetch('http://localhost:8000/ingredients')
      .then(res => res.json())
      .then(setAvailableIngredients)
      .catch(err => console.error("Could not load ingredients", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validIngredients = rows.filter(r => r.ingredient_id > 0 && r.quantity > 0);
    
    if (!title || validIngredients.length === 0) {
      alert("Please provide a title and at least one ingredient.");
      return;
    }

    const payload = {
      title,
      prep_time: prepTime,
      cook_time: cookTime,
      ingredients: validIngredients
    };

    try {
      const res = await fetch('http://localhost:8000/recipes/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        onSaved(await res.json());
      } else {
        alert("Backend error. Check your terminal.");
      }
    } catch (err) {
      alert("Connection failed. Is the backend running?");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
      {/* Title Section */}
      <div className="space-y-1">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Recipe Title</label>
        <input 
          className="w-full text-2xl font-bold border-b-2 border-slate-100 focus:border-blue-500 outline-none pb-2 transition-colors"
          placeholder="e.g. Spicy Chicken Alfredo" 
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>

      {/* Time Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prep Time (Min)</label>
          <div className="relative">
            <Clock className="absolute left-3 top-3 text-slate-300" size={18} />
            <input 
              type="number" 
              className="w-full bg-slate-50 p-3 pl-10 rounded-xl outline-none focus:ring-2 ring-blue-100 transition"
              value={prepTime}
              onChange={e => setPrepTime(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cook Time (Min)</label>
          <div className="relative">
            <Clock className="absolute left-3 top-3 text-slate-300" size={18} />
            <input 
              type="number" 
              className="w-full bg-slate-50 p-3 pl-10 rounded-xl outline-none focus:ring-2 ring-blue-100 transition"
              value={cookTime}
              onChange={e => setCookTime(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>

      {/* Ingredients Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ingredients</label>
        </div>
        
        {rows.map((row, i) => (
          <div key={i} className="flex gap-3 items-center animate-in">
            <select 
              className="flex-grow bg-slate-50 p-3 rounded-xl outline-none focus:ring-2 ring-blue-100 transition"
              value={row.ingredient_id}
              onChange={e => {
                const newRows = [...rows];
                newRows[i].ingredient_id = parseInt(e.target.value);
                setRows(newRows);
              }}
            >
              <option value="0">Choose Ingredient...</option>
              {availableIngredients.map(ing => (
                <option key={ing.id} value={ing.id}>{ing.name}</option>
              ))}
            </select>
            <input 
              type="number" 
              placeholder="Grams"
              className="w-28 bg-slate-50 p-3 rounded-xl outline-none focus:ring-2 ring-blue-100 transition"
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
                className="text-slate-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        ))}
        
        <button 
          type="button" 
          onClick={() => setRows([...rows, { ingredient_id: 0, quantity: 0 }])}
          className="w-full py-3 border-2 border-dashed border-slate-100 text-slate-400 rounded-xl hover:bg-slate-50 hover:border-slate-200 transition-all font-bold text-sm flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Add Ingredient
        </button>
      </div>

      <button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
      >
        <Save size={20} /> Save & Calculate
      </button>
    </form>
  );
};