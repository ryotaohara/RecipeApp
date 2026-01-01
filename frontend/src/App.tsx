import { useState } from 'react';
import { RecipeForm } from './components/RecipeForm';
import { IngredientForm } from './components/IngredientForm';
import { RecipeList } from './components/RecipeList';
import { IngredientList } from './components/IngredientList';
import { Utensils, BookOpen, ChefHat } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'RecipeForm'|'IngredientForm'|'RecipeList'|'IngredientList'>('RecipeForm');

  return (
    <div className="app-container">

      {/* Navigation Header */}
      <nav className="navbar">
        <div className="nav-logo">
          <ChefHat size={24} /> RECIPE APP
        </div>
        <div className="nav-links">
          <button 
            onClick={() => setActiveTab('RecipeForm')}
            className={activeTab === 'RecipeForm' ? 'active' : ''}
          >
            <Utensils size={18} /> Add a Recipe
          </button>
          <button 
            onClick={() => setActiveTab('IngredientForm')}
            className={activeTab === 'IngredientForm' ? 'active' : ''}
          >
            <Utensils size={18} /> Add an Ingredient
          </button>
          <button 
            onClick={() => setActiveTab('RecipeList')}
            className={activeTab === 'RecipeList' ? 'active' : ''}
          >
            <BookOpen size={18} /> Recipe List
          </button>
          <button 
            onClick={() => setActiveTab('IngredientList')}
            className={activeTab === 'IngredientList' ? 'active' : ''}
          >
            <BookOpen size={18} /> Ingredient List
          </button>
        </div>
      </nav>

      {/* 2. Content Area */}
      <main className="content-area">
        {activeTab === 'RecipeForm' && (
          <RecipeForm />
        )}
        {activeTab === 'IngredientForm' && (
          <IngredientForm />
        )}
        {activeTab === 'RecipeList' && (
          <RecipeList />
        )}
        {activeTab === 'IngredientList' && (
          <IngredientList />
        )}
      </main>
    </div>
  );
}