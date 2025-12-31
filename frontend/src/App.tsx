import React, { useState } from 'react';
import { RecipeForm } from './components/RecipeForm';
import { IngredientForm } from './components/IngredientForm';
import { RecipeList } from './components/RecipeList';
import { IngredientList } from './components/IngredientList';
import { Utensils, BookOpen, ChefHat } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'recipe' | 'ingredient' | 'RecipeList'>('recipe');

  return (
    <div className="app-container">

      {/* Navigation Header */}
      <nav className="navbar">
        <div className="nav-logo">
          <ChefHat size={24} />
          <span>RECIPE ENGINE</span>
        </div>
        <div className="nav-links">
          <button 
            onClick={() => setActiveTab('recipe')}
            className={activeTab === 'recipe' ? 'active' : ''}
          >
            <Utensils size={18} /> Add a Recipe
          </button>
          <button 
            onClick={() => setActiveTab('ingredient')}
            className={activeTab === 'ingredient' ? 'active' : ''}
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
        {activeTab === 'recipe' && (
          <RecipeForm onSaved={() => setActiveTab('recipe')} />
        )}
        {activeTab === 'ingredient' && (
          <IngredientForm onSaved={() => setActiveTab('ingredient')} />
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