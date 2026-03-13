import React, { useState } from 'react';
import { DayPlan, Meal, GroundingSource } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface PlanDisplayProps {
  plan: DayPlan[];
  supermarketContext: string;
  locationConfirmed: string;
  sources?: GroundingSource[];
}

const MealCard: React.FC<{ title: string; meal: Meal; delay: number; onClick: (meal: Meal) => void }> = ({ title, meal, delay, onClick }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    onClick={() => onClick(meal)}
    className="mb-4 last:mb-0 group cursor-pointer"
  >
    <div className="flex items-baseline justify-between mb-1">
      <span className="text-xs font-bold text-[#C8553D] dark:text-[#E26D5C] tracking-widest uppercase">{title}</span>
      <span className="text-xs text-stone-400 dark:text-stone-500 flex items-center gap-1 group-hover:text-[#C8553D] dark:group-hover:text-[#E26D5C] transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        {meal.cookingTimeMinutes}m
      </span>
    </div>
    <div className="flex justify-between items-start gap-2">
        <h4 className="font-serif text-lg leading-tight text-stone-800 dark:text-stone-200 group-hover:text-[#588157] dark:group-hover:text-[#7A9E79] group-hover:underline decoration-[#588157]/30 dark:decoration-[#7A9E79]/30 underline-offset-4 transition-all duration-200">
        {meal.name}
        </h4>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[#588157] dark:text-[#7A9E79]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </div>
    </div>
    <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 leading-relaxed line-clamp-2">
      {meal.description}
    </p>
  </motion.div>
);

const RecipeModal: React.FC<{ meal: Meal | null; onClose: () => void }> = ({ meal, onClose }) => {
    if (!meal) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 dark:bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-[#FFFBF7] dark:bg-stone-900 w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-xl shadow-2xl paper-texture relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 right-0 p-4 flex justify-end bg-gradient-to-b from-[#FFFBF7] dark:from-stone-900 to-transparent z-10">
                    <button onClick={onClose} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors text-stone-500 dark:text-stone-400 hover:text-[#C8553D] dark:hover:text-[#E26D5C]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="px-6 md:px-8 pb-8">
                    <div className="text-center mb-6">
                        <span className="text-[#C8553D] dark:text-[#E26D5C] font-bold tracking-widest text-xs uppercase block mb-2">Recette</span>
                        <h3 className="text-2xl md:text-3xl font-serif text-[#2C2C2C] dark:text-stone-100 leading-tight mb-4">{meal.name}</h3>
                        <div className="inline-flex items-center gap-2 bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full text-sm text-stone-600 dark:text-stone-300 font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {meal.cookingTimeMinutes} min
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h4 className="font-serif text-xl border-b border-stone-200 dark:border-stone-700 pb-2 mb-3 text-[#588157] dark:text-[#7A9E79]">Ingrédients</h4>
                            <ul className="grid grid-cols-1 gap-2 text-stone-700 dark:text-stone-300">
                                {meal.recipe?.ingredients?.map((ing, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm md:text-base">
                                        <span className="mt-1.5 w-1.5 h-1.5 bg-[#C8553D] dark:bg-[#E26D5C] rounded-full flex-shrink-0"></span>
                                        {ing}
                                    </li>
                                )) || <li className="italic text-stone-400 dark:text-stone-500">Aucun ingrédient listé.</li>}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-serif text-xl border-b border-stone-200 dark:border-stone-700 pb-2 mb-3 text-[#588157] dark:text-[#7A9E79]">Préparation</h4>
                            <ol className="space-y-4 text-stone-700 dark:text-stone-300">
                                {meal.recipe?.instructions?.map((step, i) => (
                                    <li key={i} className="flex gap-4 text-sm md:text-base leading-relaxed">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 font-bold flex items-center justify-center text-xs">
                                            {i + 1}
                                        </span>
                                        <p>{step}</p>
                                    </li>
                                )) || <li className="italic text-stone-400 dark:text-stone-500">Aucune instruction listée.</li>}
                            </ol>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan, supermarketContext, locationConfirmed, sources }) => {
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  return (
    <div className="w-full" id="plan-display-section">
      <AnimatePresence>
        {selectedMeal && <RecipeModal meal={selectedMeal} onClose={() => setSelectedMeal(null)} />}
      </AnimatePresence>

      <div className="mb-10 text-center">
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 1 }}
        >
            <h2 className="text-3xl md:text-4xl font-serif text-[#2C2C2C] dark:text-stone-100 mb-4">La Carte de la Semaine</h2>
            <div className="inline-block bg-white dark:bg-stone-800 px-4 md:px-6 py-3 rounded-xl shadow-sm border border-stone-200 dark:border-stone-700 text-left max-w-2xl mx-4 md:mx-auto">
                <p className="text-sm text-stone-600 dark:text-stone-300 flex items-start gap-2 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#588157] dark:text-[#7A9E79] mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>
                        <span className="font-semibold">{locationConfirmed}</span>
                        <span className="block italic font-light mt-1">{supermarketContext}</span>
                    </span>
                </p>
                {sources && sources.length > 0 && (
                  <div className="pt-2 border-t border-stone-100 dark:border-stone-700 flex flex-wrap gap-2">
                    <span className="text-[10px] text-stone-400 dark:text-stone-500 uppercase tracking-widest w-full mb-1">Sources vérifiées :</span>
                    {sources.map((source, idx) => (
                      <a key={idx} href={source.uri} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#C8553D] dark:text-[#E26D5C] hover:underline flex items-center gap-1">
                        {source.title} 
                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </a>
                    ))}
                  </div>
                )}
            </div>
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-4 italic no-print">Cliquez sur un plat pour voir la recette complète</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {plan.map((day, index) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="bg-white dark:bg-stone-800 rounded-xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border-t-4 border-[#588157]/20 dark:border-[#588157]/40 hover:border-[#588157] dark:hover:border-[#7A9E79]"
          >
            <h3 className="text-xl md:text-2xl font-serif text-[#2C2C2C] dark:text-stone-100 mb-4 md:mb-6 border-b border-stone-100 dark:border-stone-700 pb-2">
              {day.day}
            </h3>
            
            <div className="space-y-4 md:space-y-6">
              <MealCard title="Matin" meal={day.breakfast} delay={index * 0.1 + 0.1} onClick={setSelectedMeal} />
              <MealCard title="Midi" meal={day.lunch} delay={index * 0.1 + 0.2} onClick={setSelectedMeal} />
              <MealCard title="Soir" meal={day.dinner} delay={index * 0.1 + 0.3} onClick={setSelectedMeal} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};