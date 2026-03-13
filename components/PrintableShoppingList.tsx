import React from 'react';
import { ShoppingItem } from '../types';

interface PrintableShoppingListProps {
  items: ShoppingItem[];
}

export const PrintableShoppingList: React.FC<PrintableShoppingListProps> = ({ items }) => {
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  const totalPrice = items.reduce((sum, item) => sum + (item.estimatedPrice || 0), 0);

  return (
    <div className="absolute top-0 left-[-9999px] w-[600px] bg-[#FFFBF7] text-[#2C2C2C] p-12" id="printable-shopping-list-container">
      <div className="text-center mb-10 border-b-2 border-stone-200 pb-6 border-dashed">
        <h2 className="text-4xl font-serif tracking-tight uppercase">Liste de Courses</h2>
        <p className="text-stone-500 font-mono text-lg mt-2">Ticket Estimatif</p>
      </div>

      <div className="space-y-10">
        {Object.entries(groupedItems).map(([category, categoryItems], categoryIndex) => (
          <div key={categoryIndex}>
            <h3 className="text-[#C8553D] font-bold tracking-widest text-lg uppercase mb-6 pl-1 border-b border-stone-100 pb-2">
              {category}
            </h3>
            <ul className="space-y-4">
              {(categoryItems as ShoppingItem[]).map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start">
                  <div className="w-6 h-6 mt-1 rounded border-2 border-stone-300 flex-shrink-0"></div>
                  <div className="ml-5 flex-1">
                    <div className="flex justify-between items-baseline gap-4">
                      <span className="font-serif text-2xl leading-none text-stone-800">
                        {item.item}
                      </span>
                      <span className="font-mono text-lg text-stone-600 whitespace-nowrap">
                        {item.estimatedPrice.toFixed(2)} €
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-mono text-sm text-stone-500 bg-stone-100 px-3 py-1 rounded">
                        {item.quantity}
                      </span>
                    </div>
                    {item.notes && (
                      <p className="text-sm text-[#588157] mt-2 font-light italic">
                        Note: {item.notes}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t-2 border-dashed border-stone-200">
        <div className="flex justify-between items-end">
          <span className="font-serif text-2xl text-stone-600">TOTAL ESTIMÉ</span>
          <span className="font-mono text-4xl font-bold text-[#2C2C2C]">{totalPrice.toFixed(2)} €</span>
        </div>
        <p className="text-sm text-stone-400 mt-4 text-right italic">* Prix moyens observés, peuvent varier en magasin.</p>
      </div>

      <div className="mt-16 text-center font-mono text-sm text-stone-400">
        *** MERCI DE VOTRE VISITE ***
      </div>
    </div>
  );
};
