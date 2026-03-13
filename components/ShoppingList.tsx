import React, { useState } from 'react';
import { ShoppingItem } from '../types';
import { motion } from 'framer-motion';

interface ShoppingListProps {
  items: ShoppingItem[];
}

export const ShoppingList: React.FC<ShoppingListProps> = ({ items }) => {
  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  // Calculate total price
  const totalPrice = items.reduce((sum, item) => sum + (item.estimatedPrice || 0), 0);

  // State for checked items
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItem = (itemName: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemName)) {
      newChecked.delete(itemName);
    } else {
      newChecked.add(itemName);
    }
    setCheckedItems(newChecked);
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 md:mt-16 pb-16 md:pb-20 px-4 md:px-0" id="shopping-list-section">
      <div className="relative bg-[#FFFBF7] dark:bg-stone-900 p-6 md:p-12 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] rounded-sm text-[#2C2C2C] dark:text-stone-200">
         {/* Receipt jagged edge top - Light */}
         <div 
            className="absolute top-0 left-0 w-full h-4 bg-repeat-x dark:hidden" 
            style={{ 
                backgroundSize: "20px 20px", 
                backgroundImage: "radial-gradient(circle at 10px -5px, transparent 12px, #FFFBF7 13px)"
            }}
         ></div>
         {/* Receipt jagged edge top - Dark */}
         <div 
            className="absolute top-0 left-0 w-full h-4 bg-repeat-x hidden dark:block" 
            style={{ 
                backgroundSize: "20px 20px", 
                backgroundImage: "radial-gradient(circle at 10px -5px, transparent 12px, #1c1917 13px)"
            }}
         ></div>

         {/* Receipt jagged edge bottom - Light */}
        <div 
            className="absolute bottom-0 left-0 w-full h-4 bg-repeat-x transform rotate-180 dark:hidden" 
            style={{ 
                backgroundSize: "20px 20px", 
                backgroundImage: "radial-gradient(circle at 10px -5px, transparent 12px, #FFFBF7 13px)"
            }}
         ></div>
         {/* Receipt jagged edge bottom - Dark */}
        <div 
            className="absolute bottom-0 left-0 w-full h-4 bg-repeat-x transform rotate-180 hidden dark:block" 
            style={{ 
                backgroundSize: "20px 20px", 
                backgroundImage: "radial-gradient(circle at 10px -5px, transparent 12px, #1c1917 13px)"
            }}
         ></div>

        <div className="text-center mb-8 md:mb-10 border-b-2 border-stone-200 dark:border-stone-700 pb-6 border-dashed">
          <h2 className="text-2xl md:text-3xl font-serif tracking-tight uppercase text-[#2C2C2C] dark:text-stone-100">Liste de Courses</h2>
          <p className="text-stone-500 dark:text-stone-400 font-mono text-xs md:text-sm mt-2">Ticket Estimatif</p>
        </div>

        <div className="space-y-8">
          {Object.entries(groupedItems).map(([category, categoryItems], categoryIndex) => (
            <motion.div 
              key={category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <h3 className="text-[#C8553D] dark:text-[#E26D5C] font-bold tracking-widest text-xs uppercase mb-4 pl-1">
                {category}
              </h3>
              <ul className="space-y-3">
                {(categoryItems as ShoppingItem[]).map((item, itemIndex) => {
                   const isChecked = checkedItems.has(item.item);
                   return (
                    <li 
                      key={`${category}-${itemIndex}`} 
                      className="flex items-start group cursor-pointer"
                      onClick={() => toggleItem(item.item)}
                    >
                      <div className={`
                        w-5 h-5 mt-0.5 rounded border transition-all duration-200 flex items-center justify-center flex-shrink-0
                        ${isChecked ? 'bg-[#588157] dark:bg-[#7A9E79] border-[#588157] dark:border-[#7A9E79]' : 'border-stone-300 dark:border-stone-600 group-hover:border-[#588157] dark:group-hover:border-[#7A9E79]'}
                      `}>
                         {isChecked && (
                           <svg className="w-3.5 h-3.5 text-white dark:text-stone-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                           </svg>
                         )}
                      </div>
                      
                      <div className="ml-3 md:ml-4 flex-1">
                        <div className="flex justify-between items-baseline gap-2">
                          <span className={`
                            font-serif text-base md:text-lg leading-none transition-all duration-200
                            ${isChecked ? 'text-stone-300 dark:text-stone-600 line-through decoration-stone-300 dark:decoration-stone-600' : 'text-stone-800 dark:text-stone-200'}
                          `}>
                            {item.item}
                          </span>
                          <span className="font-mono text-xs md:text-sm text-stone-600 dark:text-stone-400 whitespace-nowrap">
                             {item.estimatedPrice.toFixed(2)} €
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                             <span className="font-mono text-[10px] md:text-xs text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                                {item.quantity}
                             </span>
                        </div>
                        {item.notes && !isChecked && (
                            <p className="text-[10px] md:text-xs text-[#588157] dark:text-[#7A9E79] mt-1 font-light italic">
                                Note: {item.notes}
                            </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t-2 border-dashed border-stone-200 dark:border-stone-700">
            <div className="flex justify-between items-end">
                <span className="font-serif text-lg md:text-xl text-stone-600 dark:text-stone-400">TOTAL ESTIMÉ</span>
                <span className="font-mono text-2xl md:text-3xl font-bold text-[#2C2C2C] dark:text-stone-100">{totalPrice.toFixed(2)} €</span>
            </div>
            <p className="text-[10px] md:text-xs text-stone-400 dark:text-stone-500 mt-2 text-right italic">* Prix moyens observés, peuvent varier en magasin.</p>
        </div>

        <div className="mt-10 md:mt-12 text-center font-mono text-[10px] md:text-xs text-stone-400 dark:text-stone-500">
           *** MERCI DE VOTRE VISITE ***
        </div>
      </div>
    </div>
  );
};