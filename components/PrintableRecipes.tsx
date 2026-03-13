import React from 'react';
import { DayPlan } from '../types';

interface PrintableRecipesProps {
  plan: DayPlan[];
}

export const PrintableRecipes: React.FC<PrintableRecipesProps> = ({ plan }) => {
  const allMeals = plan.flatMap(day => [
    { ...day.breakfast, dayName: day.day, mealType: 'Matin' },
    { ...day.lunch, dayName: day.day, mealType: 'Midi' },
    { ...day.dinner, dayName: day.day, mealType: 'Soir' }
  ]);

  return (
    <div className="absolute top-0 left-[-9999px] w-[800px] bg-white text-[#2C2C2C]" id="printable-recipes-container">
      {allMeals.map((meal, idx) => (
        <div key={idx} id={`recipe-card-${idx}`} className="w-[800px] p-10 bg-white text-[#2C2C2C] mb-10">
          <div className="text-center mb-8 border-b border-stone-200 pb-6">
            <span className="text-[#C8553D] font-bold tracking-widest text-xs uppercase block mb-2">
              {meal.dayName} - {meal.mealType}
            </span>
            <h3 className="text-4xl font-serif text-[#2C2C2C] leading-tight mb-4">{meal.name}</h3>
            <div className="inline-flex items-center gap-2 bg-stone-100 px-4 py-2 rounded-full text-sm text-stone-600 font-medium">
              Temps de préparation : {meal.cookingTimeMinutes} min
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h4 className="font-serif text-2xl border-b border-stone-200 pb-2 mb-4 text-[#588157]">Ingrédients</h4>
              <ul className="grid grid-cols-2 gap-4 text-stone-700">
                {meal.recipe?.ingredients?.map((ing, i) => (
                  <li key={i} className="flex items-start gap-2 text-lg">
                    <span className="mt-2 w-2 h-2 bg-[#C8553D] rounded-full flex-shrink-0"></span>
                    {ing}
                  </li>
                )) || <li className="italic text-stone-400">Aucun ingrédient listé.</li>}
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-2xl border-b border-stone-200 pb-2 mb-4 text-[#588157]">Préparation</h4>
              <ol className="space-y-6 text-stone-700">
                {meal.recipe?.instructions?.map((step, i) => (
                  <li key={i} className="flex gap-4 text-lg leading-relaxed">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-stone-200 text-stone-600 font-bold flex items-center justify-center text-sm mt-1">
                      {i + 1}
                    </span>
                    <p>{step}</p>
                  </li>
                )) || <li className="italic text-stone-400">Aucune instruction listée.</li>}
              </ol>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
