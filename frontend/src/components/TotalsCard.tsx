import React from 'react';
import { CalculationTotals } from '../types.ts';
// Note: You can install 'lucide-react' for icons: npm install lucide-react
import { Flame, DollarSign, Clock } from 'lucide-react';

interface TotalsCardProps {
  totals: CalculationTotals;
  loading?: boolean;
}

export const TotalsCard: React.FC<TotalsCardProps> = ({ totals, loading }) => {
  if (loading) {
    return (
      <div className="animate-pulse bg-gray-100 p-6 rounded-xl h-32 flex items-center justify-center">
        <span className="text-gray-400">Calculating...</span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-md border border-blue-100">
      <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-4">
        Recipe Impact
      </h3>
      
      <div className="grid grid-cols-3 gap-4">
        {/* Calories Column */}
        <div className="flex flex-col items-center">
          <div className="p-2 bg-orange-100 rounded-full mb-2">
            <Flame className="w-5 h-5 text-orange-600" />
          </div>
          <span className="text-2xl font-black text-gray-800">{totals.calories}</span>
          <span className="text-xs text-gray-500 font-medium">Calories</span>
        </div>

        {/* Price Column */}
        <div className="flex flex-col items-center border-x border-gray-100">
          <div className="p-2 bg-green-100 rounded-full mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <span className="text-2xl font-black text-gray-800">${totals.price.toFixed(2)}</span>
          <span className="text-xs text-gray-500 font-medium">Cost</span>
        </div>

        {/* Time Column */}
        <div className="flex flex-col items-center">
          <div className="p-2 bg-blue-100 rounded-full mb-2">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-2xl font-black text-gray-800">{totals.time}</span>
          <span className="text-xs text-gray-500 font-medium">Minutes</span>
        </div>
      </div>
    </div>
  );
};