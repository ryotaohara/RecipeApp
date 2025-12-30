import React, { useState } from 'react';
import { RecipeForm } from './components/RecipeForm';
import { TotalsCard } from './components/TotalsCard';
import { CalculationTotals, RecipeData } from './types.ts';
// Note: Lucide is great for professional UIs
import { ChefHat } from 'lucide-react';

const App: React.FC = () => {
  // State to hold the totals returned from the logic tier
  const [totals, setTotals] = useState<CalculationTotals | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // This function simulates the V-Model logic flow:
  // Input (Frontend) -> Process (Backend) -> Output (TotalsCard)
  const handleRecipeSubmit = async (data: RecipeData) => {
    setIsCalculating(true);
    console.log("V-Model Data Flow - Sending to Backend:", data);

    // Mocking the Backend Calculation for local Mac testing
    // In production, this would be: const response = await api.saveRecipe(data);
    setTimeout(() => {
      const mockResult: CalculationTotals = {
        calories: Math.floor(Math.random() * 800) + 200,
        price: (Math.random() * 15) + 5,
        time: data.prep_time + data.cook_time
      };
      setTotals(mockResult);
      setIsCalculating(false);
    }, 800); 
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header Section */}
      <header className="bg-white border-b border-slate-200 py-6 mb-8 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 flex items-center justify-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <ChefHat className="text-white w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-800">
              K8s Recipe Engine
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              System Design: Presentation Tier
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 pb-20 space-y-8">
        
        <section>
          <RecipeForm onSubmitSuccess={handleRecipeSubmit} />
        </section>

        {/* This section only appears once calculation data is available */}
        { (totals || isCalculating) && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <h2 className="text-sm font-bold text-slate-600 uppercase">Calculated Summary</h2>
            </div>
            <TotalsCard totals={totals || { calories: 0, price: 0, time: 0 }} loading={isCalculating} />
          </section>
        )}

      </main>
      
    </div>
  );
};

export default App;