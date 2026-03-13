import React, { useState } from 'react';
import { UserInput } from '../types';
import { motion } from 'framer-motion';

interface InputSectionProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onSubmit, isLoading }) => {
  const [address, setAddress] = useState('');
  const [supermarket, setSupermarket] = useState('');
  const [peopleCount, setPeopleCount] = useState(2);
  const [budget, setBudget] = useState('');
  const [diet, setDiet] = useState('');
  const [unwantedIngredients, setUnwantedIngredients] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address && supermarket) {
      onSubmit({ 
        address, 
        supermarket,
        peopleCount,
        budget: budget || undefined,
        diet: diet || undefined,
        unwantedIngredients: unwantedIngredients || undefined
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="bg-white/80 dark:bg-stone-800/80 backdrop-blur-md paper-texture p-6 md:p-10 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] border border-stone-100 dark:border-stone-700 relative overflow-hidden transition-colors duration-300">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#588157]/5 dark:bg-[#588157]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#C8553D]/5 dark:bg-[#C8553D]/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>

        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-serif text-[#2C2C2C] dark:text-stone-100 mb-3 leading-tight">
            Préparez votre semaine
          </h2>
          <p className="text-stone-500 dark:text-stone-400 mb-6 font-light text-base md:text-lg">
            Des menus équilibrés et chiffrés, adaptés à votre quartier.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2 group">
              <label htmlFor="address" className="block text-xs font-bold tracking-widest text-stone-500 dark:text-stone-400 uppercase">
                Votre Adresse
              </label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="10 Rue de la Paix, Paris..."
                disabled={isLoading}
                className="w-full bg-[#F9F8F6] dark:bg-stone-900 border-b-2 border-stone-200 dark:border-stone-700 px-4 py-3 text-base md:text-lg outline-none transition-colors focus:border-[#C8553D] dark:focus:border-[#E26D5C] focus:bg-white dark:focus:bg-stone-800 placeholder-stone-300 dark:placeholder-stone-600 rounded-t-lg text-[#2C2C2C] dark:text-stone-100"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2 group">
                    <label htmlFor="supermarket" className="block text-xs font-bold tracking-widest text-stone-500 dark:text-stone-400 uppercase">
                        Supermarché Préféré
                    </label>
                    <input
                        type="text"
                        id="supermarket"
                        value={supermarket}
                        onChange={(e) => setSupermarket(e.target.value)}
                        placeholder="Monoprix, Leclerc..."
                        disabled={isLoading}
                        className="w-full bg-[#F9F8F6] dark:bg-stone-900 border-b-2 border-stone-200 dark:border-stone-700 px-4 py-3 text-base md:text-lg outline-none transition-colors focus:border-[#588157] dark:focus:border-[#7A9E79] focus:bg-white dark:focus:bg-stone-800 placeholder-stone-300 dark:placeholder-stone-600 rounded-t-lg text-[#2C2C2C] dark:text-stone-100"
                        required
                    />
                </div>
                <div className="space-y-2 group">
                    <label htmlFor="peopleCount" className="block text-xs font-bold tracking-widest text-stone-500 dark:text-stone-400 uppercase">
                        Personnes
                    </label>
                    <input
                        type="number"
                        id="peopleCount"
                        min="1"
                        max="20"
                        value={peopleCount}
                        onChange={(e) => setPeopleCount(parseInt(e.target.value))}
                        disabled={isLoading}
                        className="w-full bg-[#F9F8F6] dark:bg-stone-900 border-b-2 border-stone-200 dark:border-stone-700 px-4 py-3 text-base md:text-lg outline-none transition-colors focus:border-[#588157] dark:focus:border-[#7A9E79] focus:bg-white dark:focus:bg-stone-800 placeholder-stone-300 dark:placeholder-stone-600 rounded-t-lg text-[#2C2C2C] dark:text-stone-100"
                        required
                    />
                </div>
            </div>

            <div className="pt-2">
              <button 
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm text-[#C8553D] dark:text-[#E26D5C] font-medium hover:text-[#a03d28] dark:hover:text-[#f08a78] transition-colors"
              >
                <span>{showAdvanced ? 'Masquer les filtres' : 'Ajouter un budget, régime ou préférences'}</span>
                <svg 
                  className={`w-4 h-4 transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`} 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <motion.div 
              initial={false}
              animate={{ height: showAdvanced ? 'auto' : 0, opacity: showAdvanced ? 1 : 0 }}
              className="overflow-hidden"
            >
              <div className="pt-2 pb-4 space-y-4 border-t border-dashed border-stone-200 dark:border-stone-700 mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="budget" className="block text-xs font-bold tracking-widest text-stone-500 dark:text-stone-400 uppercase">
                      Budget Max
                    </label>
                    <input
                      type="text"
                      id="budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="Ex: 100€"
                      disabled={isLoading}
                      className="w-full bg-[#F9F8F6] dark:bg-stone-900 border-b-2 border-stone-200 dark:border-stone-700 px-3 py-2 text-base outline-none focus:border-[#2C2C2C] dark:focus:border-stone-400 rounded-t-lg text-[#2C2C2C] dark:text-stone-100 placeholder-stone-300 dark:placeholder-stone-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="diet" className="block text-xs font-bold tracking-widest text-stone-500 dark:text-stone-400 uppercase">
                      Régime
                    </label>
                    <select
                      id="diet"
                      value={diet}
                      onChange={(e) => setDiet(e.target.value)}
                      disabled={isLoading}
                      className="w-full bg-[#F9F8F6] dark:bg-stone-900 border-b-2 border-stone-200 dark:border-stone-700 px-3 py-2 text-base outline-none focus:border-[#2C2C2C] dark:focus:border-stone-400 rounded-t-lg appearance-none text-[#2C2C2C] dark:text-stone-100"
                    >
                      <option value="">Aucun</option>
                      <option value="Végétarien">Végétarien</option>
                      <option value="Végétalien">Végétalien</option>
                      <option value="Sans Gluten">Sans Gluten</option>
                      <option value="Sans Lactose">Sans Lactose</option>
                      <option value="Pescétarien">Pescétarien</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="unwanted" className="block text-xs font-bold tracking-widest text-stone-500 dark:text-stone-400 uppercase">
                    Aliments à éviter
                  </label>
                  <input
                    type="text"
                    id="unwanted"
                    value={unwantedIngredients}
                    onChange={(e) => setUnwantedIngredients(e.target.value)}
                    placeholder="Ex: Coriandre, Champignons, Arachides..."
                    disabled={isLoading}
                    className="w-full bg-[#F9F8F6] dark:bg-stone-900 border-b-2 border-stone-200 dark:border-stone-700 px-3 py-2 text-base outline-none focus:border-[#2C2C2C] dark:focus:border-stone-400 rounded-t-lg text-[#2C2C2C] dark:text-stone-100 placeholder-stone-300 dark:placeholder-stone-600"
                  />
                </div>
              </div>
            </motion.div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 md:py-4 px-6 rounded-lg text-white dark:text-stone-900 font-medium text-base md:text-lg tracking-wide transition-all transform duration-300 shadow-md
                  ${isLoading 
                    ? 'bg-stone-300 dark:bg-stone-600 cursor-not-allowed scale-95' 
                    : 'bg-[#2C2C2C] dark:bg-stone-100 hover:bg-black dark:hover:bg-white hover:shadow-xl hover:-translate-y-1 active:scale-95'
                  }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5 text-white dark:text-stone-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Recherche des prix...
                  </span>
                ) : (
                  "Générer mon Menu & Devis"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};