import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: { menu: boolean; shoppingList: boolean; recipes: boolean }) => void;
  isExporting: boolean;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onExport, isExporting }) => {
  const [options, setOptions] = useState({
    menu: true,
    shoppingList: true,
    recipes: true,
  });

  const handleToggle = (key: keyof typeof options) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExport = () => {
    onExport(options);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-[#FFFBF7] dark:bg-stone-900 rounded-2xl shadow-2xl p-6 md:p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors text-stone-500 dark:text-stone-400 hover:text-[#C8553D] dark:hover:text-[#E26D5C]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

          <h2 className="text-2xl md:text-3xl font-serif text-[#2C2C2C] dark:text-stone-100 mb-2">Télécharger PDF</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm mb-6">Sélectionnez les éléments que vous souhaitez exporter.</p>

          <div className="space-y-4 mb-8">
            <label className="flex items-center gap-4 p-4 rounded-xl border border-stone-200 dark:border-stone-700 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
              <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${options.menu ? 'bg-[#588157] border-[#588157]' : 'border-stone-300 dark:border-stone-600'}`}>
                {options.menu && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
              </div>
              <input type="checkbox" className="hidden" checked={options.menu} onChange={() => handleToggle('menu')} />
              <div className="flex-1">
                <span className="block font-medium text-[#2C2C2C] dark:text-stone-100">Menu de la semaine</span>
                <span className="block text-xs text-stone-500 dark:text-stone-400">Format paysage, idéal pour le frigo</span>
              </div>
            </label>

            <label className="flex items-center gap-4 p-4 rounded-xl border border-stone-200 dark:border-stone-700 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
              <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${options.shoppingList ? 'bg-[#588157] border-[#588157]' : 'border-stone-300 dark:border-stone-600'}`}>
                {options.shoppingList && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
              </div>
              <input type="checkbox" className="hidden" checked={options.shoppingList} onChange={() => handleToggle('shoppingList')} />
              <div className="flex-1">
                <span className="block font-medium text-[#2C2C2C] dark:text-stone-100">Liste de courses</span>
                <span className="block text-xs text-stone-500 dark:text-stone-400">Format mobile, clair et lisible</span>
              </div>
            </label>

            <label className="flex items-center gap-4 p-4 rounded-xl border border-stone-200 dark:border-stone-700 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
              <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${options.recipes ? 'bg-[#588157] border-[#588157]' : 'border-stone-300 dark:border-stone-600'}`}>
                {options.recipes && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
              </div>
              <input type="checkbox" className="hidden" checked={options.recipes} onChange={() => handleToggle('recipes')} />
              <div className="flex-1">
                <span className="block font-medium text-[#2C2C2C] dark:text-stone-100">Fiches recettes</span>
                <span className="block text-xs text-stone-500 dark:text-stone-400">Format A4, à conserver</span>
              </div>
            </label>
          </div>

          <button
            onClick={handleExport}
            disabled={isExporting || (!options.menu && !options.shoppingList && !options.recipes)}
            className={`w-full py-4 px-6 rounded-xl text-white font-medium text-lg tracking-wide transition-all transform duration-300 shadow-md
              ${isExporting || (!options.menu && !options.shoppingList && !options.recipes)
                ? 'bg-stone-300 dark:bg-stone-700 cursor-not-allowed' 
                : 'bg-[#C8553D] hover:bg-[#a03d28] hover:shadow-xl hover:-translate-y-1 active:scale-95'
              }`}
          >
            {isExporting ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Génération en cours...
              </span>
            ) : (
              "Télécharger"
            )}
          </button>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};
