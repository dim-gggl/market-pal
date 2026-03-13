import React from 'react';
import { DayPlan } from '../types';

interface PrintableMenuProps {
  plan: DayPlan[];
}

export const PrintableMenu: React.FC<PrintableMenuProps> = ({ plan }) => {
  return (
    <div className="absolute top-0 left-[-9999px] w-[1122px] h-[793px] bg-[#FFFBF7] text-[#2C2C2C] p-8 flex flex-col" id="printable-menu-container">
      <div className="text-center mb-6 border-b-2 border-stone-200 pb-4">
        <h1 className="text-5xl font-serif text-[#2C2C2C] tracking-tight">Menu de la Semaine</h1>
        <p className="text-stone-500 font-mono mt-2 text-lg">Market Pal</p>
      </div>

      <div className="flex-1 grid grid-cols-4 gap-4">
        {plan.map((day, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm border-t-4 border-[#588157]/40 flex flex-col h-full">
            <h2 className="text-2xl font-serif text-center border-b border-stone-100 pb-2 mb-3 text-[#2C2C2C]">{day.day}</h2>
            
            <div className="flex-1 flex flex-col justify-between gap-2">
              <div className="bg-stone-50 rounded p-3 flex-1">
                <span className="text-[10px] font-bold text-[#C8553D] tracking-widest uppercase block mb-1">Matin</span>
                <h3 className="font-serif text-base leading-tight text-stone-800">{day.breakfast.name}</h3>
              </div>
              
              <div className="bg-stone-50 rounded p-3 flex-1">
                <span className="text-[10px] font-bold text-[#C8553D] tracking-widest uppercase block mb-1">Midi</span>
                <h3 className="font-serif text-base leading-tight text-stone-800">{day.lunch.name}</h3>
              </div>
              
              <div className="bg-stone-50 rounded p-3 flex-1">
                <span className="text-[10px] font-bold text-[#C8553D] tracking-widest uppercase block mb-1">Soir</span>
                <h3 className="font-serif text-base leading-tight text-stone-800">{day.dinner.name}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
