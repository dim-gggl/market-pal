import React, { useEffect, useState } from 'react';
import { getSavedPlans, SavedPlan, deleteSavedPlan } from '../services/dbService';
import { WeeklyPlanResponse } from '../types';
import { motion } from 'framer-motion';

interface SavedPlansProps {
  onLoadPlan: (plan: WeeklyPlanResponse) => void;
  onClose: () => void;
}

export const SavedPlans: React.FC<SavedPlansProps> = ({ onLoadPlan, onClose }) => {
  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const fetchedPlans = await getSavedPlans();
      setPlans(fetchedPlans);
    } catch (err: any) {
      setError(err.message || "Impossible de charger les plans sauvegardés.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleDelete = async (e: React.MouseEvent, planId: string) => {
    e.stopPropagation();
    try {
      await deleteSavedPlan(planId);
      setPlans(plans.filter(p => p.id !== planId));
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
    }
  };

  const handleLoad = (plan: SavedPlan) => {
    try {
      const parsedData = JSON.parse(plan.planData) as WeeklyPlanResponse;
      onLoadPlan(parsedData);
    } catch (err) {
      console.error("Erreur lors du chargement du plan:", err);
      alert("Ce plan semble corrompu et ne peut pas être chargé.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end" onClick={onClose}>
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-md bg-[#F9F8F6] dark:bg-stone-900 h-full shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 md:p-6 border-b border-stone-200 dark:border-stone-700 flex justify-between items-center bg-white dark:bg-stone-800">
          <h2 className="text-xl md:text-2xl font-serif text-[#2C2C2C] dark:text-stone-100">Mes Menus Sauvegardés</h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-full transition-colors text-stone-500 dark:text-stone-400 hover:text-[#C8553D] dark:hover:text-[#E26D5C]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-stone-200 dark:border-stone-700 border-t-[#C8553D] dark:border-t-[#E26D5C] rounded-full animate-spin" />
            </div>
          ) : error ? (
            <p className="text-red-500 dark:text-red-400 text-center">{error}</p>
          ) : plans.length === 0 ? (
            <div className="text-center py-10 text-stone-500 dark:text-stone-400">
              <p>Vous n'avez pas encore de menu sauvegardé.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {plans.map(plan => {
                const date = plan.createdAt ? new Date(plan.createdAt.toMillis()).toLocaleDateString('fr-FR') : 'Date inconnue';
                return (
                  <div 
                    key={plan.id}
                    onClick={() => handleLoad(plan)}
                    className="bg-white dark:bg-stone-800 p-4 rounded-xl shadow-sm border border-stone-100 dark:border-stone-700 cursor-pointer hover:border-[#C8553D] dark:hover:border-[#E26D5C] hover:shadow-md transition-all group"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg text-[#2C2C2C] dark:text-stone-100">{plan.title}</h3>
                        <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">Sauvegardé le {date}</p>
                      </div>
                      <button 
                        onClick={(e) => handleDelete(e, plan.id)}
                        className="p-2 text-stone-300 dark:text-stone-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                        title="Supprimer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
