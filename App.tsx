import React, { useState, useEffect } from 'react';
import { UserInput, WeeklyPlanResponse, AppState } from './types';
import { generateWeeklyPlan } from './services/geminiService';
import { savePlan } from './services/dbService';
import { InputSection } from './components/InputSection';
import { PlanDisplay } from './components/PlanDisplay';
import { ShoppingList } from './components/ShoppingList';
import { SavedPlans } from './components/SavedPlans';
import { PrintableRecipes } from './components/PrintableRecipes';
import { PrintableMenu } from './components/PrintableMenu';
import { PrintableShoppingList } from './components/PrintableShoppingList';
import { ExportModal } from './components/ExportModal';
import { exportElementToPDF, exportMultipleElementsToPDF } from './utils/pdfHelper';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from './firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [data, setData] = useState<WeeklyPlanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [user, setUser] = useState<User | null>(null);
  const [showSavedPlans, setShowSavedPlans] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Check local storage or system preference on mount
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Erreur de connexion:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowSavedPlans(false);
    } catch (err) {
      console.error("Erreur de déconnexion:", err);
    }
  };

  const handleSavePlan = async () => {
    if (!user || !data) return;
    setIsSaving(true);
    try {
      const title = `Menu du ${new Date().toLocaleDateString('fr-FR')}`;
      await savePlan(title, data);
      alert("Votre menu a été sauvegardé avec succès !");
    } catch (err: any) {
      console.error("Erreur de sauvegarde:", err);
      alert(`Erreur lors de la sauvegarde: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadPlan = (plan: WeeklyPlanResponse) => {
    setData(plan);
    setAppState(AppState.SUCCESS);
    setShowSavedPlans(false);
  };

  const handleInputSubmit = async (input: UserInput) => {
    setAppState(AppState.LOADING);
    setError(null);
    try {
      const result = await generateWeeklyPlan(input);
      setData(result);
      setAppState(AppState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(`Erreur: ${err.message || "Impossible de générer le plan."}`);
      setAppState(AppState.ERROR);
    }
  };

  const resetApp = () => {
    setAppState(AppState.IDLE);
    setData(null);
    setError(null);
  };

  const handleExport = async (options: { menu: boolean; shoppingList: boolean; recipes: boolean }) => {
    if (!data) return;
    setIsExporting(true);
    
    try {
      const timestamp = new Date().getTime();

      if (options.menu) {
        await exportElementToPDF('printable-menu-container', `Market_Pal_Menu_${timestamp}.pdf`, {
          orientation: 'landscape',
          format: 'a4',
          margin: 10
        });
      }

      if (options.shoppingList) {
        await exportElementToPDF('printable-shopping-list-container', `Market_Pal_Courses_${timestamp}.pdf`, {
          orientation: 'portrait',
          format: [100, 200], // Narrow format for mobile/receipt
          margin: 5
        });
      }

      if (options.recipes) {
        const allMeals = data.weeklyPlan.flatMap(day => [day.breakfast, day.lunch, day.dinner]);
        const recipeIds = allMeals.map((_, i) => `recipe-card-${i}`);
        
        await exportMultipleElementsToPDF(recipeIds, `Market_Pal_Recettes_${timestamp}.pdf`, {
          orientation: 'portrait',
          format: 'a4',
          margin: 10
        });
      }
      
      setShowExportModal(false);
    } catch (err) {
      console.error("PDF Export Error:", err);
      alert("Erreur lors de la création du PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] dark:bg-stone-900 text-[#2C2C2C] dark:text-stone-100 selection:bg-[#C8553D] selection:text-white overflow-x-hidden transition-colors duration-300">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] z-50 mix-blend-multiply dark:mix-blend-screen" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <nav className="w-full py-4 md:py-6 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 relative z-20">
        <div className="font-serif text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2 cursor-pointer" onClick={resetApp}>
          <span className="w-3 h-3 bg-[#C8553D] rounded-full"></span>
          Market Pal // dim-gggl
        </div>
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
          <button 
            onClick={toggleDarkMode} 
            className="p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors text-stone-500 dark:text-stone-400"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          
          {user ? (
            <div className="flex items-center gap-3 md:gap-4">
              <button onClick={() => setShowSavedPlans(true)} className="text-sm font-medium hover:text-[#C8553D] dark:hover:text-[#E26D5C] transition-colors">
                Mes Menus
              </button>
              <button onClick={handleLogout} className="text-sm font-medium text-stone-500 dark:text-stone-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                Déconnexion
              </button>
            </div>
          ) : (
            <button onClick={handleLogin} className="text-sm font-medium hover:text-[#C8553D] dark:hover:text-[#E26D5C] transition-colors">
              Connexion
            </button>
          )}
          {appState === AppState.SUCCESS && (
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 md:ml-4 md:pl-4 border-t md:border-t-0 md:border-l border-stone-200 dark:border-stone-700 pt-2 md:pt-0 w-full md:w-auto">
              {user && (
                <button onClick={handleSavePlan} disabled={isSaving} className="text-xs md:text-sm font-medium bg-stone-200 dark:bg-stone-700 text-[#2C2C2C] dark:text-stone-100 px-3 md:px-4 py-2 rounded-full hover:bg-stone-300 dark:hover:bg-stone-600 transition-all">
                  {isSaving ? "Sauvegarde..." : "Sauvegarder"}
                </button>
              )}
              <button onClick={() => setShowExportModal(true)} disabled={isExporting} className="text-xs md:text-sm font-medium bg-[#C8553D] text-white px-3 md:px-4 py-2 rounded-full hover:bg-black dark:hover:bg-stone-800 transition-all">
                {isExporting ? "Chargement..." : "Télécharger PDF"}
              </button>
              <button onClick={resetApp} className="text-xs md:text-sm font-medium hover:text-[#C8553D] dark:hover:text-[#E26D5C] px-2 py-2">Nouveau</button>
            </div>
          )}
        </div>
      </nav>

      <main className="container mx-auto px-4 pb-20 pt-4 md:pt-8 relative z-10">
        <AnimatePresence mode="wait">
          {showSavedPlans && (
            <SavedPlans onClose={() => setShowSavedPlans(false)} onLoadPlan={handleLoadPlan} />
          )}

          {appState === AppState.IDLE && (
            <motion.div key="idle" exit={{ opacity: 0, y: -20 }}>
               <InputSection onSubmit={handleInputSubmit} isLoading={false} />
            </motion.div>
          )}

          {appState === AppState.LOADING && (
            <motion.div key="loading" className="flex flex-col items-center justify-center min-h-[50vh] text-center">
               <div className="w-12 h-12 md:w-16 md:h-16 mb-6 border-4 border-stone-200 dark:border-stone-700 border-t-[#C8553D] dark:border-t-[#C8553D] rounded-full animate-spin" />
               <h3 className="text-lg md:text-xl font-serif">Composition de votre menu...</h3>
               <p className="text-stone-400 dark:text-stone-500 mt-2 text-xs md:text-sm px-4">Nous interrogeons Google Maps pour trouver votre magasin...</p>
            </motion.div>
          )}

          {appState === AppState.ERROR && (
             <motion.div key="error" className="flex flex-col items-center justify-center min-h-[40vh] text-center max-w-lg mx-auto px-4">
                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-100 dark:border-red-900/30 w-full">
                  <p className="text-[#C8553D] dark:text-[#E26D5C] mb-4 font-medium text-sm md:text-base">{error}</p>
                  <button onClick={resetApp} className="px-6 py-2 bg-[#2C2C2C] dark:bg-stone-100 text-white dark:text-stone-900 rounded-lg hover:bg-black dark:hover:bg-white transition-colors">Réessayer</button>
                </div>
             </motion.div>
          )}

          {appState === AppState.SUCCESS && data && (
            <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <PlanDisplay 
                plan={data.weeklyPlan} 
                supermarketContext={data.supermarketContext} 
                locationConfirmed={data.locationConfirmed}
                sources={data.sources}
              />
              <ShoppingList items={data.shoppingList} />
              
              {/* Hidden Print Components */}
              <PrintableMenu plan={data.weeklyPlan} />
              <PrintableShoppingList items={data.shoppingList} />
              <PrintableRecipes plan={data.weeklyPlan} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <ExportModal 
        isOpen={showExportModal} 
        onClose={() => setShowExportModal(false)} 
        onExport={handleExport} 
        isExporting={isExporting} 
      />

      <footer className="text-center py-8 text-stone-400 dark:text-stone-500 text-xs">
         <p>© {new Date().getFullYear()} Market Pal.</p>
      </footer>
    </div>
  );
};

export default App;