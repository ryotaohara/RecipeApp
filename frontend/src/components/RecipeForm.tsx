import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { RecipeData, IngredientOption } from '../types.ts';
import { Plus, Trash2, Save } from 'lucide-react';

interface RecipeFormProps {
  onSubmitSuccess: (data: any) => void;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({ onSubmitSuccess }) => {
  // 1. State Management
  const [availableIngredients, setAvailableIngredients] = useState<IngredientOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<RecipeData>({
    title: '',
    servings: 1,
    prep_time: 0,
    cook_time: 0,
    instructions: '',
    ingredients: []
  });

  // 2. Load Ingredients from Backend on Mount
  useEffect(() => {
    const loadData = async () => {
      const data = await api.getIngredients();
      setAvailableIngredients(data);
      setLoading(false);
    };
    loadData();
  }, []);

  // 3. Form Handlers
  const addIngredientRow = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { ingredient_id: '', quantity: 0 }]
    });
  };

  const removeIngredientRow = (index: number) => {
    const newIngs = formData.ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: newIngs });
  };

  const handleIngredientChange = (index: number, field: string, value: string) => {
    const newIngs = [...formData.ingredients];
    if (field === 'ingredient_id') {
      // Convert to number for Postgres/FastAPI compatibility
      newIngs[index].ingredient_id = parseInt(value);
    } else {
      newIngs[index].quantity = parseFloat(value) || 0;
    }
    setFormData({ ...formData, ingredients: newIngs });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.ingredients.length === 0) {
      alert("Please add at least one ingredient");
      return;
    }
    
    try {
      const result = await api.saveRecipe(formData);
      onSubmitSuccess(result);
    } catch (err) {
      console.error("Submission failed", err);
      alert("Error saving recipe. Check backend connection.");
    }
  };

  if (loading) return <div className="p-10 text-center">Connecting to Logic Tier...</div>;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 uppercase">Recipe Title</label>
          <input 
            required
            className="w-full border-2 border-slate-100 p-3 rounded-xl focus:border-blue-500 outline-none transition"
            placeholder="e.g. Grandma's Chicken Pasta"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase">Prep Time (min)</label>
            <input 
              type="number" required
              className="w-full border-2 border-slate-100 p-3 rounded-xl focus:border-blue-500 outline-none"
              onChange={e => setFormData({...formData, prep_time: parseInt(e.target.value)})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase">Cook Time (min)</label>
            <input 
              type="number" required
              className="w-full border-2 border-slate-100 p-3 rounded-xl focus:border-blue-500 outline-none"
              onChange={e => setFormData({...formData, cook_time: parseInt(e.target.value)})}
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-50">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-700 uppercase">Ingredients Mapping</label>
            <button 
              type="button" onClick={addIngredientRow}
              className="flex items-center gap-1 text-xs font-bold bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition"
            >
              <Plus size={14} /> Add Row
            </button>
          </div>

          {formData.ingredients.map((item, index) => (
            <div key={index} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
              <select 
                required
                className="flex-grow border-2 border-slate-100 p-3 rounded-xl focus:border-blue-500 outline-none bg-white"
                onChange={e => handleIngredientChange(index, 'ingredient_id', e.target.value)}
              >
                <option value="">Select Ingredient</option>
                {availableIngredients.map(ing => (
                  <option key={ing.id} value={ing.id}>{ing.name}</option>
                ))}
              </select>
              <input 
                type="number" required
                className="w-28 border-2 border-slate-100 p-3 rounded-xl focus:border-blue-500 outline-none"
                placeholder="Grams"
                onChange={e => handleIngredientChange(index, 'quantity', e.target.value)}
              />
              <button 
                type="button" onClick={() => removeIngredientRow(index)}
                className="text-slate-300 hover:text-red-500 p-2 transition"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
        >
          <Save size={20} /> Calculate & Save
        </button>
      </form>
    </div>
  );
};